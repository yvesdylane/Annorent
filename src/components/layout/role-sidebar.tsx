"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { t, type Locale } from "@/lib/i18n";

/**
 * Role sidebar navigation.
 *
 * Owns: rendering one role's navigation list and deciding which entry is
 * current. Shared by all four role sections (`account`, `owner`, `hotel`,
 * `admin`) per file-structure.md rule 1 — each supplies its own `items`, and no
 * role's labels are hardcoded here.
 *
 * Does not own: the nav items themselves (they come from the role's data module),
 * or authorization — it renders links the RBAC guard in the role's `layout.tsx`
 * has already allowed through.
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
}: {
  locale: Locale;
  items: readonly NavItem[];
}) {
  const pathname = usePathname();
  const activeHref = currentHref(pathname, items);

  return (
    <nav
      aria-label={t(locale, "common", "common.primaryNavigation")}
      className="flex h-full flex-col gap-1 border-inline-end border-outline-variant bg-surface-container-lowest p-4"
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
                  "flex items-center gap-3 rounded-md px-3 py-2",
                  "font-label-md transition-colors",
                  current
                    ? "bg-primary-container text-on-primary-container font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
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
  );
}