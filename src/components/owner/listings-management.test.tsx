import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingsManagement } from "@/components/owner/listings-management";
import {
  LISTING_STATUS_TABS,
  LISTINGS_HERO_STATS,
  OWNER_LISTINGS,
} from "@/lib/owner/listings";

describe("ListingsManagement", () => {
  it("renders exactly one page-level heading", () => {
    render(<ListingsManagement locale="en" />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("renders a card per listing record", () => {
    render(<ListingsManagement locale="en" />);
    for (const listing of OWNER_LISTINGS) {
      expect(screen.getByText(listing.title)).toBeVisible();
    }
  });

  it("renders the hero stats row", () => {
    render(<ListingsManagement locale="en" />);
    for (const stat of LISTINGS_HERO_STATS) {
      expect(screen.getByText(stat.label)).toBeVisible();
    }
  });

  it("renders every status tab with its count", () => {
    render(<ListingsManagement locale="en" />);
    for (const tab of LISTING_STATUS_TABS) {
      expect(screen.getByRole("button", { name: new RegExp(tab.label) })).toHaveTextContent(
        String(tab.count),
      );
    }
  });

  it("links the Add Property action through the locale-prefixed route", () => {
    render(<ListingsManagement locale="en" />);
    expect(screen.getByRole("link", { name: "+ Add Property" })).toHaveAttribute(
      "href",
      "/en/owner/properties/new",
    );
  });
});