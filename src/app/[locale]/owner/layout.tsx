import { AppShell } from "@/components/layout/app-shell";
import { requireRole } from "@/lib/auth/guards";
import { ownerNav } from "@/lib/owner/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Property-owner section layout — the frame for every `/owner/**` route.
 *
 * Owns: the RBAC guard for the `property_owner` role, applied once here so no
 * page beneath re-checks it (file-structure.md rule 12), and the shared app
 * shell the section renders inside. The shell's role-specific chrome — the
 * "Owner Portal" section label, the "Portfolio Management" heading, and the
 * institutional-tier footer card — is supplied here so `RoleSidebar` stays
 * role-agnostic.
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
    <AppShell
      locale={locale}
      items={ownerNav(locale)}
      sectionLabel="Owner Portal"
      heading="Portfolio Management"
      footer={
        <div className="flex flex-col gap-base rounded-xl bg-surface-container-low p-gutter shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-base">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-tertiary">
              verified
            </span>
            <span className="font-label-sm text-label-sm text-tertiary">
              Verified Institutional Tier
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">
              Escrow Fiduciary Protection
            </span>
            <span className="mt-0.5 font-label-sm text-label-sm leading-tight text-on-surface-variant">
              BCEAO &amp; OHADA Compliant
            </span>
          </div>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}