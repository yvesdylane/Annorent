import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { t } from "@/lib/i18n";
import {
  OCCUPANCY_CLASSES,
  OWNER_STATS,
  RECENT_INQUIRIES,
  YIELD_PEAK,
} from "@/lib/owner/dashboard";

describe("OwnerDashboard", () => {
  it("renders exactly one page-level heading", () => {
    render(<OwnerDashboard locale="en" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("groups every stat inside one labelled region", () => {
    render(<OwnerDashboard locale="en" />);
    // One region for the stat row, not one per tile: four landmarks sharing the
    // same label would bloat landmark navigation without helping anyone.
    const regions = screen.getAllByRole("region");
    expect(regions).toHaveLength(1);
    // The localized labels are what must actually appear, one per stat.
    const labels = OWNER_STATS.map((stat) => t("en", "owner", stat.labelKey));
    expect(labels).toHaveLength(4);
    for (const label of labels) {
      expect(within(regions[0]).getByText(label)).toBeVisible();
    }
  });

  it("pins the April 2025 yield peak inside the chart", () => {
    render(<OwnerDashboard locale="en" />);
    const chart = screen.getByTestId("yield-chart");
    expect(within(chart).getByText(YIELD_PEAK.month)).toBeVisible();
    expect(within(chart).getByText(YIELD_PEAK.value)).toBeVisible();
  });

  it("renders one inquiry row per record", () => {
    render(<OwnerDashboard locale="en" />);
    for (const inquiry of RECENT_INQUIRIES) {
      expect(screen.getByText(inquiry.name)).toBeVisible();
    }
  });

  it("renders one occupancy asset class per record with its share", () => {
    render(<OwnerDashboard locale="en" />);
    for (const asset of OCCUPANCY_CLASSES) {
      expect(screen.getByText(asset.value)).toBeVisible();
    }
  });
});