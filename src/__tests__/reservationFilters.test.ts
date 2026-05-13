import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  filterReservations,
  type FilterableReservation,
  type ReservationFilterCriteria,
} from "../utils/filterReservations";
import type { Status } from "../../convex/availability";

// ─── Property 10: Filter subset refinement ──────────────────────────────────
// **Validates: Requirements 8.5**

const ALL_STATUSES: Status[] = ["pending", "confirmed", "checkedIn", "checkedOut", "cancelled", "noShow"];
const ROOM_IDS = ["room_a", "room_b", "room_c"];

const MS_PER_DAY = 86_400_000;

const reservationArb: fc.Arbitrary<FilterableReservation> = fc.record({
  _id: fc.uuid(),
  roomId: fc.constantFrom(...ROOM_IDS),
  referenceCode: fc.stringMatching(/^[A-Z0-9]{8}$/),
  guestFullName: fc.string({ minLength: 1, maxLength: 30 }),
  guestEmail: fc.emailAddress(),
  checkInDate: fc.integer({ min: 0, max: 365 }).map(d => d * MS_PER_DAY),
  status: fc.constantFrom<Status>(...ALL_STATUSES),
});

describe("Property 10: Filter subset refinement", () => {
  it("filterReservations(list, F1) ⊆ filterReservations(list, F2) when F1 is a strict refinement of F2", () => {
    // Generate a broad filter F2 and then refine it to F1
    const broadFilterArb: fc.Arbitrary<ReservationFilterCriteria> = fc.record({
      status: fc.constantFrom<"all" | Status>("all"),
      roomId: fc.constant(null),
      checkInFrom: fc.constant(null),
      checkInTo: fc.constant(null),
      search: fc.constant(""),
    });

    // A refinement adds one or more constraints on top of the broad filter
    const refinedFilterArb: fc.Arbitrary<ReservationFilterCriteria> = fc.record({
      status: fc.constantFrom<"all" | Status>(...ALL_STATUSES, "all"),
      roomId: fc.constantFrom<string | null>(...ROOM_IDS, null),
      checkInFrom: fc.oneof(
        fc.constant(null),
        fc.integer({ min: 0, max: 180 }).map(d => d * MS_PER_DAY),
      ),
      checkInTo: fc.oneof(
        fc.constant(null),
        fc.integer({ min: 180, max: 365 }).map(d => d * MS_PER_DAY),
      ),
      search: fc.oneof(fc.constant(""), fc.string({ minLength: 1, maxLength: 5 })),
    });

    fc.assert(
      fc.property(
        fc.array(reservationArb, { maxLength: 30 }),
        broadFilterArb,
        refinedFilterArb,
        (list, broadFilter, refinedFilter) => {
          // F2 is the broad filter (less restrictive)
          // F1 is the refined filter (more restrictive)
          // We need to ensure F1 is actually a refinement of F2.
          // Since broadFilter has status="all", roomId=null, checkInFrom=null, checkInTo=null, search="",
          // any refinedFilter is by definition a refinement (equal or stricter on every field).

          const resultBroad = filterReservations(list, broadFilter);
          const resultRefined = filterReservations(list, refinedFilter);

          // Assert F1 result ⊆ F2 result (by _id)
          const broadIds = new Set(resultBroad.map(r => r._id));
          for (const r of resultRefined) {
            expect(broadIds.has(r._id)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("refining a non-trivial filter still produces a subset", () => {
    // Generate two filters where F1 is strictly narrower than F2
    fc.assert(
      fc.property(
        fc.array(reservationArb, { maxLength: 20 }),
        fc.constantFrom<Status>(...ALL_STATUSES),
        fc.constantFrom(...ROOM_IDS),
        (list, status, roomId) => {
          // F2: filter by status only
          const f2: ReservationFilterCriteria = {
            status,
            roomId: null,
            checkInFrom: null,
            checkInTo: null,
            search: "",
          };

          // F1: filter by status AND roomId (strictly narrower)
          const f1: ReservationFilterCriteria = {
            status,
            roomId,
            checkInFrom: null,
            checkInTo: null,
            search: "",
          };

          const resultF2 = filterReservations(list, f2);
          const resultF1 = filterReservations(list, f1);

          // F1 ⊆ F2
          const f2Ids = new Set(resultF2.map(r => r._id));
          for (const r of resultF1) {
            expect(f2Ids.has(r._id)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
