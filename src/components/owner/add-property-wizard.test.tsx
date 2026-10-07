import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AddPropertyWizard } from "@/components/owner/add-property-wizard";
import { WIZARD_REF, WIZARD_STEPS } from "@/lib/owner/add-property";

describe("AddPropertyWizard", () => {
  it("renders the pipeline ref and exactly one page-level heading", () => {
    render(<AddPropertyWizard />);
    expect(screen.getByText(WIZARD_REF.ref)).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("starts on step 1 — Details & Specs", () => {
    render(<AddPropertyWizard />);
    expect(screen.getByRole("button", { name: /Step 1 .* In Progress/ })).toBeVisible();
    expect(screen.getByText("Property Title")).toBeVisible();
  });

  it("lays out one step cell per wizard step", () => {
    render(<AddPropertyWizard />);
    for (const step of WIZARD_STEPS) {
      expect(screen.getByTestId(`wizard-step-${step.number}`)).toBeVisible();
    }
  });

  it("moves forward then back without leaving step 1 at the start", async () => {
    const user = userEvent.setup();
    render(<AddPropertyWizard />);
    const back = screen.getByRole("button", { name: /Back to Start/ });
    expect(back).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /Save & Continue to Next Step/ }));
    expect(screen.getByText("High-Resolution Photos")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Back to Details/ }));
    expect(screen.getByText("Property Title")).toBeVisible();
  });

  it("jumps straight to the last step from initialStep", () => {
    render(<AddPropertyWizard initialStep={3} />);
    // The legal-review step and the footer bar both offer the submit action.
    expect(
      screen.getAllByRole("button", { name: /Submit for Notarial Verification/ }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Notarial & Cadastre Review")).toBeVisible();
  });
});