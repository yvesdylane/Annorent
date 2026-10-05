import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("defaults to type=button so it cannot submit an outer form by accident", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "button");
  });

  it("applies a variant and size class", () => {
    render(<Button variant="ghost" size="sm">Cancel</Button>);
    const button = screen.getByRole("button", { name: "Cancel" });
    expect(button.className).toContain("text-primary");
    expect(button.className).toContain("h-9");
  });

  it("honours an explicit type", () => {
    render(<Button type="submit">Go</Button>);
    expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("type", "submit");
  });

  it("forwards disabled", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });
});