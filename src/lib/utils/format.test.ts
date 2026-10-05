import { describe, expect, it } from "vitest";
import {
  formatCfa,
  formatDate,
  formatNumber,
  formatRelativeTime,
} from "@/lib/utils/format";

/**
 * Reduces a formatted currency string to its digits and grouping marks only.
 *
 * `Intl` differs by locale in ways that make raw-string assertions brittle:
 * the symbol is a prefix in en ("F CFA 450,000") and a suffix in fr
 * ("450 000 F CFA"), and the grouping separator is a comma in en but a narrow
 * no-break space in fr. Stripping everything but digits/`,`/`.` leaves the
 * grouping convention visible while ignoring both symbol placement and space
 * flavour.
 */
function digits(formatted: string): string {
  return formatted.replace(/[^\d,.]/g, "");
}

describe("formatCfa", () => {
  it("formats XOF with no minor units", () => {
    // XOF has no minor unit, so no decimal ever appears.
    expect(digits(formatCfa(450000, "en"))).toBe("450,000");
  });

  it("groups per locale", () => {
    // en groups with a comma, fr with a narrow no-break space (U+202F).
    expect(digits(formatCfa(1250000, "en"))).toBe("1,250,000");
    expect(digits(formatCfa(1250000, "fr"))).toBe("1250000");
  });

  it("carries the currency label", () => {
    expect(formatCfa(450000, "en")).toContain("CFA");
  });

  it("keeps zero and negative values intact", () => {
    expect(digits(formatCfa(0, "en"))).toBe("0");
    expect(formatCfa(-50000, "en")).toContain("-");
  });
});

describe("formatNumber", () => {
  it("formats a plain count", () => {
    expect(formatNumber(4, "en")).toBe("4");
    expect(formatNumber(1234, "en").replace(/,/g, "")).toBe("1234");
  });
});

describe("formatDate", () => {
  it("renders a stable ISO date", () => {
    expect(formatDate("2026-03-14T09:00:00.000Z", "en")).toBe("Mar 14, 2026");
    expect(formatDate("2026-03-14T09:00:00.000Z", "fr")).toContain("2026");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-03-14T12:00:00.000Z");

  it("describes recent instants in the past", () => {
    const twoHoursAgo = new Date("2026-03-14T10:00:00.000Z").toISOString();
    expect(formatRelativeTime(twoHoursAgo, "en", now)).toContain("2");
  });

  it("is locale-dependent", () => {
    const twoHoursAgo = new Date("2026-03-14T10:00:00.000Z").toISOString();
    expect(formatRelativeTime(twoHoursAgo, "fr", now)).not.toBe(
      formatRelativeTime(twoHoursAgo, "en", now),
    );
  });

  it("reports days for distant instants", () => {
    const threeDaysAgo = new Date("2026-03-11T12:00:00.000Z").toISOString();
    expect(formatRelativeTime(threeDaysAgo, "en", now)).toContain("3");
  });
});