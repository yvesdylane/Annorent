import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardStatCard } from "@/components/owner/dashboard-stat-card";

describe("DashboardStatCard", () => {
  it("renders a money stat as a formatted CFA amount", () => {
    render(
      <DashboardStatCard
        locale="en"
        label="Revenue this month"
        icon="payments"
        valueCfa={8400000}
      />,
    );
    expect(screen.getByText(/8[,. ]?400[,. ]?000/)).toBeVisible();
  });

  it("renders a count stat without a unit suffix", () => {
    render(<DashboardStatCard locale="en" label="Active listings" icon="home_work" value={6} />);
    expect(screen.getByText("6")).toBeVisible();
    // Guard against a percent suffix leaking onto plain counts.
    expect(screen.queryByText(/6%/)).not.toBeInTheDocument();
  });

  it("appends the localized percent unit only when asked", () => {
    render(
      <DashboardStatCard
        locale="en"
        label="Occupancy"
        icon="donut_large"
        value={78}
        unit="percent"
      />,
    );
    expect(screen.getByText("78%")).toBeVisible();
  });

  it("hides the decorative icon from assistive tech", () => {
    const { container } = render(
      <DashboardStatCard locale="en" label="Active listings" icon="home_work" value={6} />,
    );
    expect(container.querySelector(".material-symbols-outlined")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});