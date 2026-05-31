import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateSession } from "./utils";

export const list = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    return await ctx.db
      .query("messages")
      .withIndex("by_submitted_at")
      .order("desc")
      .take(500);
  },
});

export const unreadCount = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_isRead", (q) => q.eq("isRead", false))
      .take(1000);
    return messages.length;
  },
});

export const submit = mutation({
  args: {
    senderName: v.string(),
    email: v.string(),
    inquiryType: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      ...args,
      isRead: false,
      submittedAt: Date.now(),
    });
  },
});

export const markRead = mutation({
  args: {
    sessionToken: v.string(),
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await validateSession(ctx, args.sessionToken);
    await ctx.db.patch(args.id, { isRead: true });
  },
});
