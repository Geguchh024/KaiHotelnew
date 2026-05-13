# Requirements Document

## Introduction

This feature replaces the static, mock reservation flow and the third-party "Booking.com" links on the Kai Hotel Bar website with a fully functional, end-to-end reservation system backed by Convex. Public visitors can view real rooms, see which dates are available for each room, and submit a reservation with their contact details. The system prevents double-booking (two overlapping reservations for the same room), validates guest input, and stores every reservation in Convex. Hotel staff manage reservations through a new "Reservations" tab in the existing admin panel, where they can view all reservations, filter by status and date, and perform lifecycle actions — confirm, check-in, check-out, cancel, or mark no-show. All external booking redirect links are removed from the public site.

## Glossary

- **Reservation_System**: The set of Convex functions, React routes, and admin UI that collectively manage public-facing reservation creation and admin-side reservation management.
- **Reservation**: A persisted Convex record representing one guest's intent to stay in a specific Room over a specific date range, identified by a unique Reference_Code.
- **Reference_Code**: A short, unique, URL-safe string assigned to each Reservation at creation time, used by the guest to look up their Reservation.
- **Room**: An existing hotel accommodation unit stored in the Convex `rooms` table.
- **Guest**: A non-authenticated website visitor who submits a Reservation through the public reservation flow.
- **Admin**: A hotel staff member authenticated via the existing admin session mechanism.
- **Admin_Panel**: The existing `/admin` route, extended with a new Reservations tab.
- **Check_In_Date**: The calendar date on which the Guest is scheduled to begin their stay. Stored as a Unix millisecond timestamp normalized to 00:00:00 UTC of that date.
- **Check_Out_Date**: The calendar date on which the Guest is scheduled to end their stay. Stored as a Unix millisecond timestamp normalized to 00:00:00 UTC of that date.
- **Reservation_Range**: The half-open date interval `[Check_In_Date, Check_Out_Date)` associated with a Reservation. A Reservation occupies the Room on every date D such that `Check_In_Date <= D < Check_Out_Date`.
- **Overlap**: Two Reservation_Ranges `[a1, a2)` and `[b1, b2)` overlap if and only if `a1 < b2` and `b1 < a2`. Reservations that share only an endpoint (e.g., one Reservation's Check_Out_Date equals another's Check_In_Date) do not overlap.
- **Active_Reservation**: A Reservation whose status is one of `pending`, `confirmed`, or `checkedIn`. Reservations with status `cancelled`, `noShow`, or `checkedOut` are not Active_Reservations.
- **Reservation_Status**: One of `pending`, `confirmed`, `checkedIn`, `checkedOut`, `cancelled`, `noShow`.
- **Availability**: For a given Room and date range `[ci, co)`, Availability is true if and only if no Active_Reservation for that Room has a Reservation_Range that overlaps `[ci, co)`.
- **Booking_Link**: Any outbound hyperlink on the public website that directs visitors to an external reservation provider (specifically, `booking.com` URLs).

---

## Requirements

### Requirement 1: Remove External Booking Links

**User Story:** As a hotel owner, I want all external booking redirect links removed from the public site, so that visitors book exclusively through our own reservation system.

#### Acceptance Criteria

1. THE Reservation_System SHALL remove every Booking_Link from the Navbar component.
2. THE Reservation_System SHALL remove every Booking_Link from the rooms list page, the room detail modal, and the home page.
3. THE Reservation_System SHALL remove the i18n translation keys `booking.notAvailable`, `booking.bookOnBooking`, and `booking.untilAvailable` from the translation bundle.
4. WHEN a Guest clicks a primary reservation call-to-action on any public page, THE Reservation_System SHALL navigate the Guest to the in-site `/reservations` route.

---

### Requirement 2: Display Real Rooms and Per-Room Availability

**User Story:** As a Guest, I want to see the actual rooms with their availability for my intended dates, so that I can pick a room that is free when I want to stay.

#### Acceptance Criteria

1. WHEN a Guest opens the `/reservations` route, THE Reservation_System SHALL fetch the list of Rooms from the Convex `rooms` table and display each Room's name, description, price per night, capacity, amenities, and image.
2. WHEN a Guest has selected a Check_In_Date and a Check_Out_Date, THE Reservation_System SHALL mark each Room in the selectable list as available or unavailable based on Availability for that Room over the selected date range.
3. THE Reservation_System SHALL display, for each Room, a month-view calendar that visually marks every date D as unavailable when at least one Active_Reservation for that Room has a Reservation_Range covering D.
4. WHEN a Guest opens the Check_In_Date picker, THE Reservation_System SHALL disable every date that is strictly before the current calendar date.
5. WHEN a Guest opens the Check_Out_Date picker, THE Reservation_System SHALL disable every date that is less than or equal to the currently selected Check_In_Date.
6. WHERE a Guest has selected a Check_In_Date and a Check_Out_Date that contains a date blocked by an Active_Reservation for a given Room, THE Reservation_System SHALL render that Room with a visible unavailable indicator and SHALL prevent selection of that Room.

---

### Requirement 3: No Double-Booking Invariant

**User Story:** As a hotel owner, I want the system to guarantee that a Room is never booked for overlapping dates by two different Guests, so that I never have to turn a Guest away on arrival.

#### Acceptance Criteria

1. THE Reservation_System SHALL hold the following invariant at all times: for any two Active_Reservations `A` and `B` referencing the same Room, the Reservation_Ranges of `A` and `B` do not Overlap.
2. WHEN a Guest submits a new Reservation for a given Room and date range, THE Reservation_System SHALL read all existing Active_Reservations for that Room within the same Convex mutation and SHALL reject the new Reservation if its Reservation_Range overlaps any existing Active_Reservation.
3. IF a new Reservation is rejected due to Overlap with an existing Active_Reservation, THEN THE Reservation_System SHALL return an error identifying the conflict and SHALL NOT insert a Reservation record.
4. WHEN two Reservations share an endpoint such that one's Check_Out_Date equals the other's Check_In_Date on the same Room, THE Reservation_System SHALL treat the two Reservations as non-overlapping and SHALL allow both.
5. WHEN an Admin cancels a Reservation, THE Reservation_System SHALL release the Reservation's dates such that subsequent Availability checks on that Room and date range return true (assuming no other Active_Reservation covers them).

---

### Requirement 4: Reservation Input Validation

**User Story:** As a hotel owner, I want the reservation form to collect complete and well-formed contact details, so that I can reach every Guest who books.

#### Acceptance Criteria

1. THE Reservation_System SHALL require the following fields for every Reservation: full name, email address, phone number, Room reference, Check_In_Date, Check_Out_Date, and guest count.
2. IF any required field listed in Requirement 4.1 is empty or whitespace-only when a Guest submits the reservation form, THEN THE Reservation_System SHALL display a field-level validation error and SHALL NOT create a Reservation.
3. WHEN a Guest submits the reservation form, THE Reservation_System SHALL validate the email field against the pattern `<local>@<domain>.<tld>` where `<local>` contains at least one character, `<domain>` contains at least one character, and `<tld>` contains at least two characters.
4. IF the email field fails the pattern check in Requirement 4.3, THEN THE Reservation_System SHALL display the error "Invalid email address" and SHALL NOT create a Reservation.
5. WHEN a Guest submits the reservation form, THE Reservation_System SHALL validate the phone field after trimming whitespace by requiring at least 7 digits in total, allowing only the characters `0-9`, `+`, `-`, ` `, `(`, `)`.
6. IF the phone field fails the pattern check in Requirement 4.5, THEN THE Reservation_System SHALL display the error "Invalid phone number" and SHALL NOT create a Reservation.
7. IF the submitted Check_In_Date is greater than or equal to the submitted Check_Out_Date, THEN THE Reservation_System SHALL reject the Reservation with the error "Check-out must be after check-in".
8. IF the submitted Check_In_Date is strictly before the current calendar date, THEN THE Reservation_System SHALL reject the Reservation with the error "Check-in cannot be in the past".
9. IF the submitted guest count exceeds the selected Room's capacity, THEN THE Reservation_System SHALL reject the Reservation with the error "Guest count exceeds room capacity".
10. IF the submitted guest count is less than 1, THEN THE Reservation_System SHALL reject the Reservation with the error "At least one guest is required".

---

### Requirement 5: Reservation Creation and Confirmation

**User Story:** As a Guest, I want a clear confirmation after I submit my reservation, so that I know my booking was recorded and I have a reference to use later.

#### Acceptance Criteria

1. WHEN all validations in Requirement 4 and the Availability check in Requirement 3 pass, THE Reservation_System SHALL insert a Reservation record with status `pending`, a unique Reference_Code, and a `createdAt` timestamp set to the current server time.
2. THE Reservation_System SHALL generate each Reference_Code such that, across the set of all existing Reservations, no two Reservations share the same Reference_Code.
3. WHEN a Reservation is created successfully, THE Reservation_System SHALL return the Reference_Code to the client and THE Reservation_System SHALL display a confirmation screen containing the Reference_Code, the Room name, the Check_In_Date, the Check_Out_Date, the night count, the total price, and the Guest's contact details.
4. THE Reservation_System SHALL compute the night count for each Reservation as the integer number of whole days between Check_In_Date and Check_Out_Date.
5. THE Reservation_System SHALL compute the total price for each Reservation as `Room.pricePerNight × night_count`.
6. WHEN a Guest looks up a Reservation by Reference_Code through the public lookup query, THE Reservation_System SHALL return the Reservation record matching that exact Reference_Code and SHALL return `null` for any other value.

---

### Requirement 6: Reservation Lifecycle State Machine

**User Story:** As an Admin, I want to move each Reservation through a clear set of statuses, so that the records reflect what actually happens with each booking.

#### Acceptance Criteria

1. THE Reservation_System SHALL assign every Reservation exactly one of the following statuses at all times: `pending`, `confirmed`, `checkedIn`, `checkedOut`, `cancelled`, `noShow`.
2. THE Reservation_System SHALL allow the following status transitions and no others:
   - `pending` → `confirmed`
   - `pending` → `cancelled`
   - `confirmed` → `checkedIn`
   - `confirmed` → `cancelled`
   - `confirmed` → `noShow`
   - `checkedIn` → `checkedOut`
3. IF an Admin requests a status transition not listed in Requirement 6.2, THEN THE Reservation_System SHALL reject the transition with the error "Invalid status transition" and SHALL leave the Reservation unchanged.
4. WHEN a Reservation transitions to `checkedIn`, THE Reservation_System SHALL record the current server time as the `checkedInAt` timestamp on the Reservation.
5. WHEN a Reservation transitions to `checkedOut`, THE Reservation_System SHALL record the current server time as the `checkedOutAt` timestamp on the Reservation.
6. WHEN a Reservation transitions to `cancelled`, THE Reservation_System SHALL record the current server time as the `cancelledAt` timestamp on the Reservation.
7. WHILE a Reservation's status is `cancelled`, `noShow`, or `checkedOut`, THE Reservation_System SHALL exclude the Reservation from Availability checks as defined in the Glossary.

---

### Requirement 7: Admin Authorization for Reservation Actions

**User Story:** As a hotel owner, I want only authenticated Admins to manage reservations, so that Guests and the public cannot modify booking records.

#### Acceptance Criteria

1. IF a request to list all Reservations arrives without a valid Admin session token, THEN THE Reservation_System SHALL reject the request with an "Unauthorized" error.
2. IF a request to transition the status of any Reservation arrives without a valid Admin session token, THEN THE Reservation_System SHALL reject the request with an "Unauthorized" error.
3. IF a request to delete any Reservation arrives without a valid Admin session token, THEN THE Reservation_System SHALL reject the request with an "Unauthorized" error.
4. WHEN a Guest submits a new Reservation through the public reservation flow, THE Reservation_System SHALL accept the request without an Admin session token.
5. WHEN a Guest queries Availability for a Room and date range, THE Reservation_System SHALL accept the request without an Admin session token.
6. WHEN a Guest looks up a Reservation by Reference_Code, THE Reservation_System SHALL return only that one Reservation and SHALL NOT expose other Reservations in the response.

---

### Requirement 8: Admin Reservations Tab

**User Story:** As an Admin, I want a Reservations tab in the admin panel where I can see and manage every booking, so that I can run day-to-day hotel operations from one place.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render a new "Reservations" item in the admin sidebar navigation, placed between "Rooms" and "Gallery".
2. WHEN an Admin opens the Reservations tab, THE Admin_Panel SHALL fetch and display all Reservations from Convex, sorted by `createdAt` descending.
3. THE Admin_Panel SHALL display for each Reservation in the list: Reference_Code, Guest full name, Room name, Check_In_Date, Check_Out_Date, night count, total price, status, and action controls.
4. THE Admin_Panel SHALL provide filter controls on the Reservations tab for: status (any of the six Reservation_Status values or "all"), Room, Check_In_Date range, and free-text search against the Guest name, email, and Reference_Code.
5. WHEN an Admin applies one or more filters, THE Admin_Panel SHALL display only Reservations that match every active filter criterion.
6. WHEN an Admin clicks a Reservation row, THE Admin_Panel SHALL display a detail panel showing the Reservation's Reference_Code, Guest full name, email, phone, Room, Check_In_Date, Check_Out_Date, night count, guest count, total price, status, and every recorded timestamp (`createdAt`, `checkedInAt`, `checkedOutAt`, `cancelledAt`).
7. THE Admin_Panel SHALL provide status transition action buttons on each Reservation that correspond to the valid transitions defined in Requirement 6.2 for that Reservation's current status, and SHALL hide or disable buttons for transitions that are not allowed from the current status.
8. WHEN an Admin clicks the Cancel action on a Reservation, THE Admin_Panel SHALL display a confirmation dialog before invoking the status transition.
9. WHEN a Reservation is created, updated, or deleted in Convex, THE Admin_Panel Reservations tab SHALL reflect the change within 2 seconds via the existing Convex real-time subscription mechanism.
10. THE Admin_Panel SHALL display an unread-style badge on the Reservations sidebar item showing the count of Reservations in `pending` status.

---

### Requirement 9: Reservation Storage Schema

**User Story:** As a developer, I want a single Convex table that stores every field needed to implement the requirements above, so that queries stay simple and the invariant in Requirement 3 is enforceable in one place.

#### Acceptance Criteria

1. THE Reservation_System SHALL define a Convex table named `reservations` that stores the following fields for every Reservation: `roomId` (foreign key to `rooms`), `referenceCode`, `guestFullName`, `guestEmail`, `guestPhone`, `guestCount`, `checkInDate`, `checkOutDate`, `status`, `totalPrice`, `createdAt`, `checkedInAt` (optional), `checkedOutAt` (optional), `cancelledAt` (optional), `specialRequests` (optional).
2. THE `reservations` table SHALL define an index on `referenceCode` to support constant-time lookup by Reference_Code.
3. THE `reservations` table SHALL define an index on `(roomId, checkInDate)` to support efficient availability queries for a given Room.
4. THE `reservations` table SHALL define an index on `status` to support efficient filtering by status in the admin list.
5. THE Reservation_System SHALL represent `checkInDate` and `checkOutDate` as Unix millisecond timestamps normalized to 00:00:00 UTC of the respective calendar date.

---

## Correctness Properties (for Property-Based Testing)

These properties are derived from the acceptance criteria above and will drive property-based tests in the design and implementation phases. Each property is keyed to the requirement it verifies.

1. **No-double-booking invariant (Requirement 3.1):** For any sequence of reservation creations and status transitions, and for any two reservations `A` and `B` with the same `roomId` that are both Active_Reservations, `A.checkOutDate <= B.checkInDate` or `B.checkOutDate <= A.checkInDate`.
2. **Overlap boundary (Requirement 3.4):** For any two reservations where `A.checkOutDate == B.checkInDate` on the same Room, both reservations can coexist as Active_Reservations.
3. **Availability correctness (Requirement 2.2):** For any Room `R` and any date range `[ci, co)`, `isAvailable(R, ci, co)` returns `true` if and only if no Active_Reservation for `R` overlaps `[ci, co)` under the overlap definition in the Glossary.
4. **Cancellation releases dates (Requirement 3.5):** After cancelling a Reservation `X` on Room `R` covering `[ci, co)`, and with no other Active_Reservation on `R` overlapping `[ci, co)`, `isAvailable(R, ci, co)` returns `true`.
5. **State machine closure (Requirement 6.2, 6.3):** For any Reservation in status `S` and any attempted transition `T`, the transition succeeds if and only if `(S, T)` is listed in Requirement 6.2; on rejection, the Reservation's status is unchanged.
6. **Reference code round-trip (Requirement 5.2, 5.6):** For any set of created Reservations, looking up each Reservation by its own Reference_Code returns exactly that Reservation; looking up by any Reference_Code not in the set returns `null`; and no two Reservations in the set share a Reference_Code.
7. **Date ordering validation (Requirement 4.7):** For any input with `checkInDate >= checkOutDate`, creation is rejected; for any input with `checkInDate < checkOutDate` that also passes every other validation, creation proceeds to the Availability check.
8. **Guest count validation (Requirement 4.9, 4.10):** For any input with `guestCount < 1` or `guestCount > Room.capacity`, creation is rejected; for any input with `1 <= guestCount <= Room.capacity` that also passes every other validation, creation proceeds.
9. **Price calculation (Requirement 5.5):** For any Reservation, `totalPrice == Room.pricePerNight * ((checkOutDate - checkInDate) / 86_400_000)`, where the divisor corresponds to one day in milliseconds.
10. **Filter subset (Requirement 8.5):** For any filter criteria `F1` that is a strict refinement of `F2` (every field in `F1` is either equal to the corresponding field in `F2` or strictly narrower), the set of Reservations returned by `filter(F1)` is a subset of the set returned by `filter(F2)`.
11. **Admin authorization closure (Requirement 7.1, 7.2, 7.3):** For any privileged query or mutation invoked without a valid Admin session token, the result is an "Unauthorized" error and no database state changes.
