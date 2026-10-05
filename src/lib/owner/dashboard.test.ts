import { describe, expect, it } from "vitest";
import { propertyStatuses, type PropertyStatus } from "@/lib/domain/property";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";

describe("owner dashboard data", () => {
  it("uses only statuses the badge can render", () => {
    const allowed = new Set<string>(propertyStatuses);
    for (const property of OWNER_PROPERTIES) {
      expect(allowed.has(property.status), `${property.id} -> ${property.status}`).toBe(true);
    }
  });

  it("gives every property a unique id", () => {
    const ids = OWNER_PROPERTIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has at least one property in each badge-relevant status", () => {
    const present = new Set<PropertyStatus>(OWNER_PROPERTIES.map((p) => p.status));
    expect(present.has("active")).toBe(true);
    expect(present.has("pending_review")).toBe(true);
    expect(present.has("locked")).toBe(true);
  });

  it("requires non-negative prices and views", () => {
    for (const property of OWNER_PROPERTIES) {
      expect(property.priceCfa).toBeGreaterThan(0);
      expect(property.views30d).toBeGreaterThanOrEqual(0);
    }
  });

  it("keeps stat ids unique", () => {
    const ids = OWNER_STATS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives each stat either an amount or a count, never neither", () => {
    for (const stat of OWNER_STATS) {
      const hasAmount = typeof stat.valueCfa === "number";
      const hasCount = typeof stat.value === "number";
      expect(hasAmount || hasCount, `${stat.id} has no value`).toBe(true);
    }
  });

  it("gives every activity item a unique id and a valid timestamp", () => {
    const ids = OWNER_ACTIVITY.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of OWNER_ACTIVITY) {
      expect(Number.isNaN(new Date(item.occurredAtIso).getTime())).toBe(false);
    }
  });
});