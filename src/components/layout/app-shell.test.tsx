import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/layout/app-shell";
import type { NavItem } from "@/components/layout/role-sidebar";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/owner" }));

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

const items: NavItem[] = [{ href: "/en/owner", label: "Dashboard", icon: "dashboard" }];

describe("AppShell", () => {
  it("renders the navigation and the main content landmark", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>Dashboard body</p>
      </AppShell>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders its children inside main", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>Dashboard body</p>
      </AppShell>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Dashboard body");
  });

  it("shows the product name from the common namespace", () => {
    render(
      <AppShell locale="en" items={items}>
        <p>body</p>
      </AppShell>,
    );
    expect(screen.getByText("Annorent")).toBeVisible();
  });
});