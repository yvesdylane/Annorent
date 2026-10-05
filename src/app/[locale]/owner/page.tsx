import { OwnerDashboard } from "@/components/owner/owner-dashboard";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Owner dashboard — `/[locale]/owner`.
 *
 * Composition only (file-structure.md rule 11): the page resolves the locale and
 * passes it down. All markup lives in `components/owner/owner-dashboard.tsx`.
 *
 * `now` is computed here and handed to the dashboard so the activity feed's
 * relative timestamps are computed once, on the server, from a single instant.
 *
 * `force-dynamic`: the feed renders "2 hours ago", which is only correct if the
 * page renders per request. Statically prerendering would freeze those labels at
 * build time and show "6 days ago" tomorrow. No other route in this project
 * declares a `revalidate` window, so there is no existing convention to follow
 * and per-request rendering is the honest default for a relative timestamp.
 * Revisit alongside the real API call: once the feed comes from the backend,
 * server-fetched absolute dates would make this static again.
 */

export const dynamic = "force-dynamic";

export default async function OwnerPage(props: PageProps<"/[locale]/owner">) {
  const { locale: raw } = await props.params;
  const locale: Locale = isLocale(raw) ? raw : "en";

  return <OwnerDashboard locale={locale} now={new Date()} />;
}