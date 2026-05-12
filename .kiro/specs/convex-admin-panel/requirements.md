# Requirements Document

## Introduction

This feature integrates Convex as the backend database for the Kai Hotel Bar website and transforms the existing static admin page into a fully functional, authenticated admin panel. The admin panel provides hotel staff with tools to manage rooms, gallery images, sponsors, and site content — all persisted in Convex and served to the public-facing website in real time. Image assets are stored and served via Backblaze B2. Access to the admin panel is protected by a Convex-backed authentication system with predetermined credentials set via Convex functions. Reservations management is explicitly out of scope.

## Glossary

- **Admin_Panel**: The protected `/admin` route of the Kai Hotel Bar website, accessible only to authenticated administrators.
- **Auth_Guard**: The client-side component that checks authentication state and redirects unauthenticated users to the login screen.
- **Convex**: The backend-as-a-service platform providing the real-time database, server functions, and authentication primitives.
- **Convex_Auth**: The authentication layer built on Convex functions that validates admin credentials and issues session tokens.
- **Admin_Session**: A server-side session record stored in Convex that represents an authenticated administrator.
- **Room**: A hotel accommodation unit with attributes including name, description, price per night, capacity, amenities, and associated images.
- **Gallery_Image**: A media asset displayed in the public-facing gallery section, stored in Backblaze B2 and referenced by a Convex record.
- **B2_Storage**: The Backblaze B2 object storage service used to store and serve all image assets.
- **B2_Upload_URL**: A pre-signed URL generated server-side via a Convex function that authorizes a direct client-to-B2 upload.
- **Sponsor**: A partner or sponsor entity with a name, logo image, website URL, and display order.
- **Site_Settings**: A singleton Convex document holding configurable hotel-wide content such as the hero text, contact details, and social links.
- **Tab**: A top-level navigation section within the Admin_Panel sidebar (e.g., Analytics, Rooms, Gallery, Sponsors, Messages, Settings).

---

## Requirements

### Requirement 1: Admin Authentication

**User Story:** As a hotel administrator, I want to log in to the admin panel with a secure password, so that unauthorized users cannot access or modify hotel data.

#### Acceptance Criteria

1. WHEN an unauthenticated user navigates to `/admin`, THE Auth_Guard SHALL redirect the user to the admin login screen at `/admin/login`.
2. WHEN a user submits the login form with a valid username and password, THE Convex_Auth SHALL create an Admin_Session record in Convex and return a session token to the client.
3. WHEN a user submits the login form with an invalid username or password, THE Convex_Auth SHALL return an error and THE Admin_Panel SHALL display the message "Invalid credentials" without revealing which field is incorrect.
4. WHILE an Admin_Session is active, THE Auth_Guard SHALL allow access to all Admin_Panel tabs.
5. WHEN an authenticated administrator clicks "Logout", THE Convex_Auth SHALL invalidate the Admin_Session in Convex and THE Auth_Guard SHALL redirect the user to `/admin/login`.
6. THE Convex_Auth SHALL support seeding predetermined admin credentials via a Convex mutation function callable from the Convex dashboard or CLI, without storing plaintext passwords in source code.
7. IF an Admin_Session token is absent or expired when a request is made to a protected Convex mutation, THEN THE Convex_Auth SHALL reject the request with an "Unauthorized" error.
8. WHEN the login form is submitted, THE Admin_Panel SHALL disable the submit button and display a loading indicator until the Convex_Auth response is received.

---

### Requirement 2: Admin Panel Layout and Navigation

**User Story:** As a hotel administrator, I want a consistent sidebar navigation with clearly labeled tabs, so that I can quickly switch between management sections.

#### Acceptance Criteria

1. THE Admin_Panel SHALL render a fixed left sidebar containing navigation items for: Analytics, Rooms, Gallery, Sponsors, Messages, and Settings.
2. WHEN an administrator clicks a sidebar navigation item, THE Admin_Panel SHALL display the corresponding tab content in the main content area without a full page reload.
3. THE Admin_Panel SHALL visually highlight the currently active sidebar navigation item using the `bg-primary-container text-on-primary-container` style consistent with the existing design system.
4. THE Admin_Panel SHALL display the administrator's current local time and date in the header, updated every minute.
5. THE Admin_Panel SHALL provide a language toggle button that switches the interface between Georgian (`ka`) and English (`en`) using the existing i18n system.
6. THE Admin_Panel SHALL render a "Logout" button in the sidebar footer that triggers the logout flow defined in Requirement 1.

---

### Requirement 3: Room Management

**User Story:** As a hotel administrator, I want to add, edit, and delete room listings from the admin panel, so that the public-facing website always reflects the current room inventory.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Rooms tab, THE Admin_Panel SHALL fetch and display all Room records from Convex in a list or card grid.
2. THE Admin_Panel SHALL display for each Room: name, price per night, capacity (number of guests), a thumbnail of the primary image, and action buttons for Edit and Delete.
3. WHEN an administrator clicks "Add Room", THE Admin_Panel SHALL display a form with fields for: name (bilingual: Georgian and English), description (bilingual), price per night (numeric), capacity (integer), amenities (multi-value text list), and primary image upload.
4. WHEN an administrator submits the Add Room form with all required fields valid, THE Admin_Panel SHALL upload the image to B2_Storage via a B2_Upload_URL and then call a Convex mutation to persist the Room record with the resulting B2 image URL.
5. WHEN an administrator clicks "Edit" on a Room, THE Admin_Panel SHALL populate the room form with the existing Room data and allow modification of any field.
6. WHEN an administrator submits the Edit Room form, THE Admin_Panel SHALL call a Convex mutation to update the Room record in Convex.
7. WHEN an administrator clicks "Delete" on a Room, THE Admin_Panel SHALL display a confirmation dialog before proceeding.
8. WHEN an administrator confirms deletion of a Room, THE Admin_Panel SHALL call a Convex mutation to remove the Room record from Convex.
9. IF a required field (name, price, capacity) is empty when the room form is submitted, THEN THE Admin_Panel SHALL display a field-level validation error and SHALL NOT submit the form.
10. WHEN a Room record is created, updated, or deleted in Convex, THE public-facing website's room listings SHALL reflect the change within 2 seconds via Convex's real-time subscription.

---

### Requirement 4: Gallery Image Management

**User Story:** As a hotel administrator, I want to upload, reorder, and delete gallery images from the admin panel, so that the public-facing gallery section stays visually current.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Gallery tab, THE Admin_Panel SHALL fetch and display all Gallery_Image records from Convex as a responsive image grid.
2. THE Admin_Panel SHALL display for each Gallery_Image: the image thumbnail served from B2_Storage, an alt text label, and action buttons for Edit and Delete.
3. WHEN an administrator clicks "Upload Image", THE Admin_Panel SHALL display a file picker accepting JPEG, PNG, and WebP formats with a maximum file size of 10 MB.
4. WHEN an administrator selects a valid image file and provides an alt text value, THE Admin_Panel SHALL upload the file to B2_Storage via a B2_Upload_URL and then call a Convex mutation to persist the Gallery_Image record with the B2 URL and alt text.
5. IF an administrator selects a file exceeding 10 MB or of an unsupported format, THEN THE Admin_Panel SHALL display the error "File must be JPEG, PNG, or WebP and under 10 MB" and SHALL NOT initiate the upload.
6. WHEN an administrator clicks "Delete" on a Gallery_Image, THE Admin_Panel SHALL display a confirmation dialog before proceeding.
7. WHEN an administrator confirms deletion of a Gallery_Image, THE Admin_Panel SHALL call a Convex mutation to remove the Gallery_Image record from Convex.
8. THE Admin_Panel SHALL allow administrators to set a display order for Gallery_Images by providing an integer order field, and THE Convex query for Gallery_Images SHALL return records sorted by this order field ascending.
9. WHEN a Gallery_Image record is created or deleted in Convex, THE public-facing gallery section SHALL reflect the change within 2 seconds via Convex's real-time subscription.

---

### Requirement 5: Sponsor Management

**User Story:** As a hotel administrator, I want to manage sponsor and partner listings from the admin panel, so that the website's sponsor section stays accurate.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Sponsors tab, THE Admin_Panel SHALL fetch and display all Sponsor records from Convex in a list sorted by display order.
2. THE Admin_Panel SHALL display for each Sponsor: logo thumbnail, name, website URL, display order, and action buttons for Edit and Delete.
3. WHEN an administrator clicks "Add Sponsor", THE Admin_Panel SHALL display a form with fields for: name, website URL, display order (integer), and logo image upload.
4. WHEN an administrator submits the Add Sponsor form with all required fields valid, THE Admin_Panel SHALL upload the logo to B2_Storage via a B2_Upload_URL and then call a Convex mutation to persist the Sponsor record.
5. WHEN an administrator clicks "Edit" on a Sponsor, THE Admin_Panel SHALL populate the sponsor form with the existing Sponsor data and allow modification of any field.
6. WHEN an administrator submits the Edit Sponsor form, THE Admin_Panel SHALL call a Convex mutation to update the Sponsor record in Convex.
7. WHEN an administrator confirms deletion of a Sponsor, THE Admin_Panel SHALL call a Convex mutation to remove the Sponsor record from Convex.
8. IF a required field (name, website URL) is empty when the sponsor form is submitted, THEN THE Admin_Panel SHALL display a field-level validation error and SHALL NOT submit the form.

---

### Requirement 6: Messages (Contact Inquiries)

**User Story:** As a hotel administrator, I want to view contact form submissions from the website, so that I can respond to guest inquiries.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Messages tab, THE Admin_Panel SHALL fetch and display all contact inquiry records from Convex, sorted by submission date descending.
2. THE Admin_Panel SHALL display for each message: sender name, email address, inquiry type, message body, submission timestamp, and a read/unread status indicator.
3. WHEN an administrator clicks on a message, THE Admin_Panel SHALL display the full message details and SHALL call a Convex mutation to mark the message as read.
4. WHEN a visitor submits the contact form on the public-facing website, THE Convex mutation SHALL persist the inquiry as a new message record in Convex.
5. WHEN a new message record is created in Convex, THE Admin_Panel Messages tab SHALL display the new message within 2 seconds via Convex's real-time subscription.
6. THE Admin_Panel SHALL display a badge on the Messages sidebar navigation item showing the count of unread messages.

---

### Requirement 7: Site Settings

**User Story:** As a hotel administrator, I want to edit hotel-wide content such as contact details and social links from the admin panel, so that the public website reflects up-to-date information without a code deployment.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Settings tab, THE Admin_Panel SHALL fetch and display the current Site_Settings record from Convex.
2. THE Site_Settings form SHALL include fields for: hotel phone number, hotel email address, hotel physical address (bilingual), Instagram URL, Facebook URL, and a short "About" description (bilingual).
3. WHEN an administrator submits the Settings form with valid data, THE Admin_Panel SHALL call a Convex mutation to upsert the Site_Settings record in Convex.
4. IF a required field (phone number, email address) is empty when the Settings form is submitted, THEN THE Admin_Panel SHALL display a field-level validation error and SHALL NOT submit the form.
5. WHEN the Site_Settings record is updated in Convex, THE public-facing website components that consume Site_Settings SHALL reflect the change within 2 seconds via Convex's real-time subscription.

---

### Requirement 8: Image Upload via Backblaze B2

**User Story:** As a hotel administrator, I want all uploaded images to be stored in Backblaze B2, so that image assets are reliably hosted and served independently of the application server.

#### Acceptance Criteria

1. THE Admin_Panel SHALL never upload image files directly to the Convex database; all binary image data SHALL be stored exclusively in B2_Storage.
2. WHEN an image upload is initiated, THE Admin_Panel SHALL call a Convex action to generate a B2_Upload_URL with a time-limited authorization token.
3. WHEN a B2_Upload_URL is received, THE Admin_Panel SHALL upload the image file directly from the client browser to B2_Storage using the pre-signed URL.
4. WHEN the B2 upload completes successfully, THE Admin_Panel SHALL store only the resulting public B2 CDN URL in the corresponding Convex document.
5. IF the B2 upload fails, THEN THE Admin_Panel SHALL display the error "Image upload failed. Please try again." and SHALL NOT persist a Convex record for that image.
6. THE Convex action that generates B2_Upload_URLs SHALL only be callable by authenticated Admin_Sessions, enforcing that unauthenticated users cannot obtain upload authorization.

---

### Requirement 9: Analytics Overview

**User Story:** As a hotel administrator, I want to see a summary dashboard when I first log in, so that I can quickly assess the current state of the hotel's content.

#### Acceptance Criteria

1. WHEN an administrator navigates to the Analytics tab, THE Admin_Panel SHALL display summary counts fetched from Convex for: total Room records, total Gallery_Image records, total Sponsor records, and total unread message count.
2. THE Admin_Panel SHALL display the summary counts using the existing stat card design (large number, label, supporting text) consistent with the current admin page design.
3. WHEN any of the underlying Convex records change, THE Analytics tab summary counts SHALL update within 2 seconds via Convex's real-time subscription.
