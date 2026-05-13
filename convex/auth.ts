import { v, ConvexError } from "convex/values";
import { internalQuery, internalMutation, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/** Internal query: look up an admin user by username. Used by the login action. */
export const getUserByUsername = internalQuery({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
  },
});

/** Internal mutation: insert a new admin user record. Used by seedAdmin action. */
export const insertAdminUser = internalMutation({
  args: { username: v.string(), passwordHash: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("adminUsers")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();

    if (existing) {
      throw new ConvexError("Admin user already exists");
    }

    await ctx.db.insert("adminUsers", {
      username: args.username,
      passwordHash: args.passwordHash,
      createdAt: Date.now(),
    });
  },
});

/** Internal mutation: create a new admin session. Used by the login action. */
export const createSession = internalMutation({
  args: { adminUserId: v.id("adminUsers"), token: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("adminSessions", {
      adminUserId: args.adminUserId,
      token: args.token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      createdAt: Date.now(),
    });
  },
});

/** Public mutation: invalidate a session by setting its expiry to 0. */
export const logout = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken))
      .first();

    if (session) {
      await ctx.db.patch(session._id, { expiresAt: 0 });
    }
  },
});
