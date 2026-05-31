/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { api } from "../_generated/api";
import schema from "../schema";
import { MS_PER_DAY, ACTIVE_STATUSES, type Transition } from "../availability";

const modules = import.meta.glob("../**/*.ts");

// ─── Helpers ────────────────────────────────────────────────────────────────

async function seedRoomAndAdmin(t: any, overrides?: { pricePerNight?: number; capacity?: number }) {
  const { roomId, sessionToken } = await t.run(async (ctx: any) => {
    const roomId = await ctx.db.insert("rooms", {
      nameKa: "ტესტ ნომერი",
      nameEn: "Test Room",
      descriptionKa: "ტესტ აღწერა",
      descriptionEn: "Test description",
      pricePerNight: overrides?.pricePerNight ?? 100,
      capacity: overrides?.capacity ?? 4,
      amenities: ["Wi-Fi"],
      imageUrl: "https://example.com/room.jpg",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const adminId = await ctx.db.insert("adminUsers", {
      username: "admin",
      passwordHash: "hash",
      createdAt: Date.now(),
    });
    const sessionToken = "test-session-token-" + Math.random().toString(36).slice(2);
    await ctx.db.insert("adminSessions", {
      adminUserId: adminId,
      token: sessionToken,
      expiresAt: Date.now() + 3600000,
      createdAt: Date.now(),
    });
    return { roomId, sessionToken };
  });
  return { roomId, sessionToken };
}

/** Base check-in date far in the future to avoid past-date validation. */
const FUTURE_BASE = Date.now() + 30 * MS_PER_DAY;

function futureDate(daysFromBase: number): number {
  return FUTURE_BASE + daysFromBase * MS_PER_DAY;
}


// ─── Property 1: No-double-booking invariant ────────────────────────────────
// **Validates: Requirements 3.1, 3.2, 3.3**

describe("Property 1: No-double-booking invariant", () => {
  it("no two active reservations on the same room overlap after any sequence of creates and transitions", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.oneof(
            // Create command
            fc.record({
              kind: fc.constant("create" as const),
              ciOffset: fc.integer({ min: 0, max: 300 }),
              nights: fc.integer({ min: 1, max: 14 }),
            }),
            // Transition command
            fc.record({
              kind: fc.constant("transition" as const),
              index: fc.nat(49),
              transition: fc.constantFrom<Transition>("confirm", "cancel", "checkIn", "checkOut", "markNoShow"),
            })
          ),
          { minLength: 1, maxLength: 10 }
        ),
        async (commands) => {
          const t = convexTest(schema, modules);
          const { roomId } = await seedRoomAndAdmin(t);
          const createdIds: string[] = [];

          for (const cmd of commands) {
            if (cmd.kind === "create") {
              const ci = futureDate(cmd.ciOffset);
              const co = futureDate(cmd.ciOffset + cmd.nights);
              try {
                await t.mutation(api.reservations.create, {
                  roomId,
                  guestFullName: "Test Guest",
                  guestEmail: "test@example.com",
                  guestPhone: "+1234567890",
                  guestCount: 2,
                  checkInDate: ci,
                  checkOutDate: co,
                });
                // Get the latest reservation by querying all
                const all = await t.run(async (ctx: any) => {
                  return await ctx.db.query("reservations").collect();
                });
                const latest = all[all.length - 1];
                if (latest) createdIds.push(latest._id);
              } catch {
                // Overlap rejection or other validation error — expected
              }
            } else {
              // Transition command
              if (createdIds.length === 0) continue;
              const targetId = createdIds[cmd.index % createdIds.length];
              const { sessionToken } = await t.run(async (ctx: any) => {
                const session = await ctx.db.query("adminSessions").first();
                return { sessionToken: session?.token ?? "" };
              });
              try {
                await t.mutation(api.reservations.transitionStatus, {
                  sessionToken,
                  id: targetId as any,
                  transition: cmd.transition,
                });
              } catch {
                // Invalid transition — expected
              }
            }
          }

          // INVARIANT CHECK: no two active reservations overlap
          const allReservations = await t.run(async (ctx: any) => {
            return await ctx.db.query("reservations").collect();
          });
          const active = allReservations.filter((r: any) => ACTIVE_STATUSES.has(r.status));

          for (let i = 0; i < active.length; i++) {
            for (let j = i + 1; j < active.length; j++) {
              const a = active[i];
              const b = active[j];
              // Non-overlapping: A.checkOutDate <= B.checkInDate || B.checkOutDate <= A.checkInDate
              const nonOverlapping = a.checkOutDate <= b.checkInDate || b.checkOutDate <= a.checkInDate;
              expect(nonOverlapping).toBe(true);
            }
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Property 2: Overlap boundary is allowed ────────────────────────────────
// **Validates: Requirements 3.4**

describe("Property 2: Edge-adjacent reservations both succeed", () => {
  it("two reservations where A.checkOutDate === B.checkInDate both coexist as active", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 300 }),
        fc.integer({ min: 1, max: 30 }),
        fc.integer({ min: 1, max: 30 }),
        async (baseOffset, n1, n2) => {
          const t = convexTest(schema, modules);
          const { roomId } = await seedRoomAndAdmin(t);

          const ci1 = futureDate(baseOffset);
          const co1 = futureDate(baseOffset + n1); // co1 = ci1 + n1 days
          const ci2 = co1; // ci2 === co1 (edge-adjacent)
          const co2 = futureDate(baseOffset + n1 + n2);

          // First reservation
          const result1 = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "Guest One",
            guestEmail: "one@example.com",
            guestPhone: "+1234567890",
            guestCount: 2,
            checkInDate: ci1,
            checkOutDate: co1,
          });
          expect(result1.referenceCode).toBeTruthy();

          // Second reservation — edge-adjacent, should succeed
          const result2 = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "Guest Two",
            guestEmail: "two@example.com",
            guestPhone: "+0987654321",
            guestCount: 2,
            checkInDate: ci2,
            checkOutDate: co2,
          });
          expect(result2.referenceCode).toBeTruthy();

          // Both should be active
          const allReservations = await t.run(async (ctx: any) => {
            return await ctx.db.query("reservations").collect();
          });
          const active = allReservations.filter((r: any) => ACTIVE_STATUSES.has(r.status));
          expect(active.length).toBe(2);
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Property 4: Cancellation releases dates ────────────────────────────────
// **Validates: Requirements 3.5, 6.7**

describe("Property 4: Cancel releases dates", () => {
  it("after cancelling a reservation, re-creating with the same dates succeeds", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 300 }),
        fc.integer({ min: 1, max: 30 }),
        async (baseOffset, nights) => {
          const t = convexTest(schema, modules);
          const { roomId, sessionToken } = await seedRoomAndAdmin(t);

          const ci = futureDate(baseOffset);
          const co = futureDate(baseOffset + nights);

          // Create the first reservation
          const result1 = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "Original Guest",
            guestEmail: "original@example.com",
            guestPhone: "+1234567890",
            guestCount: 2,
            checkInDate: ci,
            checkOutDate: co,
          });
          expect(result1.referenceCode).toBeTruthy();

          // Get the reservation ID
          const reservation = await t.run(async (ctx: any) => {
            return await ctx.db.query("reservations")
              .withIndex("by_reference_code", (q: any) => q.eq("referenceCode", result1.referenceCode))
              .unique();
          });

          // Cancel it
          await t.mutation(api.reservations.transitionStatus, {
            sessionToken,
            id: reservation._id,
            transition: "cancel",
          });

          // Re-create with the same dates — should succeed
          const result2 = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "New Guest",
            guestEmail: "new@example.com",
            guestPhone: "+0987654321",
            guestCount: 2,
            checkInDate: ci,
            checkOutDate: co,
          });
          expect(result2.referenceCode).toBeTruthy();
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Property 6: Reference code uniqueness and round-trip ───────────────────
// **Validates: Requirements 5.2, 5.6, 7.6**

describe("Property 6: Reference code round-trip and uniqueness", () => {
  it("every created reservation is retrievable by its reference code, unknown codes return null, and all codes are distinct", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 3, max: 15 }),
        async (count) => {
          const t = convexTest(schema, modules);
          const { roomId } = await seedRoomAndAdmin(t);
          const codes: string[] = [];

          // Create multiple non-overlapping reservations
          for (let i = 0; i < count; i++) {
            const ci = futureDate(i * 15); // 15-day gaps to avoid overlap
            const co = futureDate(i * 15 + 3); // 3-night stays
            const result = await t.mutation(api.reservations.create, {
              roomId,
              guestFullName: `Guest ${i}`,
              guestEmail: `guest${i}@example.com`,
              guestPhone: "+1234567890",
              guestCount: 1,
              checkInDate: ci,
              checkOutDate: co,
            });
            codes.push(result.referenceCode);
          }

          // All codes are distinct
          const uniqueCodes = new Set(codes);
          expect(uniqueCodes.size).toBe(codes.length);

          // Each code round-trips to the correct reservation
          for (let i = 0; i < codes.length; i++) {
            const found = await t.query(api.reservations.getByReferenceCode, {
              referenceCode: codes[i],
            });
            expect(found).not.toBeNull();
            expect(found!.referenceCode).toBe(codes[i]);
            expect(found!.guestFullName).toBe(`Guest ${i}`);
          }

          // Unknown code returns null
          const notFound = await t.query(api.reservations.getByReferenceCode, {
            referenceCode: "ZZZZZZZZ",
          });
          expect(notFound).toBeNull();
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Property 9: Price calculation ──────────────────────────────────────────
// **Validates: Requirements 5.4, 5.5**

describe("Property 9: Price calculation", () => {
  it("totalPrice equals pricePerNight × nights for any valid reservation", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5000 }),
        fc.integer({ min: 1, max: 365 }),
        async (pricePerNight, nights) => {
          const t = convexTest(schema, modules);
          const { roomId } = await seedRoomAndAdmin(t, { pricePerNight });

          const ci = futureDate(0);
          const co = futureDate(nights);

          const result = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "Price Test Guest",
            guestEmail: "price@example.com",
            guestPhone: "+1234567890",
            guestCount: 1,
            checkInDate: ci,
            checkOutDate: co,
          });

          // Look up the reservation and verify price
          const reservation = await t.query(api.reservations.getByReferenceCode, {
            referenceCode: result.referenceCode,
          });
          expect(reservation).not.toBeNull();
          expect(reservation!.totalPrice).toBe(pricePerNight * nights);
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Property 11: Admin authorization closure ───────────────────────────────
// **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

describe("Property 11: Unauthorized admin calls rejected", () => {
  it("listPaginated, pendingCount, and transitionStatus all reject with invalid token", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        async (badToken) => {
          const t = convexTest(schema, modules);
          const { roomId, sessionToken } = await seedRoomAndAdmin(t);

          // Ensure the bad token is not the valid one
          if (badToken === sessionToken) return; // skip this case

          // Test listPaginated with bad token
          await expect(
            t.query(api.reservations.listPaginated, {
              sessionToken: badToken,
              paginationOpts: { numItems: 10, cursor: null },
            })
          ).rejects.toThrow("Unauthorized");

          // pendingCount degrades gracefully for an invalid/stale token: it
          // returns 0 (the sidebar badge simply hides) and exposes NO data.
          const badCount = await t.query(api.reservations.pendingCount, {
            sessionToken: badToken,
          });
          expect(badCount).toBe(0);

          // Create a reservation to have a valid ID for transitionStatus
          const result = await t.mutation(api.reservations.create, {
            roomId,
            guestFullName: "Auth Test Guest",
            guestEmail: "auth@example.com",
            guestPhone: "+1234567890",
            guestCount: 2,
            checkInDate: futureDate(0),
            checkOutDate: futureDate(3),
          });

          const reservation = await t.run(async (ctx: any) => {
            return await ctx.db.query("reservations")
              .withIndex("by_reference_code", (q: any) => q.eq("referenceCode", result.referenceCode))
              .unique();
          });

          // Test transitionStatus with bad token
          await expect(
            t.mutation(api.reservations.transitionStatus, {
              sessionToken: badToken,
              id: reservation._id,
              transition: "confirm",
            })
          ).rejects.toThrow("Unauthorized");

          // Verify reservation is unchanged (still pending)
          const afterAttempt = await t.run(async (ctx: any) => {
            return await ctx.db.get(reservation._id);
          });
          expect(afterAttempt.status).toBe("pending");
        }
      ),
      { numRuns: 20 }
    );
  });
});


// ─── Full-lifecycle integration test ────────────────────────────────────────
// (Requirements: 3.2, 5.1, 5.3, 6.2, 6.4, 6.5, 8.2, 8.3)

describe("Full-lifecycle integration test", () => {
  it("creates a reservation, transitions through full lifecycle, and rejects overlapping booking", async () => {
    const t = convexTest(schema, modules);
    const { roomId, sessionToken } = await seedRoomAndAdmin(t);

    // Step 1: Create a reservation publicly
    const ci = futureDate(10);
    const co = futureDate(15); // 5 nights
    const createResult = await t.mutation(api.reservations.create, {
      roomId,
      guestFullName: "Lifecycle Guest",
      guestEmail: "lifecycle@example.com",
      guestPhone: "+1234567890",
      guestCount: 2,
      checkInDate: ci,
      checkOutDate: co,
    });
    expect(createResult.referenceCode).toBeTruthy();
    expect(createResult.referenceCode.length).toBe(8);

    // Step 2: Verify the reservation via public lookup
    const lookup = await t.query(api.reservations.getByReferenceCode, {
      referenceCode: createResult.referenceCode,
    });
    expect(lookup).not.toBeNull();
    expect(lookup!.status).toBe("pending");
    expect(lookup!.guestFullName).toBe("Lifecycle Guest");
    expect(lookup!.totalPrice).toBe(100 * 5); // 100/night × 5 nights

    // Step 3: Admin lists reservations
    const listResult = await t.query(api.reservations.listPaginated, {
      sessionToken,
      paginationOpts: { numItems: 10, cursor: null },
    });
    expect(listResult.page.length).toBe(1);
    expect(listResult.page[0].referenceCode).toBe(createResult.referenceCode);

    const resId = lookup!._id;

    // Step 4: Transition pending → confirmed
    await t.mutation(api.reservations.transitionStatus, {
      sessionToken,
      id: resId,
      transition: "confirm",
    });
    const afterConfirm = await t.query(api.reservations.getByReferenceCode, {
      referenceCode: createResult.referenceCode,
    });
    expect(afterConfirm!.status).toBe("confirmed");

    // Step 5: Transition confirmed → checkedIn
    await t.mutation(api.reservations.transitionStatus, {
      sessionToken,
      id: resId,
      transition: "checkIn",
    });
    const afterCheckIn = await t.query(api.reservations.getByReferenceCode, {
      referenceCode: createResult.referenceCode,
    });
    expect(afterCheckIn!.status).toBe("checkedIn");
    expect(afterCheckIn!.checkedInAt).toBeTypeOf("number");
    expect(afterCheckIn!.checkedInAt).toBeGreaterThan(0);

    // Step 6: Transition checkedIn → checkedOut
    await t.mutation(api.reservations.transitionStatus, {
      sessionToken,
      id: resId,
      transition: "checkOut",
    });
    const afterCheckOut = await t.query(api.reservations.getByReferenceCode, {
      referenceCode: createResult.referenceCode,
    });
    expect(afterCheckOut!.status).toBe("checkedOut");
    expect(afterCheckOut!.checkedOutAt).toBeTypeOf("number");
    expect(afterCheckOut!.checkedOutAt).toBeGreaterThan(0);

    // Step 7: Create a second reservation with overlapping dates — should fail
    // The first reservation is now checkedOut (terminal), so it shouldn't block.
    // Let's create one that IS active first, then try to overlap it.
    const ci2 = futureDate(20);
    const co2 = futureDate(25);
    await t.mutation(api.reservations.create, {
      roomId,
      guestFullName: "Active Guest",
      guestEmail: "active@example.com",
      guestPhone: "+1111111111",
      guestCount: 1,
      checkInDate: ci2,
      checkOutDate: co2,
    });

    // Now try to create an overlapping reservation
    await expect(
      t.mutation(api.reservations.create, {
        roomId,
        guestFullName: "Overlap Guest",
        guestEmail: "overlap@example.com",
        guestPhone: "+2222222222",
        guestCount: 1,
        checkInDate: futureDate(22), // overlaps [20, 25)
        checkOutDate: futureDate(27),
      })
    ).rejects.toThrow("Room is not available for those dates");
  });
});


// ─── Property 12: Group booking is atomic ───────────────────────────────────
// A multi-room booking either commits every room or none. If ANY room in the
// selection conflicts with an existing active reservation, the whole group is
// rejected and no new reservations are written.

describe("Property 12: Group booking atomicity", () => {
  it("rejects the entire group when any room conflicts, writing nothing", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 200 }),
        fc.integer({ min: 1, max: 14 }),
        async (baseOffset, nights) => {
          const t = convexTest(schema, modules);

          // Seed two rooms + an admin
          const { roomA, roomB } = await t.run(async (ctx: any) => {
            const mk = (name: string) =>
              ctx.db.insert("rooms", {
                nameKa: name,
                nameEn: name,
                descriptionKa: "d",
                descriptionEn: "d",
                pricePerNight: 100,
                capacity: 4,
                amenities: [],
                imageUrl: "https://example.com/r.jpg",
                createdAt: Date.now(),
                updatedAt: Date.now(),
              });
            const roomA = await mk("Room A");
            const roomB = await mk("Room B");
            return { roomA, roomB };
          });

          const ci = futureDate(baseOffset);
          const co = futureDate(baseOffset + nights);

          // Pre-book roomB for the same dates so the group must fail on roomB.
          await t.mutation(api.reservations.create, {
            roomId: roomB,
            guestFullName: "Existing Guest",
            guestEmail: "existing@example.com",
            guestPhone: "+1234567890",
            guestCount: 1,
            checkInDate: ci,
            checkOutDate: co,
          });

          const before = await t.run(async (ctx: any) =>
            ctx.db.query("reservations").collect(),
          );

          // Attempt a group booking of [roomA (free), roomB (taken)] — must fail.
          await expect(
            t.mutation(api.reservations.createGroup, {
              guestFullName: "Group Guest",
              guestEmail: "group@example.com",
              guestPhone: "+1987654321",
              checkInDate: ci,
              checkOutDate: co,
              rooms: [
                { roomId: roomA, guestCount: 2 },
                { roomId: roomB, guestCount: 2 },
              ],
            }),
          ).rejects.toThrow();

          // Nothing new was written — roomA was NOT partially booked.
          const after = await t.run(async (ctx: any) =>
            ctx.db.query("reservations").collect(),
          );
          expect(after.length).toBe(before.length);
        },
      ),
      { numRuns: 15 },
    );
  });

  it("commits all rooms and links them with one bookingGroupId on success", async () => {
    const t = convexTest(schema, modules);
    const { roomA, roomB } = await t.run(async (ctx: any) => {
      const mk = (name: string) =>
        ctx.db.insert("rooms", {
          nameKa: name,
          nameEn: name,
          descriptionKa: "d",
          descriptionEn: "d",
          pricePerNight: 80,
          capacity: 3,
          amenities: [],
          imageUrl: "https://example.com/r.jpg",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      const roomA = await mk("Room A");
      const roomB = await mk("Room B");
      return { roomA, roomB };
    });

    const ci = futureDate(5);
    const co = futureDate(8); // 3 nights

    const result = await t.mutation(api.reservations.createGroup, {
      guestFullName: "Group Guest",
      guestEmail: "group@example.com",
      guestPhone: "+1987654321",
      checkInDate: ci,
      checkOutDate: co,
      rooms: [
        { roomId: roomA, guestCount: 2 },
        { roomId: roomB, guestCount: 1 },
      ],
    });

    expect(result.referenceCodes.length).toBe(2);
    expect(result.bookingGroupId).toBeTruthy();

    // The group lookup returns both rooms for either reference code.
    const group = await t.query(api.reservations.getReservationGroup, {
      referenceCode: result.referenceCode,
    });
    expect(group.length).toBe(2);
    const groupIds = new Set(group.map((r: any) => r.bookingGroupId));
    expect(groupIds.size).toBe(1);
    expect(group.every((r: any) => r.totalPrice === 80 * 3)).toBe(true);
  });

  it("rejects a group that selects the same room twice", async () => {
    const t = convexTest(schema, modules);
    const { roomId } = await seedRoomAndAdmin(t);
    await expect(
      t.mutation(api.reservations.createGroup, {
        guestFullName: "Dup Guest",
        guestEmail: "dup@example.com",
        guestPhone: "+1234567890",
        checkInDate: futureDate(1),
        checkOutDate: futureDate(3),
        rooms: [
          { roomId, guestCount: 1 },
          { roomId, guestCount: 1 },
        ],
      }),
    ).rejects.toThrow("Duplicate room in selection");
  });
});


// ─── Property 13: Bounded conflict scan stays correct past the read cap ──────
// Even with many historical reservations on a room, a new overlapping booking
// is still detected (the scan window is bounded but always covers any stay
// that could overlap).

describe("Property 13: Conflict detection survives a large history", () => {
  it("detects an overlap against the most recent reservation among many", async () => {
    const t = convexTest(schema, modules);
    const { roomId } = await seedRoomAndAdmin(t);

    // Create a long run of back-to-back, non-overlapping 1-night stays.
    const N = 120;
    for (let i = 0; i < N; i++) {
      await t.mutation(api.reservations.create, {
        roomId,
        guestFullName: `Guest ${i}`,
        guestEmail: `g${i}@example.com`,
        guestPhone: "+1234567890",
        guestCount: 1,
        checkInDate: futureDate(i),
        checkOutDate: futureDate(i + 1),
      });
    }

    // Attempt to overlap the very last (most recent date) stay — must be rejected.
    await expect(
      t.mutation(api.reservations.create, {
        roomId,
        guestFullName: "Overlap Guest",
        guestEmail: "overlap@example.com",
        guestPhone: "+1234567890",
        guestCount: 1,
        checkInDate: futureDate(N - 1),
        checkOutDate: futureDate(N),
      }),
    ).rejects.toThrow("Room is not available for those dates");
  });
});


// ─── Max-stay guard ──────────────────────────────────────────────────────────

describe("Max-stay validation", () => {
  it("rejects stays longer than the configured maximum", async () => {
    const t = convexTest(schema, modules);
    const { roomId } = await seedRoomAndAdmin(t);
    await expect(
      t.mutation(api.reservations.create, {
        roomId,
        guestFullName: "Long Stay",
        guestEmail: "long@example.com",
        guestPhone: "+1234567890",
        guestCount: 1,
        checkInDate: futureDate(0),
        checkOutDate: futureDate(400), // 400 nights > 365
      }),
    ).rejects.toThrow();
  });
});


// ─── Property 14: Admin walk-in group atomicity & status assignment ─────────

describe("Property 14: Walk-in group mutation", () => {
  it("commits all rooms with shared bookingGroupId and assigns checkedIn for today", async () => {
    const t = convexTest(schema, modules);
    const { roomId, sessionToken } = await seedRoomAndAdmin(t);
    const { roomId: roomB } = await t.run(async (ctx: any) => {
      const id = await ctx.db.insert("rooms", {
        nameKa: "B", nameEn: "B",
        descriptionKa: "d", descriptionEn: "d",
        pricePerNight: 50, capacity: 3, amenities: [],
        imageUrl: "https://example.com/b.jpg",
        createdAt: Date.now(), updatedAt: Date.now(),
      });
      return { roomId: id };
    });

    // Today → tomorrow (UTC midnight)
    const today = new Date();
    const ci = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    const co = ci + MS_PER_DAY;

    const result = await t.mutation(api.reservations.createWalkInGroup, {
      sessionToken,
      guestFullName: "Walk-In Guest",
      guestPhone: "+1234567890",
      checkInDate: ci,
      checkOutDate: co,
      rooms: [
        { roomId, guestCount: 2 },
        { roomId: roomB, guestCount: 1, totalPrice: 75 },
      ],
    });

    expect(result.referenceCodes.length).toBe(2);

    const all = await t.run(async (ctx: any) =>
      ctx.db.query("reservations").collect(),
    );
    expect(all.length).toBe(2);
    // All status = checkedIn (check-in is today)
    expect(all.every((r: any) => r.status === "checkedIn")).toBe(true);
    // Same bookingGroupId
    const groups = new Set(all.map((r: any) => r.bookingGroupId));
    expect(groups.size).toBe(1);
    // Price override applied for room B
    const overridden = all.find((r: any) => r.roomId === roomB);
    expect(overridden!.totalPrice).toBe(75);
  });

  it("assigns 'confirmed' status when check-in is in the future", async () => {
    const t = convexTest(schema, modules);
    const { roomId, sessionToken } = await seedRoomAndAdmin(t);
    const ci = futureDate(7);
    const co = futureDate(10);

    await t.mutation(api.reservations.createWalkInGroup, {
      sessionToken,
      guestFullName: "Future Guest",
      checkInDate: ci,
      checkOutDate: co,
      rooms: [{ roomId, guestCount: 1 }],
    });

    const all = await t.run(async (ctx: any) =>
      ctx.db.query("reservations").collect(),
    );
    expect(all[0].status).toBe("confirmed");
    expect(all[0].checkedInAt).toBeUndefined();
  });

  it("rejects when any room conflicts and writes nothing", async () => {
    const t = convexTest(schema, modules);
    const { roomId, sessionToken } = await seedRoomAndAdmin(t);
    const { roomId: roomB } = await t.run(async (ctx: any) => {
      const id = await ctx.db.insert("rooms", {
        nameKa: "B", nameEn: "B",
        descriptionKa: "d", descriptionEn: "d",
        pricePerNight: 50, capacity: 3, amenities: [],
        imageUrl: "https://example.com/b.jpg",
        createdAt: Date.now(), updatedAt: Date.now(),
      });
      return { roomId: id };
    });

    const ci = futureDate(5);
    const co = futureDate(7);

    // Pre-book roomB so the group must fail.
    await t.mutation(api.reservations.create, {
      roomId: roomB,
      guestFullName: "Existing",
      guestEmail: "x@y.com",
      guestPhone: "+1234567890",
      guestCount: 1,
      checkInDate: ci,
      checkOutDate: co,
    });

    const before = await t.run(async (ctx: any) =>
      ctx.db.query("reservations").collect(),
    );

    await expect(
      t.mutation(api.reservations.createWalkInGroup, {
        sessionToken,
        guestFullName: "New",
        checkInDate: ci,
        checkOutDate: co,
        rooms: [
          { roomId, guestCount: 1 },
          { roomId: roomB, guestCount: 1 },
        ],
      }),
    ).rejects.toThrow();

    const after = await t.run(async (ctx: any) =>
      ctx.db.query("reservations").collect(),
    );
    expect(after.length).toBe(before.length);
  });

  it("requires a valid admin session", async () => {
    const t = convexTest(schema, modules);
    const { roomId } = await seedRoomAndAdmin(t);
    await expect(
      t.mutation(api.reservations.createWalkInGroup, {
        sessionToken: "bogus",
        guestFullName: "X",
        checkInDate: futureDate(1),
        checkOutDate: futureDate(2),
        rooms: [{ roomId, guestCount: 1 }],
      }),
    ).rejects.toThrow("Unauthorized");
  });
});
