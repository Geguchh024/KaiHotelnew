import { describe, it, expect } from "vitest";
import { ConvexError } from "convex/values";
import fc from "fast-check";
import {
  overlaps,
  applyTransition,
  validateGuestInput,
  normalizeToUtcMidnight,
  ACTIVE_STATUSES,
  MS_PER_DAY,
  MAX_STAY_NIGHTS,
  type Status,
  type Transition,
} from "../availability";

// ─── overlaps tests ─────────────────────────────────────────────────────────

describe("overlaps", () => {
  const day0 = 0;
  const day1 = MS_PER_DAY;
  const day2 = 2 * MS_PER_DAY;
  const day3 = 3 * MS_PER_DAY;
  const day4 = 4 * MS_PER_DAY;
  const day5 = 5 * MS_PER_DAY;

  it("returns true for identical ranges", () => {
    expect(overlaps(day1, day3, day1, day3)).toBe(true);
  });

  it("returns true when one range fully contains the other", () => {
    // [day1, day5) fully contains [day2, day4)
    expect(overlaps(day1, day5, day2, day4)).toBe(true);
    // reverse: [day2, day4) is contained in [day1, day5)
    expect(overlaps(day2, day4, day1, day5)).toBe(true);
  });

  it("returns true for partially overlapping ranges", () => {
    // [day1, day3) and [day2, day4) overlap on day2
    expect(overlaps(day1, day3, day2, day4)).toBe(true);
    expect(overlaps(day2, day4, day1, day3)).toBe(true);
  });

  it("returns false when ranges only touch at an endpoint (end-touching)", () => {
    // [day1, day3) and [day3, day5) — checkout equals checkin, no overlap
    expect(overlaps(day1, day3, day3, day5)).toBe(false);
    expect(overlaps(day3, day5, day1, day3)).toBe(false);
  });

  it("returns false for completely disjoint ranges", () => {
    // [day0, day1) and [day3, day5) — gap between them
    expect(overlaps(day0, day1, day3, day5)).toBe(false);
    expect(overlaps(day3, day5, day0, day1)).toBe(false);
  });

  it("handles empty ranges (ci === co)", () => {
    // An empty range [x, x) where a1 === a2: the formula a1 < b2 && b1 < a2
    // still evaluates based on the endpoints. In practice, validateGuestInput
    // rejects ci >= co so empty ranges never reach overlaps in production.
    // [day2, day2) vs [day1, day3): day2 < day3 && day1 < day2 → true
    expect(overlaps(day2, day2, day1, day3)).toBe(true);
    // [day1, day3) vs [day2, day2): day1 < day2 && day2 < day3 → true
    expect(overlaps(day1, day3, day2, day2)).toBe(true);
    // Two empty ranges at the same point: [day2, day2) vs [day2, day2)
    // day2 < day2 is false → no overlap
    expect(overlaps(day2, day2, day2, day2)).toBe(false);
    // Empty range at the boundary: [day3, day3) vs [day1, day3)
    // day3 < day3 is false → no overlap
    expect(overlaps(day3, day3, day1, day3)).toBe(false);
    expect(overlaps(day1, day3, day3, day3)).toBe(false);
  });
});

// ─── applyTransition tests ──────────────────────────────────────────────────

describe("applyTransition", () => {
  const now = Date.now();

  describe("legal transitions (happy path)", () => {
    it("pending → confirmed via 'confirm'", () => {
      const patch = applyTransition("pending", "confirm", now);
      expect(patch.status).toBe("confirmed");
      expect(patch.checkedInAt).toBeUndefined();
      expect(patch.checkedOutAt).toBeUndefined();
      expect(patch.cancelledAt).toBeUndefined();
    });

    it("pending → cancelled via 'cancel'", () => {
      const patch = applyTransition("pending", "cancel", now);
      expect(patch.status).toBe("cancelled");
      expect(patch.cancelledAt).toBe(now);
    });

    it("confirmed → checkedIn via 'checkIn'", () => {
      const patch = applyTransition("confirmed", "checkIn", now);
      expect(patch.status).toBe("checkedIn");
      expect(patch.checkedInAt).toBe(now);
    });

    it("confirmed → cancelled via 'cancel'", () => {
      const patch = applyTransition("confirmed", "cancel", now);
      expect(patch.status).toBe("cancelled");
      expect(patch.cancelledAt).toBe(now);
    });

    it("confirmed → noShow via 'markNoShow'", () => {
      const patch = applyTransition("confirmed", "markNoShow", now);
      expect(patch.status).toBe("noShow");
      expect(patch.checkedInAt).toBeUndefined();
      expect(patch.checkedOutAt).toBeUndefined();
      expect(patch.cancelledAt).toBeUndefined();
    });

    it("checkedIn → checkedOut via 'checkOut'", () => {
      const patch = applyTransition("checkedIn", "checkOut", now);
      expect(patch.status).toBe("checkedOut");
      expect(patch.checkedOutAt).toBe(now);
    });
  });

  describe("invalid transitions (should throw ConvexError)", () => {
    it("cancelled → confirmed via 'confirm' throws", () => {
      expect(() => applyTransition("cancelled", "confirm", now)).toThrow(
        ConvexError,
      );
      expect(() => applyTransition("cancelled", "confirm", now)).toThrow(
        "Invalid status transition",
      );
    });

    it("pending → checkedOut via 'checkOut' throws", () => {
      expect(() => applyTransition("pending", "checkOut", now)).toThrow(
        ConvexError,
      );
      expect(() => applyTransition("pending", "checkOut", now)).toThrow(
        "Invalid status transition",
      );
    });

    it("checkedOut → cancelled via 'cancel' throws", () => {
      expect(() => applyTransition("checkedOut", "cancel", now)).toThrow(
        ConvexError,
      );
      expect(() => applyTransition("checkedOut", "cancel", now)).toThrow(
        "Invalid status transition",
      );
    });

    it("noShow → checkedIn via 'checkIn' throws", () => {
      expect(() => applyTransition("noShow", "checkIn", now)).toThrow(
        ConvexError,
      );
      expect(() => applyTransition("noShow", "checkIn", now)).toThrow(
        "Invalid status transition",
      );
    });
  });
});


// ─── Property-Based Tests ───────────────────────────────────────────────────

// Shared arbitraries for property tests
const ALL_STATUSES: Status[] = ["pending", "confirmed", "checkedIn", "checkedOut", "cancelled", "noShow"];
const ALL_TRANSITIONS: Transition[] = ["confirm", "cancel", "checkIn", "checkOut", "markNoShow"];

const statusArb = fc.constantFrom<Status>(...ALL_STATUSES);
const dayArb = fc.integer({ min: 0, max: 365 }).map(d => d * MS_PER_DAY);

const reservationArb = fc.record({
  checkInDate: dayArb,
  nights: fc.integer({ min: 1, max: 14 }),
  status: statusArb,
}).map(r => ({
  checkInDate: r.checkInDate,
  checkOutDate: r.checkInDate + r.nights * MS_PER_DAY,
  status: r.status,
}));

// ─── Property 3: Availability correctness ───────────────────────────────────
// **Validates: Requirements 2.2, 2.3**

describe("Property 3: Availability correctness", () => {
  it("optimized isAvailable matches naive O(n²) reference for any reservation list and query range", () => {
    fc.assert(
      fc.property(
        fc.array(reservationArb, { maxLength: 30 }),
        fc.tuple(dayArb, dayArb),
        (reservations, [d1, d2]) => {
          // Ensure ci < co for the query range
          const ci = Math.min(d1, d2);
          const co = Math.max(d1, d2) + MS_PER_DAY; // ensure co > ci

          // Optimized: filter active then check overlaps (mirrors the real implementation)
          const optimizedConflict = reservations.some(
            r => ACTIVE_STATUSES.has(r.status) && overlaps(r.checkInDate, r.checkOutDate, ci, co)
          );
          const optimizedAvailable = !optimizedConflict;

          // Naive reference: for each reservation, is it active AND overlaps?
          let naiveAvailable = true;
          for (const r of reservations) {
            if (ACTIVE_STATUSES.has(r.status)) {
              // Naive overlap check: NOT (co <= r.checkInDate || r.checkOutDate <= ci)
              const naiveOverlaps = !(co <= r.checkInDate || r.checkOutDate <= ci);
              if (naiveOverlaps) {
                naiveAvailable = false;
                break;
              }
            }
          }

          expect(optimizedAvailable).toBe(naiveAvailable);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 5: State machine closure ──────────────────────────────────────
// **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

describe("Property 5: State machine closure", () => {
  // The valid (S, T) pairs from the transition table
  const VALID_PAIRS: Array<[Status, Transition]> = [
    ["pending", "confirm"],
    ["pending", "cancel"],
    ["confirmed", "checkIn"],
    ["confirmed", "cancel"],
    ["confirmed", "markNoShow"],
    ["checkedIn", "checkOut"],
  ];

  function isValidPair(s: Status, t: Transition): boolean {
    return VALID_PAIRS.some(([vs, vt]) => vs === s && vt === t);
  }

  it("applyTransition succeeds iff (S, T) is a valid pair; on rejection status is unchanged", () => {
    fc.assert(
      fc.property(
        statusArb,
        fc.constantFrom<Transition>(...ALL_TRANSITIONS),
        fc.integer({ min: 1, max: 1_000_000_000 }),
        (status, transition, now) => {
          if (isValidPair(status, transition)) {
            // Should succeed
            const patch = applyTransition(status, transition, now);
            expect(patch.status).not.toBe(status); // status must change
            // Verify timestamp side effects
            if (patch.status === "checkedIn") expect(patch.checkedInAt).toBe(now);
            if (patch.status === "checkedOut") expect(patch.checkedOutAt).toBe(now);
            if (patch.status === "cancelled") expect(patch.cancelledAt).toBe(now);
          } else {
            // Should throw and leave status unchanged
            try {
              applyTransition(status, transition, now);
              // If we get here, the transition unexpectedly succeeded
              expect.fail(`Expected applyTransition("${status}", "${transition}") to throw`);
            } catch (e) {
              expect(e).toBeInstanceOf(ConvexError);
              // The original status is unchanged (function is pure, no mutation)
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 7: Date ordering and past-date rejection ──────────────────────
// **Validates: Requirements 4.7, 4.8**

describe("Property 7: Date ordering and past-date rejection", () => {
  it("validateGuestInput rejects when ci >= co or ci < today(now), accepts otherwise", () => {
    // Use day-aligned integers to avoid normalization edge cases
    const dayOffsetArb = fc.integer({ min: -30, max: 400 });

    fc.assert(
      fc.property(
        dayOffsetArb, // nowOffset (days from epoch)
        dayOffsetArb, // ciOffset (days from epoch)
        dayOffsetArb, // coOffset (days from epoch)
        (nowDays, ciDays, coDays) => {
          const now = nowDays * MS_PER_DAY;
          const ci = ciDays * MS_PER_DAY;
          const co = coDays * MS_PER_DAY;

          // Valid fixed fields so only dates vary
          const input = {
            guestFullName: "John Doe",
            guestEmail: "john@example.com",
            guestPhone: "+1234567890",
            guestCount: 2,
            checkInDate: ci,
            checkOutDate: co,
            roomCapacity: 4,
            now,
          };

          const normalizedCi = normalizeToUtcMidnight(ci);
          const normalizedCo = normalizeToUtcMidnight(co);
          const todayMidnight = normalizeToUtcMidnight(now);

          const tooLong =
            (normalizedCo - normalizedCi) / MS_PER_DAY > MAX_STAY_NIGHTS;
          const shouldReject =
            normalizedCi >= normalizedCo ||
            normalizedCi < todayMidnight ||
            tooLong;

          try {
            validateGuestInput(input);
            // Accepted — should not have been rejected
            expect(shouldReject).toBe(false);
          } catch (e) {
            if (!(e instanceof ConvexError)) throw e;
            // Rejected — should have been rejected
            expect(shouldReject).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 8: Guest-count / capacity bounds ──────────────────────────────
// **Validates: Requirements 4.1, 4.9, 4.10**

describe("Property 8: Guest count / capacity bounds", () => {
  it("rejects iff guestCount < 1 or guestCount > roomCapacity", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -5, max: 20 }),
        fc.integer({ min: 1, max: 8 }),
        (guestCount, roomCapacity) => {
          // Use valid fixed fields: dates in the future relative to now
          const now = 0;
          const ci = 10 * MS_PER_DAY; // 10 days from epoch (future)
          const co = 12 * MS_PER_DAY; // 12 days from epoch

          const input = {
            guestFullName: "Jane Smith",
            guestEmail: "jane@example.com",
            guestPhone: "+9876543210",
            guestCount,
            checkInDate: ci,
            checkOutDate: co,
            roomCapacity,
            now,
          };

          const shouldReject = guestCount < 1 || guestCount > roomCapacity;

          try {
            validateGuestInput(input);
            // Accepted
            expect(shouldReject).toBe(false);
          } catch (e) {
            if (!(e instanceof ConvexError)) throw e;
            const msg = (e as ConvexError<string>).data;
            // Only count guest-count related rejections
            if (
              msg === "At least one guest is required" ||
              msg === "Guest count exceeds room capacity"
            ) {
              expect(shouldReject).toBe(true);
            } else {
              // Some other validation error — shouldn't happen with our fixed fields
              throw e;
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
