import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateSession } from "./utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("galleryImages")
      .withIndex("by_display_order")
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    imageUrl: v.string(),
    altText: v.string(),
    displayOrder: v.number(),
    blurhash: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const { sessionToken, ...imageData } = args;
    return await ctx.db.insert("galleryImages", {
      ...imageData,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("galleryImages"),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    await ctx.db.delete(args.id);
  },
});
