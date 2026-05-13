# Implementation Plan: Reservation System

## Overview

Convert the reservation-system design into incremental coding tasks, grouped so each group ends in a verifiable state. Implementation order follows the design's files-to-add / files-to-modify list:

1. Foundations — schema additions and pure helpers in `convex/availability.ts` (plus a pure filter helper).
2. Pure property tests — lock contracts of the pure helpers before wiring Convex.
3. Convex functions — queries and mutations in `convex/reservations.ts`, each as its own sub-task.
4. Convex-level property + integration tests via `convex-test`.
5. Public frontend flow — rewrite `/reservations` and add the confirmation route.
6. Admin panel integration — new Reservations tab, components, sidebar + layout wiring.
7. Booking.com removal + i18n cleanup.
8. Smoke tests and final verification.

All code references are tagged with `(Requirements: X.Y; Property: N)` for traceability. Sub-tasks marked with `*` are optional per the workflow's test-task convention; they are strongly recommended because the design includes a full Correctness Properties section.

## Tasks

- [ ] 1. Foundations — schema and pure helpers
  - [x] 1.1 Add the `reservations` table to `convex/schema.ts`
    - Define fields per the design's schema block (`roomId`, `referenceCode`, `guestFullName`, `guestEmail`, `guestPhone`, `guestCount`, `checkInDate`, `checkOutDate`, `status` union of six literals, `totalPrice`, `createdAt`, optional `checkedInAt` / `checkedOutAt` / `cancelledAt`, optional `specialRequests`).
    - Add the four indexes: `by_reference_code`, `by_room_and_checkInDate`, `by_status`, `by_created_at`.
    - _(Requirements: 9.1, 9.2, 9.3, 9.4, 9.5)_
  - [x] 1.2 Create `convex/availability.ts` with overlap math and date helpers
    - Export `Status` / `Transition` TS types, `STATUS_VALIDATOR`, `TRANSITION_VALIDATOR`, `ACTIVE_STATUSES`, `TERMINAL_STATUSES`, `MS_PER_DAY`.
    - Implement pure `overlaps(a1, a2, b1, b2)` using the half-open rule `a1 < b2 && b1 < a2`.
    - Implement `normalizeToUtcMidnight(ts)` and `nightCount(ci, co)`.
    - _(Requirements: 3.1, 3.4, 9.5; Properties: 3, 9)_
  - [x] 1.3 Add the transition table and `applyTransition` to `convex/availability.ts`
    - Implement the `TRANSITIONS` record matching the design's allowed-transition table exactly.
    - Export `nextStatus(current, t)`, `allowedTransitions(current)`, and `applyTransition(current, t, now)` which returns `{ status, checkedInAt?, checkedOutAt?, cancelledAt? }` and throws `ConvexError("Invalid status transition")` on an illegal `(S, T)` pair.
    - _(Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6; Property: 5)_
  - [x] 1.4 Add `validateGuestInput` and `generateReferenceCode` to `convex/availability.ts`
    - `validateGuestInput` enforces: non-empty trimmed name/email/phone, `EMAIL_RE`, `PHONE_RE` plus ≥7 digits, `guestCount >= 1` and `<= roomCapacity`, check-in < check-out, check-in not before today (all via `ConvexError`).
    - `generateReferenceCode(rand = Math.random)` returns an 8-char code from the 30-char unambiguous alphabet; accepts an injected RNG for deterministic testing.
    - _(Requirements: 4.1, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 4.10, 5.2; Properties: 6, 7, 8)_
  - [x] 1.5 Create pure `filterReservations` helper at `src/utils/filterReservations.ts`
    - Export `ReservationFilterCriteria` type covering status (`"all"` | one of six), `roomId` (id or null), `checkInFrom` / `checkInTo` (ms or null), `search` (string).
    - Export `filterReservations(list, criteria)` that returns only records matching every active criterion; `search` matches case-insensitively against `guestFullName`, `guestEmail`, and `referenceCode`.
    - Keep the function pure (no React, no Convex) so it can be unit-tested and imported by both the admin UI and the property test.
    - _(Requirements: 8.4, 8.5; Property: 10)_
  - [x] 1.6 Confirm `vitest.config.ts` has an `edge-runtime` project for Convex tests
    - The file already defines a `convex` project with `environment: "edge-runtime"` and `server.deps.inline: ["convex-test"]`; verify it matches the design's testing guidelines and leave unchanged if correct, otherwise update.
    - _(Requirements: none; supports Properties 1–11)_
  - [x] 1.7 Checkpoint — Ensure the schema compiles and helpers typecheck
    - Ensure all tests pass, ask the user if questions arise.

- [ ] 2. Pure property tests — lock helper contracts before Convex wiring
  - [x]* 2.1 Example unit tests for `overlaps` and `applyTransition` in `convex/__tests__/availability.test.ts`
    - Cover `overlaps` edge cases: identical ranges, fully-contained ranges, end-touching ranges, empty ranges (`ci === co`).
    - Cover every legal transition from the table (6 happy-path cases) and a handful of invalid transitions (confirm a cancelled, checkOut a pending, etc.).
    - _(Requirements: 3.4, 6.2, 6.3; Properties: 3, 5)_
  - [x]* 2.2 Property test for availability correctness (Property 3)
    - **Property 3: Availability correctness (pure)**
    - Compare `isAvailable`-style check built on `overlaps` + `ACTIVE_STATUSES` against a naive O(n²) reference, using `fc.array(reservationArb)` + `fc.tuple(dayArb, dayArb)`.
    - `fc.assert(prop, { numRuns: 100 })`.
    - **Validates: Requirements 2.2, 2.3**
  - [x]* 2.3 Property test for state machine closure (Property 5)
    - **Property 5: State machine closure (pure)**
    - `fc.constantFrom(...STATUSES) × fc.constantFrom(...TRANSITIONS)`: assert `applyTransition` succeeds iff `(S, T)` is in the literal `TRANSITIONS` map, and on rejection neither status nor timestamp fields change.
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
  - [x]* 2.4 Property test for date ordering and past-date rejection (Property 7)
    - **Property 7: Date ordering and past rejection (pure)**
    - `fc.tuple(fc.integer(), fc.integer(), fc.integer())` as `(now, ci, co)`; assert `validateGuestInput` rejects when `ci >= co` or `ci < today(now)`, accepts otherwise (when all other fields are valid).
    - **Validates: Requirements 4.7, 4.8**
  - [x]* 2.5 Property test for guest-count / capacity bounds (Property 8)
    - **Property 8: Guest count bounds (pure)**
    - `fc.integer({ min: -5, max: 20 }) × fc.integer({ min: 1, max: 8 })` for `(guestCount, roomCapacity)`; assert rejection iff `guestCount < 1` or `guestCount > roomCapacity`.
    - **Validates: Requirements 4.1, 4.9, 4.10**
  - [x]* 2.6 Property test for filter subset refinement (Property 10)
    - **Property 10: Filter subset (pure)**
    - New file `src/__tests__/reservationFilters.test.ts`. Use `fc.array(reservationArb)` and two filter arbitraries where `F1` is a strict refinement of `F2`; assert `filterReservations(list, F1)` ⊆ `filterReservations(list, F2)` as a set by `_id`.
    - **Validates: Requirements 8.5**
  - [x] 2.7 Checkpoint — Ensure all pure tests pass
    - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Convex functions — `convex/reservations.ts`
  - [x] 3.1 Scaffold `convex/reservations.ts`
    - Add imports (`v`, `ConvexError`, `paginationOptsValidator`, `query`, `mutation`, `Doc`, `Id`, helpers from `./availability`, `validateSession` from `./utils`).
    - Export an empty set of function references so later sub-tasks can fill them in without touching imports.
    - _(Requirements: 9.1)_
  - [x] 3.2 Implement `getAvailabilityForRoom` public query
    - Normalize the incoming `checkInDate` / `checkOutDate` to UTC midnight; return `{ available: false }` when `ci >= co`.
    - Use `withIndex("by_room_and_checkInDate", q => q.eq("roomId", roomId).lt("checkInDate", co)).take(500)`; return `{ available }` based on `ACTIVE_STATUSES.has(r.status) && overlaps(...)`.
    - _(Requirements: 2.2, 2.3, 2.6, 7.5; Property: 3)_
  - [x] 3.3 Implement `getBlockedDatesForRoom` public query
    - Input `(roomId, fromDate, throughDate)` all as UTC-midnight ms.
    - Iterate active reservations for the room whose `checkInDate < throughDate`, expand each into day-granular UTC-midnight timestamps clamped to `[fromDate, throughDate)`, return a sorted deduplicated array of numbers.
    - _(Requirements: 2.3, 2.6, 7.5)_
  - [x] 3.4 Implement `getByReferenceCode` public query
    - Look up via `by_reference_code` index; return the full reservation record or `null`.
    - Use the explicit object returns validator from the design so other reservations never leak through.
    - _(Requirements: 5.6, 7.6; Property: 6)_
  - [x] 3.5 Implement `create` public mutation
    - Fetch the room document, call `validateGuestInput` with `roomCapacity`, `now = Date.now()`.
    - Run the overlap guard against `by_room_and_checkInDate` (take(500)) inside the same transaction; throw `ConvexError("Room is not available for those dates")` on conflict.
    - Retry `generateReferenceCode` up to 5× against `by_reference_code`; throw `ConvexError("Could not allocate reference code")` if every attempt collides.
    - Compute `nights = nightCount(ci, co)` and `totalPrice = room.pricePerNight * nights`; insert with `status: "pending"`, `createdAt: Date.now()`; return `{ referenceCode }`.
    - _(Requirements: 3.1, 3.2, 3.3, 3.4, 4.1–4.10, 5.1, 5.2, 5.3, 5.4, 5.5, 7.4; Properties: 1, 2, 6, 7, 8, 9)_
  - [x] 3.6 Implement `listPaginated` admin query
    - Call `validateSession(ctx, args.sessionToken)` first.
    - Query with `withIndex("by_created_at").order("desc").paginate(args.paginationOpts)`; return `{ page, isDone, continueCursor }`.
    - _(Requirements: 7.1, 8.2, 8.3, 8.9)_
  - [x] 3.7 Implement `pendingCount` admin query
    - Validate session; query `by_status` with `q.eq("status", "pending")`, `.take(1000)` and return `.length` (bounded by the number of pending bookings — low).
    - _(Requirements: 7.1, 8.10)_
  - [x] 3.8 Implement `transitionStatus` admin mutation
    - Validate session; `ctx.db.get(args.id)` or throw `ConvexError("Reservation not found")`.
    - Compute `patch = applyTransition(res.status, args.transition, Date.now())` and `ctx.db.patch(args.id, patch)`; return `null`.
    - _(Requirements: 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.2; Properties: 4, 5)_

- [ ] 4. Convex-level property and integration tests
  - [x] 4.1 Create `convex/__tests__/reservations.test.ts` scaffold
    - Add the `/// <reference types="vite/client" />` directive, `import.meta.glob("./**/*.ts")` module map, `convexTest(schema, modules)`.
    - Add a helper that seeds a room and inserts an `adminSessions` row returning a session token for admin-authenticated calls.
    - _(Requirements: none; supports Properties 1, 2, 4, 6, 9, 11)_
  - [x]* 4.2 Property test — no-double-booking invariant (Property 1)
    - **Property 1: No-double-booking invariant**
    - Drive a single-room backend with `fc.array(fc.oneof(createCmdArb, transitionCmdArb))`. After each command, read every reservation on the room and assert every pair of active ones satisfies `A.checkOutDate <= B.checkInDate || B.checkOutDate <= A.checkInDate`.
    - **Validates: Requirements 3.1, 3.2, 3.3**
  - [x]* 4.3 Property test — edge-adjacent reservations both succeed (Property 2)
    - **Property 2: Overlap boundary is allowed**
    - Generate `[ci1, co1 = ci1 + n1*day, co2 = co1 + n2*day]`; `create` both on the same room; assert both inserts succeed and both remain active simultaneously.
    - **Validates: Requirements 3.4**
  - [x]* 4.4 Property test — cancel releases dates (Property 4)
    - **Property 4: Cancellation releases dates**
    - Create an active reservation, transition it to `cancelled`, re-`create` with the same dates and assert the second create succeeds.
    - **Validates: Requirements 3.5, 6.7**
  - [x]* 4.5 Property test — reference code uniqueness and round-trip (Property 6)
    - **Property 6: Reference code round-trip and uniqueness**
    - Create up to 50 reservations; assert every `getByReferenceCode(r.referenceCode)` returns exactly `r`, `getByReferenceCode(unknown)` returns `null`, and all codes are distinct.
    - **Validates: Requirements 5.2, 5.6, 7.6**
  - [x]* 4.6 Property test — price calculation (Property 9)
    - **Property 9: Price calculation**
    - Vary `pricePerNight` in `[1, 5000]` and `nights` in `[1, 365]`; create and assert `totalPrice === pricePerNight * nights`.
    - **Validates: Requirements 5.4, 5.5**
  - [x]* 4.7 Property test — unauthorized admin calls rejected (Property 11)
    - **Property 11: Admin authorization closure**
    - For each of `listPaginated`, `pendingCount`, `transitionStatus` with a random non-matching token, assert `ConvexError("Unauthorized")` is thrown and the table snapshot before/after the call is identical.
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  - [x]* 4.8 Full-lifecycle integration test
    - Seed a room, create a reservation publicly, authenticate as admin, list reservations, then transition `pending → confirmed → checkedIn → checkedOut`; assert each transition populates the right timestamp.
    - Create a second reservation with overlapping dates; assert the mutation throws `ConvexError("Room is not available for those dates")`.
    - _(Requirements: 3.2, 5.1, 5.3, 6.2, 6.4, 6.5, 8.2, 8.3)_
  - [x] 4.9 Checkpoint — Ensure all Convex tests pass
    - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Frontend public reservation flow
  - [x] 5.1 Rewrite `src/routes/reservations.tsx` to use live Convex data
    - Replace the hardcoded `rooms` array and `unavailableDates` with `useQuery(api.rooms.list)` and, once a date range is chosen, `useQuery(api.reservations.getAvailabilityForRoom, ...)` per room plus `useQuery(api.reservations.getBlockedDatesForRoom, ...)` driving `DatePicker` `disabledDates`.
    - When the selected range covers a date blocked for a room, render that room with the existing "Unavailable" overlay and disable selection.
    - Normalize picked dates to UTC-midnight ms before passing to Convex.
    - _(Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 9.5; Property: 3)_
  - [x] 5.2 Wire the Step 3 Confirm button to `api.reservations.create`
    - Use `useMutation(api.reservations.create)`; on success, navigate with `useNavigate()` to `/reservations/confirmation/$referenceCode` using the returned code.
    - On `ConvexError`, render `err.data` in an inline red banner near the submit button. Keep the existing three-step layout.
    - _(Requirements: 3.3, 4.2, 4.4, 4.6, 4.7, 4.8, 4.9, 4.10, 5.1, 5.3, 7.4; Properties: 1, 2, 6, 7, 8)_
  - [x] 5.3 Create `src/routes/reservations.confirmation.$referenceCode.tsx`
    - TanStack file route with the typed dynamic segment; calls `api.reservations.getByReferenceCode`.
    - Render reference code, room name, check-in / check-out, night count, total price, `StatusBadge`, and guest contact details. Show a "Reservation not found" empty state with a link back home when the query returns `null`.
    - Display the "pay at hotel" copy explicitly per Non-Goals.
    - _(Requirements: 5.3, 5.4, 5.5, 5.6, 7.6; Property: 6)_

- [ ] 6. Admin panel — Reservations tab
  - [x] 6.1 Create `src/components/admin/StatusBadge.tsx`
    - Small pill colored per status: neutral for `pending`, primary for `confirmed` / `checkedIn`, success for `checkedOut`, error for `cancelled`, warning for `noShow`. Use i18n keys `admin.reservations.status.*`.
    - _(Requirements: 8.3, 8.6, 8.7)_
  - [x] 6.2 Create `src/components/admin/ReservationRow.tsx`
    - Render ref code, guest full name, room name, date range, night count, total price, `StatusBadge`, and a contextual action-button row whose visible actions come from `allowedTransitions(current)`.
    - Click toggles detail selection (mirror `MessageRow`).
    - _(Requirements: 8.3, 8.6, 8.7)_
  - [x] 6.3 Create `src/components/admin/ReservationDetailPanel.tsx`
    - Expand inline under the selected row. Show every reservation field plus `createdAt`, `checkedInAt`, `checkedOutAt`, `cancelledAt`. Render only the transition action buttons permitted by `allowedTransitions(currentStatus)` and wrap `cancel` in a `ConfirmationDialog`.
    - Dispatch `api.reservations.transitionStatus` via `useMutation`.
    - _(Requirements: 6.2, 6.3, 8.6, 8.7, 8.8)_
  - [x] 6.4 Create `src/components/admin/ReservationFilters.tsx`
    - Status `CustomSelect` (`"all"` + the six statuses), room `CustomSelect`, two check-in `DatePicker`s, free-text search.
    - Expose the criteria as lifted state; the tab below will feed it through the pure `filterReservations` helper.
    - _(Requirements: 8.4, 8.5; Property: 10)_
  - [x] 6.5 Create `src/components/admin/tabs/ReservationsTab.tsx`
    - Call `api.reservations.listPaginated` with the session token (load one page for MVP), pipe results through `filterReservations(list, criteria)` from the shared helper, and render `ReservationRow` + `ReservationDetailPanel`.
    - Empty state when no rows, matching `MessagesTab` styling.
    - _(Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.9)_
  - [x] 6.6 Update `src/components/admin/AdminSidebar.tsx` to register the new tab
    - Widen the local `AdminTab` union to include `'reservations'`.
    - Insert `{ icon: 'event_available', tab: 'reservations', labelKey: 'admin.sidebar.reservations' }` between `rooms` and `gallery`.
    - Subscribe to `api.reservations.pendingCount` with `sessionToken`; render the badge identical to the unread-messages badge when `count > 0`.
    - _(Requirements: 8.1, 8.10)_
  - [x] 6.7 Register the Reservations tab in `src/routes/admin/_layout.tsx`
    - Add `'reservations'` to the `adminSearchSchema` zod enum.
    - Import `ReservationsTab` and add it to `TAB_COMPONENTS`.
    - _(Requirements: 8.1, 8.2)_

- [ ] 7. Booking.com removal and i18n cleanup
  - [x] 7.1 Strip booking.com from `src/routes/rooms.tsx`
    - Remove both `<a href="https://www.booking.com/Share-WUttkr">` blocks (the modal action row and the page's CTA).
    - Replace the "Book directly with us or through Booking.com" copy with a "Book directly with us for the best rate." string routed through i18n.
    - _(Requirements: 1.2, 1.4)_
  - [x] 7.2 Strip booking.com from `src/routes/index.tsx`
    - Remove the Booking.com CTA in the booking bar; replace with a `<Link to="/reservations">` styled to match the Navbar's `Book Now`.
    - Remove the paragraph that renders `t('booking.untilAvailable')`.
    - _(Requirements: 1.2, 1.4)_
  - [x] 7.3 Verify `src/components/Navbar.tsx` has no booking.com references
    - Requirement 1.1 is vacuously satisfied today; confirm explicitly and leave the file untouched.
    - _(Requirements: 1.1)_
  - [x] 7.4 Update translations in `src/lib/i18n.tsx`
    - Delete `booking.notAvailable`, `booking.bookOnBooking`, `booking.untilAvailable` from both `ka` and `en`.
    - Add: `admin.sidebar.reservations`; `admin.reservations.title`, `noReservations`, `referenceCode`, `guest`, `room`, `dates`, `nights`, `guestCount`, `total`, `status`, `createdAt`, `checkedInAt`, `checkedOutAt`, `cancelledAt`, `specialRequests`.
    - Add status labels `admin.reservations.status.{pending,confirmed,checkedIn,checkedOut,cancelled,noShow}` in both locales.
    - Add action labels `admin.reservations.action.{confirm,cancel,checkIn,checkOut,markNoShow}`.
    - Add filter labels `admin.reservations.filter.{all,status,room,search,checkInFrom,checkInTo}`.
    - Add cancel-dialog keys `admin.reservations.confirmCancelTitle`, `confirmCancelDescription`.
    - Add public flow keys `res.referenceCode`, `res.errorConflict`, `res.errorValidation`, `res.lookupTitle`, `res.lookupNotFound`.
    - _(Requirements: 1.3, 8.1, 8.3, 8.4, 8.6, 8.7, 8.8)_

- [ ] 8. Smoke tests and final verification
  - [x]* 8.1 Grep-based smoke test for Booking.com removal
    - New test in `src/__tests__/noBookingCom.test.ts` (or similar) that reads `src/routes/index.tsx`, `src/routes/rooms.tsx`, and `src/components/Navbar.tsx` via `fs.readFileSync` and asserts the substring `booking.com` (case-insensitive) is absent from all three.
    - _(Requirements: 1.1, 1.2)_
  - [x] 8.2 Typecheck schema + Convex functions with `npx convex dev --once`
    - Run once from the workspace root to ensure `convex/schema.ts`, `convex/availability.ts`, and `convex/reservations.ts` compile and that the generated API types refresh.
    - _(Requirements: 9.1, 9.2, 9.3, 9.4)_
  - [x] 8.3 Run `npx vitest run`
    - Execute every project (`convex` edge-runtime + `frontend` jsdom) and confirm all property tests, unit tests, and integration tests pass.
    - _(Requirements: all; Properties: 1–11)_
  - [x] 8.4 Run the production build
    - Execute `npm run build` and ensure the frontend bundle compiles with no TS or Vite errors after the new routes, components, and i18n keys are in place.
    - _(Requirements: all frontend requirements 1.x, 2.x, 5.x, 8.x)_
  - [x] 8.5 Final checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Sub-tasks marked with `*` are optional per the workflow; with this spec's Correctness Properties section they are strongly recommended and map 1:1 to the design's test layout.
- Each task is scoped to 1–3 files so it can be implemented and verified independently.
- Non-goals are preserved: no payment processing, no guest self-cancellation action, no email notifications, no guest accounts, flat `pricePerNight × nights` pricing.
- Half-open interval semantics are enforced in `convex/availability.ts` and respected by every overlap-aware path (Requirement 3.4, Property 2).

---

The spec is ready to execute. Open `tasks.md` and click "Start task" on an item, or ask me to "execute task N" to implement a specific task, or "run all tasks" to step through them end-to-end.
