import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AvailabilityCalendar } from "@/components/owner/availability-calendar";
import {
  CALENDAR_MONTH,
  CALENDAR_SUMMARY,
  CALENDAR_UNITS,
  MAY_2025,
} from "@/lib/owner/calendar";

describe("AvailabilityCalendar", () => {
  it("renders all five weeks of the month — one cell per day record", () => {
    render(<AvailabilityCalendar />);
    expect(screen.getAllByTestId("day-cell")).toHaveLength(MAY_2025.length);
    expect(screen.getByText(CALENDAR_MONTH.label)).toBeVisible();
  });

  it("pre-selects the first unit by default", () => {
    render(<AvailabilityCalendar />);
    // Month/Week toggle also uses `aria-pressed`, so check that one of the
    // pressed buttons is the first unit tab rather than the toggle.
    const pressed = screen.getAllByRole("button", { pressed: true });
    expect(pressed.some((tab) => tab.textContent === CALENDAR_UNITS[0].label)).toBe(true);
  });

  it("selects a unit from the unitId prop", () => {
    render(<AvailabilityCalendar unitId="plateau-4b" />);
    const pressed = screen.getAllByRole("button", { pressed: true });
    expect(pressed.some((tab) => tab.textContent === "Penthouse Plateau (#4B)")).toBe(true);
  });

  it("falls back to the first unit for an unknown unitId", () => {
    render(<AvailabilityCalendar unitId="does-not-exist" />);
    const pressed = screen.getAllByRole("button", { pressed: true });
    expect(pressed.some((tab) => tab.textContent === CALENDAR_UNITS[0].label)).toBe(true);
  });

  it("renders the three summary tiles", () => {
    render(<AvailabilityCalendar />);
    for (const summary of CALENDAR_SUMMARY) {
      expect(screen.getByText(summary.label)).toBeVisible();
    }
  });

  it("toggles between month and week view", () => {
    render(<AvailabilityCalendar />);
    const week = screen.getByRole("button", { name: "Week" });
    const month = screen.getByRole("button", { name: "Month" });
    expect(week).toHaveAttribute("aria-pressed", "false");
    expect(month).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(week);
    expect(screen.getByRole("button", { name: "Week" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Month" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});