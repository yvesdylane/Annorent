import { t, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { formatCfa, formatNumber } from "@/lib/utils/format";

/**
 * One figure in the dashboard's stat row.
 *
 * Owns: rendering a single labelled metric — a CFA amount or a plain count —
 * with its decorative icon. The dashboard tiles four of these in a grid.
 *
 * Lives in `components/owner/` per file-structure.md rule 2: only the owner
 * dashboard uses it today. When the tenant or hotel dashboard needs the same
 * tile, this file moves to `components/ui/` in that same PR — do not leave a
 * second copy behind.
 *
 * A server component: the value is already formatted on the server, and an
 * interactive tile is not warranted. The percentage unit is looked up rather than
 * hardcoded so it localizes.
 */

export function DashboardStatCard({
  locale,
  label,
  icon,
  valueCfa,
  value,
  unit,
}: {
  locale: Locale;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  valueCfa?: number;
  value?: number;
  /** `"percent"` renders the localized percent unit after the number. */
  unit?: "percent";
}) {
  // Exactly one of `valueCfa` / `value` is set. `unit` is opt-in so that plain
  // counts (listings, reviews) never acquire a stray "%".
  const display =
    typeof valueCfa === "number"
      ? formatCfa(valueCfa, locale)
      : `${formatNumber(value ?? 0, locale)}${unit === "percent" ? t(locale, "owner", "owner.stats.percent") : ""}`;

  return (
    <Card className="flex items-start gap-4 p-5">
      <span
        aria-hidden="true"
        className="material-symbols-outlined text-[28px] text-primary"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-label-md text-label-md text-on-surface-variant">{label}</p>
        <p className="mt-1 font-headline-md text-headline-md text-on-surface">{display}</p>
      </div>
    </Card>
  );
}