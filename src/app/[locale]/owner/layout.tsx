import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/guards";
import { ownerNav } from "@/lib/owner/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Property-owner section layout — the frame for every `/owner/**` route.
 *
 * Owns: the RBAC guard for the `property_owner` role, applied once here so no
 * page beneath re-checks it (file-structure.md rule 12), and the shared app
 * shell the section renders inside.
 *
 * Does not own: any per-page layout decision, or session creation.
 */

export default async function OwnerLayout({
  params,
  children,
}: LayoutProps<"/[locale]/owner">) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  // Called for its side effect: a role mismatch redirects and throws. The
  // returned session is deliberately not rendered here — the personalized
  // greeting belongs to `OwnerDashboard`, and duplicating the name in an
  // `sr-only` element would just be noise for screen-reader users.
  requireRole(locale, "property_owner");

  return (
    <AppShell locale={locale} items={ownerNav(locale)}>
      {children}
    </AppShell>
  );
}