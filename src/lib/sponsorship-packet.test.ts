import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(__dirname, "../..");
const partnersSource = readFileSync(resolve(root, "src/routes/partners.tsx"), "utf8");

describe("sponsorship packet on /partners", () => {
  const match = partnersSource.match(/const SPONSORSHIP_PACKET = "([^"]+)"/);

  it("declares a packet path on the partners page", () => {
    expect(match, "SPONSORSHIP_PACKET constant not found in partners.tsx").not.toBeNull();
  });

  it("points at a real PDF in public/", () => {
    const file = resolve(root, "public", match![1].replace(/^\//, ""));
    const stat = statSync(file);
    expect(stat.size).toBeGreaterThan(1_000_000);
    expect(readFileSync(file).subarray(0, 5).toString()).toBe("%PDF-");
  });

  it("renders the download button in both the header and the closing CTA", () => {
    expect(partnersSource.match(/<PacketButton \/>/g)).toHaveLength(2);
  });
});
