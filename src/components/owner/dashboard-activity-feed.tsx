import { t, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { formatCfa, formatRelativeTime } from "@/lib/utils/format";
import type { OwnerActivity } from "@/lib/domain/property";

/**
 * Recent-activity list for the owner dashboard.
 *
 * Owns: an ordered feed of the owner's latest bookings, payments, messages, and
 * verification events, each with its relative timestamp and — for money events —
 * its amount.
 *
 * `now` is a required prop rather than being read from the clock, so the rendered
 * output is deterministic for tests and identical between the server render and
 * any later hydration.
 *
 * A server component: nothing here is interactive.
 */

const ACTIVITY_ICON: Record<OwnerActivity["kind"], string> = {
  booking: "event",
  payment: "account_balance_wallet",
  message: "chat",
  verification: "verified",
};

export function DashboardActivityFeed({
  locale,
  items,
  now,
}: {
  locale: Locale;
  items: readonly OwnerActivity[];
  now: Date;
}) {
  return (
    <Card className="p-5">
      <h2 className="font-headline-sm text-headline-sm text-on-surface">
        {t(locale, "owner", "owner.dashboard.activity.title")}
      </h2>

      <ul className="mt-4 flex flex-col divide-y divide-outline-variant">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 py-3">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[20px] text-primary"
            >
              {ACTIVITY_ICON[item.kind]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-body-md text-on-surface">
                {t(locale, "owner", item.titleKey)}
              </span>
              <span className="block text-label-sm text-label-sm text-on-surface-variant">
                {formatRelativeTime(item.occurredAtIso, locale, now)}
              </span>
            </span>
            {typeof item.amountCfa === "number" ? (
              <span className="font-label-md text-label-md text-success">
                {formatCfa(item.amountCfa, locale)}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}