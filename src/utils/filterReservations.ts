import type { Status } from "../../convex/availability";

export interface FilterableReservation {
  _id: string;
  roomId: string;
  referenceCode: string;
  guestFullName: string;
  guestEmail: string;
  checkInDate: number;
  status: Status;
}

export interface ReservationFilterCriteria {
  status: "all" | Status;
  roomId: string | null;
  checkInFrom: number | null; // UTC midnight ms
  checkInTo: number | null; // UTC midnight ms
  search: string;
}

export function filterReservations<T extends FilterableReservation>(
  list: T[],
  criteria: ReservationFilterCriteria,
): T[] {
  return list.filter((r) => {
    if (criteria.status !== "all" && r.status !== criteria.status) return false;
    if (criteria.roomId && r.roomId !== criteria.roomId) return false;
    if (criteria.checkInFrom != null && r.checkInDate < criteria.checkInFrom)
      return false;
    if (criteria.checkInTo != null && r.checkInDate > criteria.checkInTo)
      return false;
    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      const matches =
        r.guestFullName.toLowerCase().includes(q) ||
        r.guestEmail.toLowerCase().includes(q) ||
        r.referenceCode.toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });
}
