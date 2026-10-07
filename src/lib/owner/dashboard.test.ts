import { describe, expect, it } from "vitest";
import {
  MARKET_BENCHMARK,
  OCCUPANCY_CLASSES,
  OCCUPANCY_METRICS,
  OWNER_STATS,
  QUICK_ACTIONS,
  RECENT_INQUIRIES,
  YIELD_PEAK,
  YIELD_SERIES,
} from "@/lib/owner/dashboard";

describe("owner dashboard data", () => {
  it("keeps stat ids unique", () => {
    const ids = OWNER_STATS.map((stat) => stat.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every stat a positive value and a resolved labelKey", () => {
    for (const stat of OWNER_STATS) {
      expect(stat.value, `${stat.id} has no value`).toBeGreaterThan(0);
      expect(stat.labelKey).toMatch(/^owner\./);
      expect(stat.unit).not.toBe("");
    }
  });

  it("gives every stat a kind the card can render", () => {
    for (const stat of OWNER_STATS) {
      expect(["count", "money"]).toContain(stat.kind);
    }
  });

  it("yields six labelled months with April 2025 as the peak", () => {
    expect(YIELD_SERIES).toHaveLength(6);
    expect(YIELD_SERIES[YIELD_SERIES.length - 1]).toBe("Apr 2025");
    expect(YIELD_PEAK.month).toBe("April 2025");
  });

  it("gives every inquiry a unique id", () => {
    const ids = RECENT_INQUIRIES.map((inquiry) => inquiry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps occupancy classes within 0–100%", () => {
    for (const asset of OCCUPANCY_CLASSES) {
      expect(asset.percent).toBeGreaterThanOrEqual(0);
      expect(asset.percent).toBeLessThanOrEqual(100);
      expect(asset.bar).toMatch(/^bg-/);
    }
  });

  it("ships at least one occupancy metric and one quick action", () => {
    expect(OCCUPANCY_METRICS.length).toBeGreaterThan(0);
    expect(QUICK_ACTIONS.length).toBeGreaterThan(0);
    expect(MARKET_BENCHMARK.title).not.toBe("");
  });
});