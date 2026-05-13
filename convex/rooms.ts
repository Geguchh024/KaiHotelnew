import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateSession } from "./utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rooms").collect();
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    nameKa: v.string(),
    nameEn: v.string(),
    descriptionKa: v.string(),
    descriptionEn: v.string(),
    pricePerNight: v.number(),
    capacity: v.number(),
    amenities: v.array(v.string()),
    imageUrl: v.string(),
    blurhash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const { sessionToken, ...roomData } = args;
    return await ctx.db.insert("rooms", {
      ...roomData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("rooms"),
    nameKa: v.optional(v.string()),
    nameEn: v.optional(v.string()),
    descriptionKa: v.optional(v.string()),
    descriptionEn: v.optional(v.string()),
    pricePerNight: v.optional(v.number()),
    capacity: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    imageUrl: v.optional(v.string()),
    blurhash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const { sessionToken, id, ...updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("rooms"),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    await ctx.db.delete(args.id);
  },
});
