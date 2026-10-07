import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DocumentsEmpty } from "@/components/owner/documents-empty";

describe("DocumentsEmpty", () => {
  it("renders exactly one page-level heading", () => {
    render(<DocumentsEmpty />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("states the vault is empty", () => {
    render(<DocumentsEmpty />);
    expect(screen.getByText("No documents in the vault yet")).toBeVisible();
  });

  it("offers the upload entry point", () => {
    render(<DocumentsEmpty />);
    expect(screen.getByRole("button", { name: /Upload First Document/ })).toBeVisible();
  });

  it("describes the three vault categories", () => {
    render(<DocumentsEmpty />);
    expect(screen.getByText("Title Deed Certificates")).toBeVisible();
    expect(screen.getByText("OHADA Lease Binders")).toBeVisible();
    expect(screen.getByText("Escrow Attestations")).toBeVisible();
  });
});