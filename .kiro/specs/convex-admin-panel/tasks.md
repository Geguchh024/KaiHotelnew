# Implementation Plan: Convex Admin Panel

## Overview

Integrate Convex as the real-time backend for the Kai Hotel Bar website and replace the static `src/routes/admin.tsx` prototype with a fully functional, authenticated admin panel. Work is ordered so that foundational Convex infrastructure (schema, auth, content functions) is in place before any UI is built. The existing visual design language (EB Garamond + Hanken Grotesk, botanical color palette, sidebar layout) is preserved throughout.

## Tasks

- [x] 1. Install dependencies and initialize Convex project
  - Install `convex`, `convex-test`, `fast-check`, `vitest`, `@vitest/coverage-v8`, `bcryptjs`, `@types/bcryptjs`, and `zod` packages
  - Run `npx convex dev --once` to scaffold the `convex/` directory and generate `convex/_generated/`
  - Add `convex` script entries to `package.json` (`"convex:dev"`, `"test"`, `"test:run"`)
  - Configure `vitest.config.ts` with jsdom environment and path aliases matching `tsconfig.json`
  - _Requirements: 1.1, 1.2, 8.1_

- [x] 2. Define Convex schema
  - [x] 2.1 Create `convex/schema.ts` with all table definitions
    - Define `adminUsers`, `adminSessions`, `rooms`, `galleryImages`, `sponsors`, `messages`, and `siteSettings` tables exactly as specified in the design
    - Add all indexes: `adminUsers.by_username`, `adminSessions.by_token`, `galleryImages.by_display_order`, `sponsors.by_display_order`, `messages.by_submitted_at`
    - _Requirements: 1.2, 3.1, 4.1, 5.1, 6.1, 7.1_

  - [ ]* 2.2 Write property test for schema field constraints
    - **Property 19: B2 upload stores only URL in Convex** — verify `imageUrl` fields accept only string values, never binary/base64
    - **Validates: Requirements 8.1, 8.4**

- [x] 3. Implement Convex auth functions
  - [x] 3.1 Create `convex/auth.ts` with `login`, `logout`, and `seedAdmin` mutations
    - `seedAdmin`: accepts `{ username, password }`, hashes password with bcrypt (cost 12), stores in `adminUsers` — callable from Convex dashboard/CLI only
    - `login`: queries `adminUsers` by username, compares bcrypt hash, creates `adminSessions` record with `crypto.randomUUID()` token and 24h expiry, returns `{ token }`; throws `ConvexError("Invalid credentials")` on any mismatch
    - `logout`: sets `expiresAt = 0` on the matching session record
    - Create internal `validateSession` helper that queries `adminSessions.by_token`, checks `expiresAt > Date.now()`, throws `ConvexError("Unauthorized")` if invalid
    - _Requirements: 1.2, 1.3, 1.5, 1.6, 1.7_

  - [ ]* 3.2 Write property test for invalid credentials always produce the same error
    - **Property 1: Invalid credentials always produce the same error**
    - **Validates: Requirements 1.3**

  - [ ]* 3.3 Write property test for session invalidation is permanent
    - **Property 2: Session invalidation is permanent**
    - **Validates: Requirements 1.5, 1.7**

  - [ ]* 3.4 Write property test for protected mutations reject unauthenticated requests
    - **Property 3: Protected mutations reject unauthenticated requests**
    - **Validates: Requirements 1.7, 8.6**

  - [ ]* 3.5 Write integration tests for auth flow using `convex-test`
    - Test: seed admin → login → verify session created → logout → verify session invalidated
    - Test: login with wrong password returns "Invalid credentials"
    - Test: protected mutation with expired token returns "Unauthorized"
    - _Requirements: 1.2, 1.3, 1.5, 1.7_

- [x] 4. Implement Convex content functions
  - [x] 4.1 Create `convex/rooms.ts` with `list` query and `create`, `update`, `remove` mutations
    - `list`: returns all room records (no auth required — public read)
    - `create`, `update`, `remove`: call `validateSession` before writing
    - _Requirements: 3.1, 3.4, 3.6, 3.8, 3.10_

  - [x] 4.2 Create `convex/gallery.ts` with `list` query and `create`, `remove` mutations
    - `list`: returns gallery images sorted by `displayOrder` ASC using `by_display_order` index
    - `create`, `remove`: call `validateSession` before writing
    - _Requirements: 4.1, 4.4, 4.7, 4.8, 4.9_

  - [ ]* 4.3 Write property test for gallery images sorted by display order
    - **Property 10: Gallery images sorted by display order**
    - **Validates: Requirements 4.8**

  - [x] 4.4 Create `convex/sponsors.ts` with `list` query and `create`, `update`, `remove` mutations
    - `list`: returns sponsors sorted by `displayOrder` ASC using `by_display_order` index
    - `create`, `update`, `remove`: call `validateSession` before writing
    - _Requirements: 5.1, 5.4, 5.6, 5.7_

  - [ ]* 4.5 Write property test for sponsors sorted by display order
    - **Property 12: Sponsors sorted by display order**
    - **Validates: Requirements 5.1**

  - [x] 4.6 Create `convex/messages.ts` with `list`, `unreadCount` queries and `submit`, `markRead` mutations
    - `list`: returns messages sorted by `submittedAt` DESC using `by_submitted_at` index
    - `unreadCount`: returns count of records where `isRead === false`
    - `submit`: public mutation (no auth) — called from the public contact form
    - `markRead`: calls `validateSession` before patching `isRead = true`
    - _Requirements: 6.1, 6.3, 6.4, 6.6_

  - [ ]* 4.7 Write property test for messages sorted by submission date descending
    - **Property 13: Messages sorted by submission date descending**
    - **Validates: Requirements 6.1**

  - [ ]* 4.8 Write property test for unread badge count matches actual unread messages
    - **Property 14: Unread badge count matches actual unread messages**
    - **Validates: Requirements 6.6**

  - [ ]* 4.9 Write property test for clicking a message marks it as read
    - **Property 15: Clicking a message marks it as read**
    - **Validates: Requirements 6.3**

  - [ ]* 4.10 Write property test for contact form submission creates a matching message record
    - **Property 16: Contact form submission creates a matching message record**
    - **Validates: Requirements 6.4**

  - [x] 4.11 Create `convex/siteSettings.ts` with `get` query and `upsert` mutation
    - `get`: returns the singleton settings record or `null`
    - `upsert`: calls `validateSession`, then patches existing record or inserts new one
    - _Requirements: 7.1, 7.3_

  - [ ]* 4.12 Write property test for settings form upsert round-trip
    - **Property 17: Settings form upsert round-trip**
    - **Validates: Requirements 7.3**

  - [ ]* 4.13 Write integration tests for CRUD operations using `convex-test`
    - Test create/read/update/delete for rooms, gallery, sponsors
    - Test `messages.submit` creates record with `isRead = false`
    - Test `siteSettings.upsert` is idempotent (second call updates, not inserts)
    - _Requirements: 3.4, 3.6, 3.8, 4.4, 4.7, 5.4, 5.6, 5.7, 6.4, 7.3_

- [x] 5. Implement Convex B2 upload action
  - [x] 5.1 Create `convex/b2.ts` with `generateUploadUrl` action
    - Call `validateSession` first — unauthenticated callers receive "Unauthorized"
    - Read B2 credentials from Convex environment variables (`B2_APPLICATION_KEY_ID`, `B2_APPLICATION_KEY`, `B2_BUCKET_ID`, `B2_BUCKET_NAME`, `B2_ENDPOINT`)
    - Call B2 `b2_get_upload_url` API and return `{ uploadUrl, authorizationToken }`
    - _Requirements: 8.2, 8.3, 8.6_

  - [ ]* 5.2 Write property test for failed B2 upload prevents Convex record creation
    - **Property 20: Failed B2 upload prevents Convex record creation**
    - **Validates: Requirements 8.5**

- [x] 6. Checkpoint — Ensure all Convex backend tests pass
  - Run `npm run test:run` and verify all auth, content, and B2 tests pass
  - Ensure all Convex functions deploy without errors via `npx convex dev --once`
  - Ask the user if questions arise before proceeding to UI work.

- [x] 7. Set up admin route structure and auth context
  - [x] 7.1 Restructure admin routes for TanStack Router nested layout
    - Delete `src/routes/admin.tsx` (replaced by layout route)
    - Create `src/routes/admin/_layout.tsx` — pathless layout route with `beforeLoad` auth guard that reads `localStorage.getItem('adminSessionToken')` and redirects to `/admin/login` if absent
    - Create `src/routes/admin/_layout.index.tsx` — redirects to `/admin?tab=analytics`
    - Create `src/routes/admin/login.tsx` — public login page (unauthenticated)
    - Add `adminSearchSchema` using zod in `_layout.tsx` to validate `tab` search param with default `'analytics'`
    - _Requirements: 1.1, 2.1, 2.2_

  - [x] 7.2 Create `src/contexts/AdminAuthContext.tsx` with `AdminAuthContext` and `useAdminAuth` hook
    - Store `sessionToken: string | null` in React context, initialized from `localStorage`
    - Expose `login(token)` (sets state + localStorage) and `logout()` (clears state + localStorage, navigates to `/admin/login`)
    - Wrap the admin layout with this provider
    - _Requirements: 1.2, 1.5_

- [x] 8. Implement the login page
  - [x] 8.1 Build `LoginPage` component in `src/routes/admin/login.tsx`
    - Centered card on `bg-surface-container-low` background with hotel name in EB Garamond
    - Username and password inputs with bottom-border style matching existing form aesthetic
    - Submit button: `bg-primary text-on-primary` — disabled with spinner while `useMutation(api.auth.login)` is in-flight
    - On success: call `login(token)` from `useAdminAuth`, navigate to `redirect` search param or `/admin`
    - On failure: display `text-error` message "Invalid credentials" below the form
    - _Requirements: 1.1, 1.2, 1.3, 1.8_

  - [ ]* 8.2 Write unit tests for login form validation and error display
    - Test: submit button disabled while loading
    - Test: error message shown on failed login
    - Test: redirect to `/admin` after successful login
    - _Requirements: 1.3, 1.8_

- [x] 9. Implement the admin layout, sidebar, and header
  - [x] 9.1 Build `AdminLayout` in `src/routes/admin/_layout.tsx`
    - Render `AdminSidebar` (fixed left, `w-64`) + `<Outlet />` for tab content
    - Pass active tab from URL search param to sidebar for highlight state
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 9.2 Build `AdminSidebar` component in `src/components/admin/AdminSidebar.tsx`
    - Nav items: Analytics, Rooms, Gallery, Sponsors, Messages, Settings — each updates `?tab=` search param on click
    - Active item style: `bg-primary-container text-on-primary-container rounded-full`
    - Inactive item style: `text-on-surface-variant hover:bg-surface-container-high rounded-full`
    - Messages item: render unread badge using `useQuery(api.messages.unreadCount)` — `bg-error text-on-error` pill
    - Language toggle button in sidebar header using `useI18n()`
    - Logout button in sidebar footer: calls `api.auth.logout` mutation, then `logout()` from `useAdminAuth`
    - _Requirements: 2.1, 2.3, 2.5, 2.6, 6.6_

  - [x] 9.3 Build `AdminHeader` component in `src/components/admin/AdminHeader.tsx`
    - Display "Welcome back, Administrator" in EB Garamond
    - Live clock updated every minute via `setInterval` in `useEffect`
    - _Requirements: 2.4_

  - [ ]* 9.4 Write property test for navigation tab switching displays correct content
    - **Property 4: Navigation tab switching displays correct content**
    - **Validates: Requirements 2.2, 2.3**

  - [ ]* 9.5 Write property test for language toggle is a round-trip
    - **Property 5: Language toggle is a round-trip**
    - **Validates: Requirements 2.5**

- [x] 10. Implement shared UI utilities
  - [x] 10.1 Create `src/components/admin/ConfirmationDialog.tsx`
    - shadcn/ui `AlertDialog` wrapper with `title`, `description`, `onConfirm`, `onCancel` props
    - Confirm button styled `bg-error text-on-error`
    - _Requirements: 3.7, 4.6, 5.7_

  - [x] 10.2 Create `src/hooks/useB2Upload.ts` implementing the `UseB2Upload` interface
    - `upload(file)`: calls `api.b2.generateUploadUrl` action → uploads file directly to B2 via `fetch` → constructs and returns CDN URL
    - Exposes `isUploading: boolean` and `error: string | null`
    - On B2 upload failure: sets `error = "Image upload failed. Please try again."` and returns `null`
    - _Requirements: 8.2, 8.3, 8.4, 8.5_

  - [x] 10.3 Create `src/utils/fileValidation.ts` with `validateImageFile(file)` function
    - Returns `null` if valid; returns `"File must be JPEG, PNG, or WebP and under 10 MB"` if `file.size > 10 * 1024 * 1024` or `file.type` not in `{image/jpeg, image/png, image/webp}`
    - _Requirements: 4.5_

  - [ ]* 10.4 Write property test for file validation rejects oversized or unsupported files
    - **Property 11: File validation rejects oversized or unsupported files**
    - **Validates: Requirements 4.5**

  - [x] 10.5 Create `src/utils/formValidation.ts` with reusable required-field and URL validation helpers
    - `validateRequired(value)`: returns error string if empty/whitespace
    - `validateUrl(value)`: returns error string if not a valid URL
    - _Requirements: 3.9, 5.8, 7.4_

  - [ ]* 10.6 Write property test for room form validation rejects incomplete submissions
    - **Property 8: Room form validation rejects incomplete submissions**
    - **Validates: Requirements 3.9**

  - [ ]* 10.7 Write property test for settings form validation rejects missing required fields
    - **Property 18: Settings form validation rejects missing required fields**
    - **Validates: Requirements 7.4**

- [x] 11. Implement the Analytics tab
  - [x] 11.1 Create `src/components/admin/tabs/AnalyticsTab.tsx`
    - Use `useQuery(api.rooms.list)`, `useQuery(api.gallery.list)`, `useQuery(api.sponsors.list)`, `useQuery(api.messages.unreadCount)`
    - Render four stat cards (large number + label + supporting text) matching the existing design system card style from `admin.tsx`
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 11.2 Write property test for analytics counts match actual record counts
    - **Property 21: Analytics counts match actual record counts**
    - **Validates: Requirements 9.1**

- [x] 12. Implement the Rooms tab
  - [x] 12.1 Create `src/components/admin/tabs/RoomsTab.tsx` with room list and "Add Room" button
    - Use `useQuery(api.rooms.list)` — renders `RoomCard` for each record
    - _Requirements: 3.1_

  - [x] 12.2 Create `src/components/admin/RoomCard.tsx`
    - Display: room name (current locale), price per night, capacity, thumbnail image, Edit and Delete buttons
    - Delete button opens `ConfirmationDialog`; on confirm calls `useMutation(api.rooms.remove)`
    - _Requirements: 3.2, 3.7, 3.8_

  - [ ]* 12.3 Write property test for room list displays all Convex records
    - **Property 6: Room list displays all Convex records**
    - **Validates: Requirements 3.1**

  - [ ]* 12.4 Write property test for room card renders all required fields
    - **Property 7: Room card renders all required fields**
    - **Validates: Requirements 3.2**

  - [x] 12.5 Create `src/components/admin/RoomFormDialog.tsx`
    - shadcn/ui `Dialog` wrapping a form with: bilingual name fields (Georgian | English), bilingual description fields, price per night (numeric), capacity (integer), amenities (multi-value text list), image upload via `useB2Upload`
    - Pre-populate fields when editing an existing room
    - Validate required fields (`nameKa`, `nameEn`, `pricePerNight`, `capacity`) on submit using `validateRequired`; show field-level errors; do not call mutation if invalid
    - On valid submit: call `useMutation(api.rooms.create)` or `useMutation(api.rooms.update)` with session token
    - Disable submit button and show spinner while mutation is in-flight
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.9_

- [x] 13. Implement the Gallery tab
  - [x] 13.1 Create `src/components/admin/tabs/GalleryTab.tsx` with responsive image grid and "Upload Image" button
    - Use `useQuery(api.gallery.list)` — renders `GalleryImageCard` for each record
    - _Requirements: 4.1_

  - [x] 13.2 Create `src/components/admin/GalleryImageCard.tsx`
    - Display: image thumbnail from B2 URL, alt text label, Delete button
    - Delete button opens `ConfirmationDialog`; on confirm calls `useMutation(api.gallery.remove)`
    - _Requirements: 4.2, 4.6, 4.7_

  - [x] 13.3 Create `src/components/admin/ImageUploadDialog.tsx`
    - File picker with `accept="image/jpeg,image/png,image/webp"`
    - Client-side validation via `validateImageFile` before calling `useB2Upload.upload`
    - Alt text input field (required)
    - Display order integer input field
    - Progress indicator during upload (`isUploading` state)
    - On success: call `useMutation(api.gallery.create)` with B2 URL, alt text, display order
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 14. Implement the Sponsors tab
  - [x] 14.1 Create `src/components/admin/tabs/SponsorsTab.tsx` with sponsor list and "Add Sponsor" button
    - Use `useQuery(api.sponsors.list)` — renders `SponsorRow` for each record
    - _Requirements: 5.1_

  - [x] 14.2 Create `src/components/admin/SponsorRow.tsx`
    - Display: logo thumbnail, name, website URL, display order, Edit and Delete buttons
    - Delete button opens `ConfirmationDialog`; on confirm calls `useMutation(api.sponsors.remove)`
    - _Requirements: 5.2, 5.7_

  - [x] 14.3 Create `src/components/admin/SponsorFormDialog.tsx`
    - shadcn/ui `Dialog` wrapping a form with: name, website URL, display order (integer), logo image upload via `useB2Upload`
    - Validate required fields (`name`, `websiteUrl`) on submit; show field-level errors
    - Pre-populate fields when editing an existing sponsor
    - On valid submit: call `useMutation(api.sponsors.create)` or `useMutation(api.sponsors.update)`
    - _Requirements: 5.3, 5.4, 5.5, 5.6, 5.8_

- [x] 15. Implement the Messages tab
  - [x] 15.1 Create `src/components/admin/tabs/MessagesTab.tsx` with message list
    - Use `useQuery(api.messages.list)` — renders `MessageRow` for each record
    - _Requirements: 6.1_

  - [x] 15.2 Create `src/components/admin/MessageRow.tsx` and `MessageDetailPanel.tsx`
    - `MessageRow`: display sender name, email, inquiry type, submission timestamp, read/unread indicator (filled vs. outlined `mail` Material Symbol icon)
    - Clicking a row opens `MessageDetailPanel` and calls `useMutation(api.messages.markRead)`
    - `MessageDetailPanel`: inline expansion or slide-in panel showing full message details
    - _Requirements: 6.2, 6.3_

  - [ ]* 15.3 Write unit tests for message read/unread state transitions
    - Test: clicking unread message calls `markRead` mutation
    - Test: read indicator updates after `markRead` resolves
    - _Requirements: 6.3_

- [x] 16. Implement the Settings tab
  - [x] 16.1 Create `src/components/admin/tabs/SettingsTab.tsx` with `SiteSettingsForm`
    - Use `useQuery(api.siteSettings.get)` to pre-populate form
    - Fields: phone, email, address (Georgian | English side-by-side), Instagram URL, Facebook URL, about (Georgian | English side-by-side)
    - Validate required fields (`phone`, `email`) on submit; show field-level errors; do not call mutation if invalid
    - On valid submit: call `useMutation(api.siteSettings.upsert)` with session token
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 17. Wire tabs into the admin layout
  - [x] 17.1 Update `src/routes/admin/_layout.tsx` to render the correct tab component based on `?tab=` search param
    - Map `tab` value to: `AnalyticsTab`, `RoomsTab`, `GalleryTab`, `SponsorsTab`, `MessagesTab`, `SettingsTab`
    - Wrap the layout in a React error boundary that displays "Something went wrong" with a retry option for Convex network errors
    - _Requirements: 2.2, 2.3_

  - [ ]* 17.2 Write property test for content mutations propagate to real-time subscribers
    - **Property 9: Content mutations propagate to real-time subscribers**
    - **Validates: Requirements 3.10, 4.9, 7.5, 9.3**

  - [ ]* 17.3 Write property test for B2 upload stores only URL in Convex
    - **Property 19: B2 upload stores only URL in Convex**
    - **Validates: Requirements 8.1, 8.4**

- [x] 18. Add i18n keys for admin panel strings
  - [x] 18.1 Extend `src/lib/i18n.tsx` with all admin-specific translation keys
    - Add keys for: sidebar nav labels, login page strings, form field labels, error messages, confirmation dialog text, tab headings, stat card labels — in both `ka` and `en`
    - _Requirements: 2.5_

  - [ ]* 18.2 Write unit tests for i18n key resolution for admin-specific keys
    - Test: all new admin keys resolve to non-empty strings in both locales
    - Test: no key falls back to the raw key string (i.e., no missing translations)
    - _Requirements: 2.5_

- [x] 19. Final checkpoint — Ensure all tests pass and routes are wired
  - Run `npm run test:run` and verify all unit, property, and integration tests pass
  - Verify TanStack Router regenerates `routeTree.gen.ts` to include the new admin nested routes
  - Verify unauthenticated navigation to `/admin` redirects to `/admin/login`
  - Verify authenticated navigation cycles through all six tabs without errors
  - Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints (tasks 6 and 19) ensure incremental validation before moving to the next phase
- Property tests validate universal correctness properties using fast-check (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases using Vitest
- Integration tests use `convex-test` to exercise the full Convex function stack in isolation
- The existing `src/routes/admin.tsx` is replaced in task 7.1 — its visual design is preserved in the new components
- B2 environment variables must be set via `npx convex env set` before the upload flow can be tested end-to-end
