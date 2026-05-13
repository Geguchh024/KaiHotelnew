import { v, ConvexError } from "convex/values";
import { MutationCtx, QueryCtx, internalQuery } from "./_generated/server";

/**
 * Validates an admin session token.
 * Runs in the default Convex runtime (no Node.js required).
 * Call this from mutations and queries that require authentication.
 */
export async function validateSession(
  ctx: MutationCtx | QueryCtx,
  sessionToken: string
) {
  const session = await ctx.db
    .query("adminSessions")
    .withIndex("by_token", (q) => q.eq("token", sessionToken))
    .first();

  if (!session || session.expiresAt <= Date.now()) {
    throw new ConvexError("Unauthorized");
  }

  return session;
}

/**
 * Internal query used by the b2 action to validate a session token.
 * Must live outside b2.ts (which uses "use node") since queries can't
 * run in the Node.js runtime.
 */
export const checkSession = internalQuery({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.sessionToken))
      .first();
    return session !== null && session.expiresAt > Date.now();
  },
});
