import { t, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardActivityFeed } from "@/components/owner/dashboard-activity-feed";
import { DashboardStatCard } from "@/components/owner/dashboard-stat-card";
import { ListingTable } from "@/components/owner/listing-table";
import {
  OWNER_ACTIVITY,
  OWNER_PROPERTIES,
  OWNER_STATS,
} from "@/lib/owner/dashboard";
import { formatNumber } from "@/lib/utils/format";

/**
 * The owner dashboard body — `/[locale]/owner`.
 *
 * Owns: the composition and ordering of the dashboard's three regions (stat row,
 * listings table, activity feed) plus its heading and quick actions. A server
 * component throughout: nothing on this screen is interactive yet, because every
 * control here either links to an unbuilt route or acts on data the API does not
 * serve.
 *
 * Does not own: the shell (the role's `layout.tsx` supplies `AppShell`), the RBAC
 * guard (also the layout), or any data fetching (the records arrive as props from
 * the page so this component stays presentational and testable in isolation).
 *
 * `now` is threaded down to the activity feed so relative timestamps do not drift
 * between the server render and the browser.
 */

export function OwnerDashboard({
  locale,
  now,
}: {
  locale: Locale;
  now: Date;
}) {
  return (
    <div className="mx-auto flex max-w-container-max flex-col gap-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface md:font-display-lg md:text-display-lg">
            {t(locale, "owner", "owner.dashboard.title")}
          </h1>
          <p className="mt-2 text-body-lg text-body-lg text-on-surface-variant">
            {t(locale, "owner", "owner.dashboard.greeting")} —{" "}
            {t(locale, "owner", "owner.dashboard.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Both routes exist but are still the 0-byte scaffold stubs; these
              buttons are deliberately non-navigating until that work lands. */}
          <Button variant="secondary" disabled title="Available once the properties route is built">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              add_home_work
            </span>
            {t(locale, "owner", "owner.dashboard.actions.addProperty")}
          </Button>
          <Button variant="primary" disabled title="Available once the rentals route is built">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              add_business
            </span>
            {t(locale, "owner", "owner.dashboard.actions.addRental")}
          </Button>
        </div>
      </header>

      <section
        aria-label={t(locale, "owner", "owner.dashboard.title")}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {OWNER_STATS.map((stat) => (
          <DashboardStatCard
            key={stat.id}
            locale={locale}
            label={t(locale, "owner", stat.labelKey)}
            icon={stat.icon}
            valueCfa={stat.valueCfa}
            value={stat.value}
            unit={stat.unit}
          />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {t(locale, "owner", "owner.dashboard.listings.title")}
            </h2>
            <p className="text-label-sm text-label-sm text-on-surface-variant">
              {formatNumber(OWNER_PROPERTIES.length, locale)}
            </p>
          </div>
          <ListingTable locale={locale} properties={OWNER_PROPERTIES} />
        </Card>

        <DashboardActivityFeed locale={locale} items={OWNER_ACTIVITY} now={now} />
      </div>
    </div>
  );
}