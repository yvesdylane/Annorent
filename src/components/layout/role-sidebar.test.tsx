import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RoleSidebar, type NavItem } from "@/components/layout/role-sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/owner/properties" }));

// `next/link` needs an App Router context that a bare render does not provide;
// a plain anchor exercises the same href/aria-current contract.
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  } & Record<string, unknown>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const items: NavItem[] = [
  { href: "/fr/owner", label: "Tableau de bord", icon: "dashboard" },
  { href: "/fr/owner/properties", label: "Biens", icon: "home_work", badgeCount: 2 },
  { href: "/fr/owner/rentals", label: "Locations", icon: "desk" },
];

describe("RoleSidebar", () => {
  it("renders a navigation landmark with the provided items", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Biens/ })).toHaveAttribute(
      "href",
      "/fr/owner/properties",
    );
  });

  it("marks the current route with aria-current", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByRole("link", { name: /Biens/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: /Locations/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("does not mark the dashboard active when a child route is current", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByRole("link", { name: /Tableau de bord/ })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("shows a badge count when present and omits it otherwise", () => {
    render(<RoleSidebar locale="fr" items={items} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getAllByTestId("nav-badge")).toHaveLength(1);
  });

  it("hides the icon from assistive tech and labels the link with text", () => {
    const { container } = render(<RoleSidebar locale="fr" items={items} />);
    expect(container.querySelector(".material-symbols-outlined")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});