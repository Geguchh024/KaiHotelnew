# Convex Backend

This directory contains the Convex backend for the Kai Hotel Bar website.

## Structure

- `schema.ts` — Database schema defining all tables and indexes
- `auth.ts` — Admin authentication mutations (login, logout, seedAdmin)
- `rooms.ts` — Room CRUD queries and mutations
- `gallery.ts` — Gallery image queries and mutations
- `sponsors.ts` — Sponsor queries and mutations
- `messages.ts` — Contact message queries and mutations
- `siteSettings.ts` — Site settings query and upsert mutation
- `b2.ts` — Backblaze B2 pre-signed upload URL action

## Environment Variables

Set these via `npx convex env set`:

```
B2_APPLICATION_KEY_ID
B2_APPLICATION_KEY
B2_BUCKET_ID
B2_BUCKET_NAME
B2_ENDPOINT
ADMIN_SETUP_SECRET
```

## Seeding Admin Credentials

Set `ADMIN_SETUP_SECRET`, then run the `seedAdmin` action from the Convex
dashboard or CLI with `username`, `password`, and `setupSecret` to create the
initial admin user. Passwords are stored as bcrypt hashes - never in plaintext.
