import { v, ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import { validateSession } from "./utils";
import {
  STATUS_VALIDATOR,
  ACTIVE_STATUSES,
  TRANSITION_VALIDATOR,
  applyTransition,
  normalizeToUtcMidnight,
  nightCount,
  overlaps,
  validateGuestInput,
  generateReferenceCode,
  conflictScanLowerBound,
  MS_PER_DAY,
} from "./availability";

// ─── Shared helpers ─────────────────────────────────────────────────────────

/**
 * Scan a room's reservations that could overlap [ci, co) and return the first
 * active conflicting reservation, or null if the range is free.
 *
 * The scan is bounded on BOTH edges of the `by_room_and_checkInDate` index:
 *   - lower: `conflictScanLowerBound(ci)` — any overlapping stay must start at
 *     or after this point (stays are capped at MAX_STAY_NIGHTS).
 *   - upper: `co` — a stay starting on/after check-out cannot overlap.
 * This keeps the candidate set small and, critically, guarantees we never miss
 * a relevant reservation behind a `.take()` cap as a room's history grows.
 *
 * `ignoreIds` lets a caller exclude specific reservations (e.g. ones being
 * created in the same batch / the reservation being moved).
 */
async function findRoomConflict(
  ctx: QueryCtx | MutationCtx,
  roomId: Id<"rooms">,
  ci: number,
  co: number,
  ignoreIds?: ReadonlySet<Id<"reservations">>,
): Promise<Doc<"reservations"> | null> {
  const lowerBound = conflictScanLowerBound(ci);
  const candidates = await ctx.db
    .query("reservations")
    .withIndex("by_room_and_checkInDate", (q) =>
      q.eq("roomId", roomId).gte("checkInDate", lowerBound).lt("checkInDate", co),
    )
    .collect();

  for (const r of candidates) {
    if (ignoreIds?.has(r._id)) continue;
    if (!ACTIVE_STATUSES.has(r.status)) continue;
    if (overlaps(r.checkInDate, r.checkOutDate, ci, co)) return r;
  }
  return null;
}

/** Allocate a reference code not already used. Throws after several attempts. */
async function allocateReferenceCode(ctx: MutationCtx): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = generateReferenceCode();
    const existing = await ctx.db
      .query("reservations")
      .withIndex("by_reference_code", (q) => q.eq("referenceCode", code))
      .unique();
    if (!existing) return code;
  }
  throw new ConvexError("Could not allocate reference code");
}

/** Validator describing a single stored reservation document. */
const RESERVATION_OBJECT = v.object({
  _id: v.id("reservations"),
  _creationTime: v.number(),
  roomId: v.id("rooms"),
  referenceCode: v.string(),
  bookingGroupId: v.optional(v.string()),
  guestFullName: v.string(),
  guestEmail: v.string(),
  guestPhone: v.string(),
  guestCount: v.number(),
  checkInDate: v.number(),
  checkOutDate: v.number(),
  status: STATUS_VALIDATOR,
  totalPrice: v.number(),
  createdAt: v.number(),
  checkedInAt: v.optional(v.number()),
  checkedOutAt: v.optional(v.number()),
  cancelledAt: v.optional(v.number()),
  specialRequests: v.optional(v.string()),
});

// ─── Public queries ───────────────────────────────────────────────────────

/** PUBLIC: Is a room available for the given half-open date range [ci, co)? */
export const getAvailabilityForRoom = query({
  args: {
    roomId: v.id("rooms"),
    checkInDate: v.number(),
    checkOutDate: v.number(),
  },
  returns: v.object({ available: v.boolean() }),
  handler: async (ctx, args) => {
    const ci = normalizeToUtcMidnight(args.checkInDate);
    const co = normalizeToUtcMidnight(args.checkOutDate);
    if (ci >= co) return { available: false };

    const conflict = await findRoomConflict(ctx, args.roomId, ci, co);
    return { available: conflict === null };
  },
});

/** PUBLIC: Dates (UTC-midnight ms) blocked by any active reservation for a room,
 *  bounded to a look-ahead window to keep the payload small. */
export const getBlockedDatesForRoom = query({
  args: {
    roomId: v.id("rooms"),
    fromDate: v.number(),
    throughDate: v.number(),
  },
  returns: v.array(v.number()),
  handler: async (ctx, args) => {
    const from = normalizeToUtcMidnight(args.fromDate);
    const through = normalizeToUtcMidnight(args.throughDate);

    // Bound the scan on both edges of the index. Lower bound accounts for stays
    // that started before `from` but extend into the window.
    const lowerBound = conflictScanLowerBound(from);
    const candidates = await ctx.db
      .query("reservations")
      .withIndex("by_room_and_checkInDate", (q) =>
        q
          .eq("roomId", args.roomId)
          .gte("checkInDate", lowerBound)
          .lt("checkInDate", through),
      )
      .collect();

    const blocked = new Set<number>();
    for (const r of candidates) {
      if (!ACTIVE_STATUSES.has(r.status)) continue;
      if (!overlaps(r.checkInDate, r.checkOutDate, from, through)) continue;
      const start = Math.max(r.checkInDate, from);
      const end = Math.min(r.checkOutDate, through);
      for (let d = start; d < end; d += MS_PER_DAY) {
        blocked.add(d);
      }
    }
    return Array.from(blocked).sort((a, b) => a - b);
  },
});

/** PUBLIC: Look up a reservation by reference code. Returns the record or null. */
export const getByReferenceCode = query({
  args: { referenceCode: v.string() },
  returns: v.union(v.null(), RESERVATION_OBJECT),
  handler: async (ctx, args) => {
    const reservation = await ctx.db
      .query("reservations")
      .withIndex("by_reference_code", (q) =>
        q.eq("referenceCode", args.referenceCode),
      )
      .unique();
    return reservation;
  },
});

/** PUBLIC: Look up every reservation that shares a booking with the given
 *  reference code. Single-room bookings return a one-element array; group
 *  bookings return all rooms reserved together. Powers the confirmation page. */
export const getReservationGroup = query({
  args: { referenceCode: v.string() },
  returns: v.array(RESERVATION_OBJECT),
  handler: async (ctx, args) => {
    const primary = await ctx.db
      .query("reservations")
      .withIndex("by_reference_code", (q) =>
        q.eq("referenceCode", args.referenceCode),
      )
      .unique();
    if (!primary) return [];
    if (!primary.bookingGroupId) return [primary];

    const group = await ctx.db
      .query("reservations")
      .withIndex("by_booking_group", (q) =>
        q.eq("bookingGroupId", primary.bookingGroupId),
      )
      .collect();
    // Stable order: by creation time.
    return group.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// ─── Public mutations ─────────────────────────────────────────────────────

/** PUBLIC: Create a single-room reservation. Validates, enforces the overlap
 *  check, and returns the reference code on success. */
export const create = mutation({
  args: {
    roomId: v.id("rooms"),
    guestFullName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    guestCount: v.number(),
    checkInDate: v.number(),
    checkOutDate: v.number(),
    specialRequests: v.optional(v.string()),
  },
  returns: v.object({ referenceCode: v.string() }),
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Room not found");

    const validated = validateGuestInput({
      guestFullName: args.guestFullName,
      guestEmail: args.guestEmail,
      guestPhone: args.guestPhone,
      guestCount: args.guestCount,
      checkInDate: args.checkInDate,
      checkOutDate: args.checkOutDate,
      specialRequests: args.specialRequests,
      roomCapacity: room.capacity,
      now: Date.now(),
    });

    const conflict = await findRoomConflict(
      ctx,
      args.roomId,
      validated.checkInDate,
      validated.checkOutDate,
    );
    if (conflict)
      throw new ConvexError("Room is not available for those dates");

    const referenceCode = await allocateReferenceCode(ctx);
    const nights = nightCount(validated.checkInDate, validated.checkOutDate);
    const totalPrice = room.pricePerNight * nights;

    await ctx.db.insert("reservations", {
      roomId: args.roomId,
      referenceCode,
      guestFullName: validated.guestFullName,
      guestEmail: validated.guestEmail,
      guestPhone: validated.guestPhone,
      guestCount: validated.guestCount,
      checkInDate: validated.checkInDate,
      checkOutDate: validated.checkOutDate,
      status: "pending",
      totalPrice,
      createdAt: Date.now(),
      specialRequests: validated.specialRequests,
    });
    return { referenceCode };
  },
});

/** PUBLIC: Atomically create a multi-room reservation. Either every room is
 *  booked (sharing one bookingGroupId) or none are — eliminating the partial /
 *  orphaned-booking risk of creating rooms one request at a time.
 *
 *  All rooms share the same date range. Each room carries its own guest count.
 */
export const createGroup = mutation({
  args: {
    guestFullName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    checkInDate: v.number(),
    checkOutDate: v.number(),
    specialRequests: v.optional(v.string()),
    rooms: v.array(
      v.object({
        roomId: v.id("rooms"),
        guestCount: v.number(),
      }),
    ),
  },
  returns: v.object({
    referenceCode: v.string(),
    bookingGroupId: v.string(),
    referenceCodes: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    if (args.rooms.length === 0)
      throw new ConvexError("Select at least one room");

    // Reject duplicate rooms in the same request — they would overlap with
    // each other on identical dates.
    const seen = new Set<string>();
    for (const r of args.rooms) {
      if (seen.has(r.roomId)) throw new ConvexError("Duplicate room in selection");
      seen.add(r.roomId);
    }

    const now = Date.now();
    let ci = 0;
    let co = 0;
    let sharedName = "";
    let sharedEmail = "";
    let sharedPhone = "";
    let sharedRequests: string | undefined;

    type Prepared = {
      roomId: Id<"rooms">;
      guestCount: number;
      totalPrice: number;
    };
    const prepared: Prepared[] = [];

    for (const sel of args.rooms) {
      const room = await ctx.db.get(sel.roomId);
      if (!room) throw new ConvexError("Room not found");

      // Validate guest info + dates against this room's capacity. Validation is
      // idempotent across rooms; we reuse the normalized result for the shared
      // fields.
      const validated = validateGuestInput({
        guestFullName: args.guestFullName,
        guestEmail: args.guestEmail,
        guestPhone: args.guestPhone,
        guestCount: sel.guestCount,
        checkInDate: args.checkInDate,
        checkOutDate: args.checkOutDate,
        specialRequests: args.specialRequests,
        roomCapacity: room.capacity,
        now,
      });
      ci = validated.checkInDate;
      co = validated.checkOutDate;
      sharedName = validated.guestFullName;
      sharedEmail = validated.guestEmail;
      sharedPhone = validated.guestPhone;
      sharedRequests = validated.specialRequests;

      const conflict = await findRoomConflict(ctx, sel.roomId, ci, co);
      if (conflict)
        throw new ConvexError(
          `${room.nameEn} is not available for those dates`,
        );

      const nights = nightCount(ci, co);
      prepared.push({
        roomId: sel.roomId,
        guestCount: validated.guestCount,
        totalPrice: room.pricePerNight * nights,
      });
    }

    // All checks passed — commit every room in this single transaction.
    const bookingGroupId = crypto.randomUUID();
    const referenceCodes: string[] = [];
    for (const p of prepared) {
      const referenceCode = await allocateReferenceCode(ctx);
      referenceCodes.push(referenceCode);
      await ctx.db.insert("reservations", {
        roomId: p.roomId,
        referenceCode,
        bookingGroupId,
        guestFullName: sharedName,
        guestEmail: sharedEmail,
        guestPhone: sharedPhone,
        guestCount: p.guestCount,
        checkInDate: ci,
        checkOutDate: co,
        status: "pending",
        totalPrice: p.totalPrice,
        createdAt: Date.now(),
        specialRequests: sharedRequests,
      });
    }

    return {
      referenceCode: referenceCodes[0],
      bookingGroupId,
      referenceCodes,
    };
  },
});

// ─── Admin queries ──────────────────────────────────────────────────────────

/** ADMIN: Paginated list of all reservations, ordered by createdAt desc. */
export const listPaginated = query({
  args: {
    sessionToken: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.object({
    page: v.array(v.any()),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
    pageStatus: v.optional(v.any()),
    splitCursor: v.optional(v.any()),
  }),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    return await ctx.db
      .query("reservations")
      .withIndex("by_created_at")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

/** ADMIN: All reservations for the timeline calendar view (no pagination). */
export const listAll = query({
  args: { sessionToken: v.string() },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    return await ctx.db
      .query("reservations")
      .withIndex("by_created_at")
      .order("desc")
      .take(2000);
  },
});

/** ADMIN: Count of reservations in `pending` status (for sidebar badge).
 *  Returns 0 for an invalid/expired session so a stale localStorage token only
 *  hides the badge rather than spamming the UI with errors. No data is exposed. */
export const pendingCount = query({
  args: { sessionToken: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken))
      .first();
    if (!session || session.expiresAt <= Date.now()) {
      return 0;
    }

    const pending = await ctx.db
      .query("reservations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(1000);
    return pending.length;
  },
});

// ─── Admin mutations ──────────────────────────────────────────────────────

/** ADMIN: Create a walk-in reservation (guest arrives without prior booking).
 *  Email and phone are optional; status is set directly to checkedIn. */
export const createWalkIn = mutation({
  args: {
    sessionToken: v.string(),
    roomId: v.id("rooms"),
    guestFullName: v.string(),
    guestPhone: v.optional(v.string()),
    guestCount: v.number(),
    checkInDate: v.number(),
    checkOutDate: v.number(),
    totalPrice: v.optional(v.number()),
    specialRequests: v.optional(v.string()),
  },
  returns: v.object({ referenceCode: v.string() }),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new ConvexError("Room not found");

    const ci = normalizeToUtcMidnight(args.checkInDate);
    const co = normalizeToUtcMidnight(args.checkOutDate);
    if (ci >= co) throw new ConvexError("Check-out must be after check-in");
    if (!args.guestFullName.trim()) throw new ConvexError("Guest name is required");
    if (args.guestCount < 1) throw new ConvexError("At least one guest is required");
    if (args.guestCount > room.capacity)
      throw new ConvexError("Guest count exceeds room capacity");

    const conflict = await findRoomConflict(ctx, args.roomId, ci, co);
    if (conflict) throw new ConvexError("Room is not available for those dates");

    const referenceCode = await allocateReferenceCode(ctx);
    const nights = nightCount(ci, co);
    const price = args.totalPrice ?? room.pricePerNight * nights;

    await ctx.db.insert("reservations", {
      roomId: args.roomId,
      referenceCode,
      guestFullName: args.guestFullName.trim(),
      guestEmail: "walkin@kaihotel.ge",
      guestPhone: args.guestPhone?.trim() || "—",
      guestCount: args.guestCount,
      checkInDate: ci,
      checkOutDate: co,
      status: "checkedIn",
      totalPrice: price,
      createdAt: Date.now(),
      checkedInAt: Date.now(),
      specialRequests: args.specialRequests?.trim() || undefined,
    });
    return { referenceCode };
  },
});

/** ADMIN: Atomically create a multi-room walk-in (or future-dated) booking.
 *  All rooms share the same date range and are written under one
 *  `bookingGroupId`. Either every room is committed or none are. Each room
 *  can carry its own guest count and an optional price override; the status
 *  is set automatically (today's check-in → `checkedIn`, future → `confirmed`).
 */
export const createWalkInGroup = mutation({
  args: {
    sessionToken: v.string(),
    guestFullName: v.string(),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    checkInDate: v.number(),
    checkOutDate: v.number(),
    specialRequests: v.optional(v.string()),
    rooms: v.array(
      v.object({
        roomId: v.id("rooms"),
        guestCount: v.number(),
        // Optional manual override of the auto-calculated total price.
        totalPrice: v.optional(v.number()),
      }),
    ),
  },
  returns: v.object({
    referenceCode: v.string(),
    bookingGroupId: v.string(),
    referenceCodes: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);

    if (args.rooms.length === 0)
      throw new ConvexError("Select at least one room");
    if (!args.guestFullName.trim())
      throw new ConvexError("Guest name is required");

    // Reject duplicate rooms in the same request — they would overlap with
    // each other on identical dates.
    const seen = new Set<string>();
    for (const r of args.rooms) {
      if (seen.has(r.roomId)) throw new ConvexError("Duplicate room in selection");
      seen.add(r.roomId);
    }

    const ci = normalizeToUtcMidnight(args.checkInDate);
    const co = normalizeToUtcMidnight(args.checkOutDate);
    if (ci >= co) throw new ConvexError("Check-out must be after check-in");

    const now = Date.now();
    const todayMidnight = normalizeToUtcMidnight(now);
    // Walk-ins arriving today get checkedIn immediately. Future bookings the
    // admin creates on the guest's behalf go in as confirmed.
    const status = ci <= todayMidnight ? "checkedIn" : "confirmed";

    type Prepared = {
      roomId: Id<"rooms">;
      guestCount: number;
      totalPrice: number;
    };
    const prepared: Prepared[] = [];

    for (const sel of args.rooms) {
      const room = await ctx.db.get(sel.roomId);
      if (!room) throw new ConvexError("Room not found");
      if (sel.guestCount < 1)
        throw new ConvexError("At least one guest is required per room");
      if (sel.guestCount > room.capacity)
        throw new ConvexError(
          `Guest count exceeds capacity for ${room.nameEn}`,
        );

      const conflict = await findRoomConflict(ctx, sel.roomId, ci, co);
      if (conflict)
        throw new ConvexError(
          `${room.nameEn} is not available for those dates`,
        );

      const nights = nightCount(ci, co);
      prepared.push({
        roomId: sel.roomId,
        guestCount: sel.guestCount,
        totalPrice: sel.totalPrice ?? room.pricePerNight * nights,
      });
    }

    const bookingGroupId = crypto.randomUUID();
    const referenceCodes: string[] = [];
    for (const p of prepared) {
      const referenceCode = await allocateReferenceCode(ctx);
      referenceCodes.push(referenceCode);
      await ctx.db.insert("reservations", {
        roomId: p.roomId,
        referenceCode,
        bookingGroupId,
        guestFullName: args.guestFullName.trim(),
        guestEmail: args.guestEmail?.trim() || "walkin@kaihotel.ge",
        guestPhone: args.guestPhone?.trim() || "—",
        guestCount: p.guestCount,
        checkInDate: ci,
        checkOutDate: co,
        status,
        totalPrice: p.totalPrice,
        createdAt: Date.now(),
        checkedInAt: status === "checkedIn" ? Date.now() : undefined,
        specialRequests: args.specialRequests?.trim() || undefined,
      });
    }

    return {
      referenceCode: referenceCodes[0],
      bookingGroupId,
      referenceCodes,
    };
  },
});

/** ADMIN: Blocked dates per room within a window. Used by the walk-in
 *  calendar to show strikethrough "unavailable" days alongside the room
 *  selection. Returns the set of UTC-midnight ms timestamps occupied by an
 *  active reservation for the given room. */
export const getBlockedDatesForRoomAdmin = query({
  args: {
    sessionToken: v.string(),
    roomId: v.id("rooms"),
    fromDate: v.number(),
    throughDate: v.number(),
  },
  returns: v.array(v.number()),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const from = normalizeToUtcMidnight(args.fromDate);
    const through = normalizeToUtcMidnight(args.throughDate);

    const lowerBound = conflictScanLowerBound(from);
    const candidates = await ctx.db
      .query("reservations")
      .withIndex("by_room_and_checkInDate", (q) =>
        q
          .eq("roomId", args.roomId)
          .gte("checkInDate", lowerBound)
          .lt("checkInDate", through),
      )
      .collect();

    const blocked = new Set<number>();
    for (const r of candidates) {
      if (!ACTIVE_STATUSES.has(r.status)) continue;
      if (!overlaps(r.checkInDate, r.checkOutDate, from, through)) continue;
      const start = Math.max(r.checkInDate, from);
      const end = Math.min(r.checkOutDate, through);
      for (let d = start; d < end; d += MS_PER_DAY) {
        blocked.add(d);
      }
    }
    return Array.from(blocked).sort((a, b) => a - b);
  },
});
export const transitionStatus = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("reservations"),
    transition: TRANSITION_VALIDATOR,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const reservation = await ctx.db.get(args.id);
    if (!reservation) throw new ConvexError("Reservation not found");

    const patch = applyTransition(
      reservation.status,
      args.transition,
      Date.now(),
    );
    await ctx.db.patch(args.id, patch);
    return null;
  },
});
