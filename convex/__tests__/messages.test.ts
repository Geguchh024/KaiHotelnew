/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../_generated/api";
import schema from "../schema";

const modules = import.meta.glob("../**/*.ts");

async function seedAdminSession(t: ReturnType<typeof convexTest>) {
  return await t.run(async (ctx) => {
    const adminUserId = await ctx.db.insert("adminUsers", {
      username: "admin",
      passwordHash: "hash",
      createdAt: Date.now(),
    });
    const sessionToken = "test-session-token";
    await ctx.db.insert("adminSessions", {
      adminUserId,
      token: sessionToken,
      expiresAt: Date.now() + 60_000,
      createdAt: Date.now(),
    });
    return sessionToken;
  });
}

describe("Admin message inbox authorization", () => {
  it("rejects public inbox reads and allows an authenticated admin", async () => {
    const t = convexTest(schema, modules);
    const sessionToken = await seedAdminSession(t);

    await t.mutation(api.messages.submit, {
      senderName: "Guest",
      email: "guest@example.com",
      inquiryType: "general",
      body: "Hello",
    });

    await expect(
      t.query(api.messages.list, { sessionToken: "invalid" }),
    ).rejects.toThrow("Unauthorized");
    await expect(
      t.query(api.messages.unreadCount, { sessionToken: "invalid" }),
    ).rejects.toThrow("Unauthorized");

    const messages = await t.query(api.messages.list, { sessionToken });
    expect(messages).toHaveLength(1);
    expect(
      await t.query(api.messages.unreadCount, { sessionToken }),
    ).toBe(1);
  });
});
