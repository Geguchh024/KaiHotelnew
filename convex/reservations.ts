import { v, ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
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
  MS_PER_DAY,
} from "./availability";

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

    const candidates = await ctx.db
      .query("reservations")
      .withIndex("by_room_and_checkInDate", (q) =>
        q.eq("roomId", args.roomId).lt("checkInDate", co),
      )
      .take(500);

    const conflict = candidates.some(
      (r) =>
        ACTIVE_STATUSES.has(r.status) &&
        overlaps(r.checkInDate, r.checkOutDate, ci, co),
    );
    return { available: !conflict };
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

    const candidates = await ctx.db
      .query("reservations")
      .withIndex("by_room_and_checkInDate", (q) =>
        q.eq("roomId", args.roomId).lt("checkInDate", through),
      )
      .take(500);

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
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("reservations"),
      _creationTime: v.number(),
      roomId: v.id("rooms"),
      referenceCode: v.string(),
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
    }),
  ),
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

/** PUBLIC: Create a reservation. Validates, enforces overlap check, and
 *  returns the reference code on success. */
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

    // Overlap check — same transaction
    const candidates = await ctx.db
      .query("reservations")
      .withIndex("by_room_and_checkInDate", (q) =>
        q
          .eq("roomId", args.roomId)
          .lt("checkInDate", validated.checkOutDate),
      )
      .take(500);
    const conflict = candidates.find(
      (r) =>
        ACTIVE_STATUSES.has(r.status) &&
        overlaps(
          r.checkInDate,
          r.checkOutDate,
          validated.checkInDate,
          validated.checkOutDate,
        ),
    );
    if (conflict)
      throw new ConvexError("Room is not available for those dates");

    // Unique reference code — retry up to 5 times
    let referenceCode = "";
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateReferenceCode();
      const existing = await ctx.db
        .query("reservations")
        .withIndex("by_reference_code", (q) => q.eq("referenceCode", code))
        .unique();
      if (!existing) {
        referenceCode = code;
        break;
      }
    }
    if (!referenceCode)
      throw new ConvexError("Could not allocate reference code");

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

/** ADMIN: Count of reservations in `pending` status (for sidebar badge). */
export const pendingCount = query({
  args: { sessionToken: v.string() },
  returns: v.number(),
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const pending = await ctx.db
      .query("reservations")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(1000);
    return pending.length;
  },
});

/** ADMIN: Transition one reservation to a new status. */
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
