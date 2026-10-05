import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingTable } from "@/components/owner/listing-table";
import { OWNER_PROPERTIES } from "@/lib/owner/dashboard";

function rowTitles(): string[] {
  // `<thead>` and `<tbody>` both map to the ARIA role `rowgroup` (there is no
  // `tablebody` role), so the body is the second rowgroup in document order.
  const body = screen.getAllByRole("rowgroup")[1];
  // The property name cell is a <th scope="row">, so its ARIA role is
  // `rowheader`, not `cell`.
  return within(body)
    .getAllByRole("row")
    .map((row) => within(row).getByRole("rowheader").textContent ?? "");
}

describe("ListingTable", () => {
  it("renders one row per property", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    expect(screen.getAllByRole("row")).toHaveLength(OWNER_PROPERTIES.length + 1);
  });

  it("renders a row per property, in data order", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    // A row header cell holds the title plus the transaction-type label, so
    // assert containment rather than exact equality.
    rowTitles().forEach((cell, index) => {
      expect(cell).toContain(OWNER_PROPERTIES[index].title);
    });
  });

  it("gives every column a header and every body row five cells", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    const headerCells = within(screen.getAllByRole("row")[0]).getAllByRole("columnheader");
    expect(headerCells).toHaveLength(5);

    const firstBodyRow = screen.getAllByRole("row")[1];
    // One row header (the property cell) + four data cells.
    expect(within(firstBodyRow).getByRole("rowheader")).toBeInTheDocument();
    expect(within(firstBodyRow).getAllByRole("cell")).toHaveLength(4);
  });

  it("renders a text status badge for every row", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    // `getAllByText`, not `getByText`: the mock portfolio has two `active`
    // listings, so "Active" legitimately appears twice. Assert on the distinct
    // labels instead, and on one badge per row.
    for (const label of ["Active", "Pending review", "Locked", "Rented"]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    // Every body row carries a badge in its status cell (third column: the
    // property cell is a `rowheader`, so it is not among the `cell`s).
    for (const row of screen.getAllByRole("row").slice(1)) {
      expect(within(row).getAllByRole("cell")[1]).toHaveTextContent(/\w/);
    }
  });

  it("labels every thumbnail image", () => {
    render(<ListingTable locale="en" properties={OWNER_PROPERTIES} />);
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(OWNER_PROPERTIES.length);
    for (const image of images) {
      expect(image).toHaveAttribute("alt");
      expect(image.getAttribute("alt")).not.toBe("");
    }
  });

  it("shows an empty state instead of a bare table", () => {
    render(<ListingTable locale="en" properties={[]} />);
    expect(
      screen.getByText("You have no listings yet. Add your first property to get started."),
    ).toBeVisible();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});