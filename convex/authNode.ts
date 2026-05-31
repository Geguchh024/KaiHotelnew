"use node";

import { v, ConvexError } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import bcrypt from "bcryptjs";

/**
 * Public action: seed the initial admin user.
 * Hashes the password with bcrypt, then calls an internal mutation to write to DB.
 */
export const seedAdmin = action({
  args: {
    username: v.string(),
    password: v.string(),
    setupSecret: v.string(),
  },
  handler: async (ctx, args) => {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    if (!setupSecret || args.setupSecret !== setupSecret) {
      throw new ConvexError("Unauthorized");
    }
    const passwordHash = await bcrypt.hash(args.password, 12);
    await ctx.runMutation(internal.auth.insertAdminUser, {
      username: args.username,
      passwordHash,
    });
  },
});

/**
 * Public action: log in with username + password.
 * Fetches the user record, compares bcrypt hash, then creates a session via internal mutation.
 */
export const login = action({
  args: { username: v.string(), password: v.string() },
  handler: async (ctx, args): Promise<{ token: string }> => {
    const user = await ctx.runQuery(internal.auth.getUserByUsername, {
      username: args.username,
    });

    if (!user) {
      throw new ConvexError("Invalid credentials");
    }

    const isValid = await bcrypt.compare(args.password, user.passwordHash);
    if (!isValid) {
      throw new ConvexError("Invalid credentials");
    }

    const token = crypto.randomUUID();
    await ctx.runMutation(internal.auth.createSession, {
      adminUserId: user._id,
      token,
    });

    return { token };
  },
});
