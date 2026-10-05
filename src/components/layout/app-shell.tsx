import type { ReactNode } from "react";
import { t, type Locale } from "@/lib/i18n";
import { RoleSidebar, type NavItem } from "@/components/layout/role-sidebar";

/**
 * Authenticated application shell.
 *
 * Owns: the chrome every role section renders inside — a sidebar on the inline
 * start edge and a scrollable main column — so `account`, `owner`, `hotel`, and
 * `admin` share one frame instead of four (file-structure.md rule 1).
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
  children,
}: {
  locale: Locale;
  items: readonly NavItem[];
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-72 shrink-0 lg:block">
        <RoleSidebar locale={locale} items={items} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end gap-4 border-b border-outline-variant bg-surface-container-lowest px-6 py-4">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            {t(locale, "common", "common.appName")}
          </p>
        </header>

        <main
          id="main-content"
          aria-label={t(locale, "common", "common.mainContent")}
          className="flex-1 px-6 py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}