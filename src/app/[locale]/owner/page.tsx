import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Owner dashboard — `/[locale]/owner`.
 *
 * Composition only (file-structure.md rule 11): the page resolves the locale and
 * passes it down. All markup lives in `components/owner/owner-dashboard.tsx`.
 */

export default async function OwnerPage(props: PageProps<"/[locale]/owner">) {
  const { locale: raw } = await props.params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  return <OwnerDashboard locale={locale} />;
}