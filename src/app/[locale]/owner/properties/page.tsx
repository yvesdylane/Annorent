import { ListingsManagement } from "@/components/owner/listings-management";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Listings Management — `/[locale]/owner/properties`.
 *
 * Composition only (file-structure.md rule 11): the page resolves the locale and
 * passes it down. All markup lives in `components/owner/listings-management.tsx`.
 */

export default async function OwnerListingsPage(props: PageProps<"/[locale]/owner/properties">) {
  const { locale: raw } = await props.params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  return <ListingsManagement locale={locale} />;
}