import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("joins plain strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values and keeps 0", () => {
    expect(cn("a", null, undefined, false, "", "b")).toBe("a b");
    expect(cn("n-", 0)).toBe("n- 0");
  });

  it("keeps keys whose flag is truthy", () => {
    expect(cn({ "is-open": true, "is-closed": false })).toBe("is-open");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", { c: true }]])).toBe("a b c");
  });
});