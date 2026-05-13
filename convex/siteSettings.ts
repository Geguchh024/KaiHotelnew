import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateSession } from "./utils";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("siteSettings").first();
  },
});

export const upsert = mutation({
  args: {
    sessionToken: v.string(),
    phone: v.string(),
    email: v.string(),
    addressKa: v.string(),
    addressEn: v.string(),
    instagramUrl: v.string(),
    facebookUrl: v.string(),
    aboutKa: v.string(),
    aboutEn: v.string(),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const { sessionToken, ...settingsData } = args;

    const existing = await ctx.db.query("siteSettings").first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...settingsData, updatedAt: Date.now() });
    } else {
      await ctx.db.insert("siteSettings", { ...settingsData, updatedAt: Date.now() });
    }
  },
});
