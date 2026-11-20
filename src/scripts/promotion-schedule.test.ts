import { describe, expect, it } from "vitest";
import { homepagePromotion, isBlackFridayActive } from "./promotion-schedule";

describe("Black Friday campaign schedule", () => {
  it.each([
    ["2026-11-20T12:00:00Z", true],
    ["2026-12-01T00:00:00Z", true],
    ["2026-12-01T23:59:59.999Z", true],
    ["2026-12-02T00:00:00Z", false],
    ["2027-01-01T12:00:00Z", false],
  ])("evaluates the exclusive UK cutoff at %s", (timestamp, active) => {
    expect(isBlackFridayActive(new Date(timestamp))).toBe(active);
  });

  it.each(["2026-11-27T17:00:00Z", "2026-11-28T12:00:00Z"])("shows Black Friday during set menu blackout at %s", timestamp => {
    expect(homepagePromotion(new Date(timestamp))).toBe("black-friday");
  });

  it.each([
    ["2026-12-02T00:00:00Z", "set-menu"],
    ["2026-12-04T16:59:59Z", "set-menu"],
    ["2026-12-04T17:00:00Z", null],
    ["2026-12-05T23:59:59Z", null],
    ["2026-12-06T00:00:00Z", "set-menu"],
    // Original Friday cutoff remains in UK local time during British Summer Time.
    ["2027-06-04T15:59:59Z", "set-menu"],
    ["2027-06-04T16:00:00Z", null],
  ])("restores the existing set menu schedule at %s", (timestamp, expected) => {
    expect(homepagePromotion(new Date(timestamp))).toBe(expected);
  });
});
