import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it.each([
    ["success", "text-success"],
    ["pending", "text-pending"],
    ["locked", "text-locked"],
    ["neutral", "text-on-surface-variant"],
  ] as const)("maps %s tone to %s", (tone, expected) => {
    render(<Badge tone={tone}>Label</Badge>);
    expect(screen.getByText("Label")).toHaveClass(expected);
  });

  it("renders its label as text, so status is never colour-only", () => {
    render(<Badge tone="pending">Pending review</Badge>);
    expect(screen.getByText("Pending review")).toBeVisible();
  });

  it("merges an incoming className without dropping the tone class", () => {
    render(
      <Badge tone="locked" className="mt-2">
        Locked
      </Badge>,
    );
    const badge = screen.getByText("Locked");
    expect(badge).toHaveClass("text-locked");
    expect(badge).toHaveClass("mt-2");
  });
});