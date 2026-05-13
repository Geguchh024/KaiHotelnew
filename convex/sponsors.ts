import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateSession } from "./utils";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sponsors")
      .withIndex("by_display_order")
      .order("asc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sessionToken: v.string(),
    name: v.string(),
    websiteUrl: v.string(),
    logoUrl: v.string(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const { sessionToken, ...sponsorData } = args;
    return await ctx.db.insert("sponsors", {
      ...sponsorData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("sponsors"),
    name: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
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
    id: v.id("sponsors"),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    await ctx.db.delete(args.id);
  },
});
