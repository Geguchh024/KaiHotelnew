// convex/availability.ts
import { v, ConvexError } from "convex/values";

export type Status = "pending" | "confirmed" | "checkedIn" | "checkedOut" | "cancelled" | "noShow";
export type Transition = "confirm" | "cancel" | "checkIn" | "checkOut" | "markNoShow";

export const STATUS_VALIDATOR = v.union(
  v.literal("pending"), v.literal("confirmed"), v.literal("checkedIn"),
  v.literal("checkedOut"), v.literal("cancelled"), v.literal("noShow"),
);
export const TRANSITION_VALIDATOR = v.union(
  v.literal("confirm"), v.literal("cancel"), v.literal("checkIn"),
  v.literal("checkOut"), v.literal("markNoShow"),
);

export const ACTIVE_STATUSES: ReadonlySet<Status> = new Set(["pending", "confirmed", "checkedIn"]);
export const TERMINAL_STATUSES: ReadonlySet<Status> = new Set(["checkedOut", "cancelled", "noShow"]);

/** Half-open overlap: [a1, a2) overlaps [b1, b2)  iff  a1 < b2 && b1 < a2. */
export function overlaps(a1: number, a2: number, b1: number, b2: number): boolean {
  return a1 < b2 && b1 < a2;
}

/** One day = 86_400_000 ms. */
export const MS_PER_DAY = 86_400_000;

/** Normalize an epoch-ms timestamp to UTC midnight of that calendar date. */
export function normalizeToUtcMidnight(ts: number): number {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Integer whole days between two UTC-midnight timestamps. */
export function nightCount(ci: number, co: number): number {
  return Math.round((co - ci) / MS_PER_DAY);
}

/** Transition table, single source of truth for both server and UI. */
const TRANSITIONS: Record<Status, Partial<Record<Transition, Status>>> = {
  pending:    { confirm: "confirmed", cancel: "cancelled" },
  confirmed:  { checkIn: "checkedIn", cancel: "cancelled", markNoShow: "noShow" },
  checkedIn:  { checkOut: "checkedOut" },
  checkedOut: {},
  cancelled:  {},
  noShow:     {},
};

export function nextStatus(current: Status, t: Transition): Status | null {
  return TRANSITIONS[current][t] ?? null;
}

export function allowedTransitions(current: Status): Transition[] {
  return Object.keys(TRANSITIONS[current]) as Transition[];
}

/** Returns the Convex patch for a transition, or throws ConvexError on invalid. */
export function applyTransition(
  current: Status,
  t: Transition,
  now: number,
): { status: Status; checkedInAt?: number; checkedOutAt?: number; cancelledAt?: number } {
  const next = nextStatus(current, t);
  if (!next) throw new ConvexError("Invalid status transition");
  const patch: { status: Status; checkedInAt?: number; checkedOutAt?: number; cancelledAt?: number } = { status: next };
  if (next === "checkedIn") patch.checkedInAt = now;
  else if (next === "checkedOut") patch.checkedOutAt = now;
  else if (next === "cancelled") patch.cancelledAt = now;
  return patch;
}

// ─── Validation ─────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[0-9+\-\s()]+$/;

export type GuestInput = {
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  guestCount: number;
  checkInDate: number;
  checkOutDate: number;
  specialRequests?: string;
  roomCapacity: number;
  now: number;
};

export function validateGuestInput(input: GuestInput) {
  const name = input.guestFullName.trim();
  const email = input.guestEmail.trim();
  const phone = input.guestPhone.trim();
  if (!name) throw new ConvexError("Full name is required");
  if (!email) throw new ConvexError("Email is required");
  if (!phone) throw new ConvexError("Phone is required");
  if (!EMAIL_RE.test(email)) throw new ConvexError("Invalid email address");
  const digitCount = (phone.match(/\d/g) ?? []).length;
  if (!PHONE_RE.test(phone) || digitCount < 7) throw new ConvexError("Invalid phone number");
  if (input.guestCount < 1) throw new ConvexError("At least one guest is required");
  if (input.guestCount > input.roomCapacity) throw new ConvexError("Guest count exceeds room capacity");
  const ci = normalizeToUtcMidnight(input.checkInDate);
  const co = normalizeToUtcMidnight(input.checkOutDate);
  if (ci >= co) throw new ConvexError("Check-out must be after check-in");
  if (ci < normalizeToUtcMidnight(input.now)) throw new ConvexError("Check-in cannot be in the past");
  return {
    guestFullName: name,
    guestEmail: email,
    guestPhone: phone,
    guestCount: input.guestCount,
    checkInDate: ci,
    checkOutDate: co,
    specialRequests: input.specialRequests?.trim() || undefined,
  };
}

// ─── Reference code generation ──────────────────────────────────────────────
// Unambiguous alphabet: no 0/O, no 1/I/L.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LEN = 8;

export function generateReferenceCode(rand: () => number = Math.random): string {
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) {
    out += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  }
  return out;
}
