import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Admin authentication
  adminUsers: defineTable({
    username: v.string(),
    passwordHash: v.string(), // bcrypt hash, never plaintext
    createdAt: v.number(),
  }).index("by_username", ["username"]),

  adminSessions: defineTable({
    adminUserId: v.id("adminUsers"),
    token: v.string(), // crypto.randomUUID() — 128-bit random
    expiresAt: v.number(), // Unix ms timestamp
    createdAt: v.number(),
  }).index("by_token", ["token"]),

  // Content tables
  rooms: defineTable({
    nameKa: v.string(),
    nameEn: v.string(),
    descriptionKa: v.string(),
    descriptionEn: v.string(),
    pricePerNight: v.number(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    imageUrl: v.string(), // B2 CDN URL
    blurhash: v.optional(v.string()), // BlurHash placeholder string
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  galleryImages: defineTable({
    imageUrl: v.string(), // B2 CDN URL
    altText: v.string(),
    displayOrder: v.number(),
    blurhash: v.optional(v.string()), // BlurHash placeholder string
    createdAt: v.number(),
  }).index("by_display_order", ["displayOrder"]),

  sponsors: defineTable({
    name: v.string(),
    websiteUrl: v.string(),
    logoUrl: v.string(), // B2 CDN URL
    displayOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_display_order", ["displayOrder"]),

  messages: defineTable({
    senderName: v.string(),
    email: v.string(),
    inquiryType: v.string(),
    body: v.string(),
    isRead: v.boolean(),
    submittedAt: v.number(), // Unix ms timestamp
  }).index("by_submitted_at", ["submittedAt"]),

  siteSettings: defineTable({
    // Singleton — only one record; upserted by settings mutation
    phone: v.string(),
    email: v.string(),
    addressKa: v.string(),
    addressEn: v.string(),
    instagramUrl: v.string(),
    facebookUrl: v.string(),
    aboutKa: v.string(),
    aboutEn: v.string(),
    updatedAt: v.number(),
  }),

  reservations: defineTable({
    roomId: v.id("rooms"),
    referenceCode: v.string(),
    guestFullName: v.string(),
    guestEmail: v.string(),
    guestPhone: v.string(),
    guestCount: v.number(),
    checkInDate: v.number(), // UTC midnight ms
    checkOutDate: v.number(), // UTC midnight ms
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("checkedIn"),
      v.literal("checkedOut"),
      v.literal("cancelled"),
      v.literal("noShow"),
    ),
    totalPrice: v.number(),
    createdAt: v.number(),
    checkedInAt: v.optional(v.number()),
    checkedOutAt: v.optional(v.number()),
    cancelledAt: v.optional(v.number()),
    specialRequests: v.optional(v.string()),
  })
    .index("by_reference_code", ["referenceCode"])
    .index("by_room_and_checkInDate", ["roomId", "checkInDate"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});
