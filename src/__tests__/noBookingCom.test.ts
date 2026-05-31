import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe("Booking.com removal smoke test", () => {
  const filesToCheck = [
    "src/routes/index.tsx",
    "src/routes/rooms.tsx",
    "src/components/Navbar.tsx",
    "src/routes/__root.tsx",
  ];

  for (const file of filesToCheck) {
    it(`${file} does not contain "booking.com"`, () => {
      const content = readFileSync(resolve(process.cwd(), file), "utf-8");
      expect(content.toLowerCase()).not.toContain("booking.com");
    });
  }
});
