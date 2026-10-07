import type { ReactNode } from "react";
import { t, type Locale } from "@/lib/i18n";
import { RoleSidebar, type NavItem } from "@/components/layout/role-sidebar";

/**
 * Authenticated application shell.
 *
 * Owns: the chrome every role section renders inside — a fixed sidebar on the
 * inline start edge and a fixed top bar, offset by the sidebar width — so
 * `account`, `owner`, `hotel`, and `admin` share one frame instead of four
 * (file-structure.md rule 1). Mirrors the owner-portal reference: a `w-72`
 * aside with brand block, a `h-16` header, and a `pt-16 px-margin-desktop` main.
 *
 * Does not own: which nav items appear (the caller passes them), and the RBAC
 * guard (that lives in each role's `layout.tsx` per rule 12, not here — this shell
 * is shared, so it cannot know the role it is guarding).
 *
 * A server component: it only composes. `RoleSidebar` is the single client
 * island, because active-link tracking is the only interactive part.
 */

export function AppShell({
  locale,
  items,
  sectionLabel,
  heading,
  footer,
  children,
}: {
  locale: Locale;
  items: readonly NavItem[];
  sectionLabel?: string;
  heading?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <RoleSidebar
          locale={locale}
          items={items}
          sectionLabel={sectionLabel}
          heading={heading}
          footer={footer}
        />
      </aside>

      <div className="flex min-h-screen flex-col pl-72">
        <header className="fixed left-72 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/90 px-margin-desktop shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            {t(locale, "common", "common.appName")}
          </p>
        </header>

        <main
          id="main-content"
          aria-label={t(locale, "common", "common.mainContent")}
          className="w-full bg-surface px-margin-desktop pt-16"
        >
          {children}
        </main>
      </div>
    </div>
  );
}