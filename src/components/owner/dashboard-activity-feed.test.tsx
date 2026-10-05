import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardActivityFeed } from "@/components/owner/dashboard-activity-feed";
import { OWNER_ACTIVITY } from "@/lib/owner/dashboard";

const NOW = new Date("2026-10-05T12:00:00.000Z");

describe("DashboardActivityFeed", () => {
  it("renders one item per activity", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(OWNER_ACTIVITY.length);
  });

  it("translates each item title", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getByText("Escrow payment received")).toBeVisible();
  });

  it("shows the amount for a payment item", () => {
    render(<DashboardActivityFeed locale="en" items={OWNER_ACTIVITY} now={NOW} />);
    expect(screen.getByText(/750[,. ]?000/)).toBeVisible();
  });

  it("omits an amount for items that have none", () => {
    render(
      <DashboardActivityFeed
        locale="en"
        items={OWNER_ACTIVITY.filter((a) => a.amountCfa === undefined)}
        now={NOW}
      />,
    );
    expect(screen.queryByText(/750[,. ]?000/)).not.toBeInTheDocument();
  });
});