"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { t, type Locale } from "@/lib/i18n";

/**
 * Role sidebar navigation.
 *
 * Owns: rendering one role's navigation list, the sidebar brand block, and
 * deciding which entry is current. Shared by all four role sections (`account`,
 * `owner`, `hotel`, `admin`) per file-structure.md rule 1 — each supplies its own
 * `items`, `sectionLabel`, `heading`, and `footer`, and no role's labels are
 * hardcoded here. The chrome mirrors the owner-portal reference: a fixed brand
 * bar, an optional group heading above the list ("Portfolio Management"), and an
 * optional footer slot for per-role status cards.
 *
 * Does not own: the nav items themselves, or authorization — it renders links the
 * RBAC guard in the role's `layout.tsx` has already allowed through.
 *
 * A client component only because active-item tracking needs `usePathname`.
 * Marking is exact-match plus a `/`-boundary prefix, so `/owner` does not stay
 * highlighted while the user is on `/owner/properties`.
 */

export type NavItem = {
  /** Already locale-prefixed, e.g. "/fr/owner/properties". */
  href: string;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  badgeCount?: number;
};

function matches(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Returns the single most specific `href` that owns `pathname`.
 *
 * A plain "starts with" test would light up every ancestor at once: on
 * `/fr/owner/properties`, both `/fr/owner` and `/fr/owner/properties` match, and
 * the user sees two highlighted entries. Picking the longest match makes the
 * highlight exclusive, so the sidebar always shows exactly one current item.
 */
function currentHref(pathname: string, items: readonly NavItem[]): string | undefined {
  let best: string | undefined;
  for (const item of items) {
    if (!matches(pathname, item.href)) continue;
    if (best === undefined || item.href.length > best.length) best = item.href;
  }
  return best;
}

export function RoleSidebar({
  locale,
  items,
  sectionLabel,
  heading,
  footer,
}: {
  locale: Locale;
  items: readonly NavItem[];
  /** Secondary line under the brand, e.g. "Owner Portal". */
  sectionLabel?: string;
  /** Group heading rendered above the nav list. */
  heading?: string;
  /** Bottom slot for a per-role status card. */
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const activeHref = currentHref(pathname, items);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col">
        <div className="flex h-16 items-center gap-base bg-surface-container-lowest px-gutter">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-on-primary">
              apartment
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm leading-none tracking-tight text-on-surface">
              {t(locale, "common", "common.appName")}
            </span>
            {sectionLabel ? (
              <span className="mt-1 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                {sectionLabel}
              </span>
            ) : null}
          </div>
        </div>

        {heading ? (
          <div className="px-gutter pt-gutter">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              {heading}
            </span>
          </div>
        ) : null}

        <nav
          aria-label={t(locale, "common", "common.primaryNavigation")}
          className="flex flex-col gap-1 px-base pt-base"
        >
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
              const current = item.href === activeHref;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-base rounded-lg px-gutter py-base transition-colors",
                      "font-label-md",
                      current
                        ? "bg-primary-container font-semibold text-on-primary-container"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                    )}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {typeof item.badgeCount === "number" && item.badgeCount > 0 ? (
                      <span
                        data-testid="nav-badge"
                        className="rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant"
                      >
                        {item.badgeCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {footer ? <div className="p-gutter">{footer}</div> : null}
    </div>
  );
}