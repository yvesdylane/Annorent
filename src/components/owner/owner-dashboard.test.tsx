import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { OWNER_ACTIVITY, OWNER_PROPERTIES, OWNER_STATS } from "@/lib/owner/dashboard";

const NOW = new Date("2026-10-05T12:00:00.000Z");

describe("OwnerDashboard", () => {
  it("renders exactly one page-level heading", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("groups every stat inside one labelled region", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    // One region for the stat row, not one per tile: four landmarks sharing the
    // same label would bloat landmark navigation without helping anyone.
    const regions = screen.getAllByRole("region");
    expect(regions).toHaveLength(1);
    // The localized labels are what must actually appear, one per stat.
    const labels = ["Active listings", "Awaiting review", "Occupancy rate", "Revenue this month"];
    expect(labels).toHaveLength(OWNER_STATS.length);
    for (const label of labels) {
      expect(within(regions[0]).getByText(label)).toBeVisible();
    }
  });

  it("passes the current time to the activity feed, not a hardcoded one", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    // The newest activity is 2026-10-04T09:15Z — 26h45m before NOW, which
    // rounds to -1 day, and `numeric: "auto"` renders that as "yesterday".
    // If the component ignored `now` and called `new Date()` internally, every
    // label would collapse to "x seconds ago" and this would fail.
    expect(screen.getByText("yesterday")).toBeVisible();
  });

  it("renders a row per property", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("row")).toHaveLength(OWNER_PROPERTIES.length + 1);
  });

  it("renders one item per activity", () => {
    render(<OwnerDashboard locale="en" now={NOW} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(OWNER_ACTIVITY.length);
  });
});