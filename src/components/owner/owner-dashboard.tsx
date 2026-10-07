import { t, type Locale } from "@/lib/i18n";
import Link from "next/link";
import {
  LEGAL_COMPLIANCE,
  MARKET_BENCHMARK,
  OCCUPANCY_CLASSES,
  OCCUPANCY_METRICS,
  OWNER_STATS,
  QUICK_ACTIONS,
  RECENT_INQUIRIES,
  YIELD_PEAK,
  YIELD_SERIES,
} from "@/lib/owner/dashboard";
import { formatNumber } from "@/lib/utils/format";

/**
 * The owner dashboard body — `/[locale]/owner`.
 *
 * Owns: the composition and ordering of the dashboard's regions — heading and
 * quick actions, the four stat cards, the yield chart with occupancy metrics,
 * recent inquiries, and the right-hand rail (legal compliance, occupancy by
 * asset class, quick actions, market benchmark) — rebuilt against the
 * owner-portal reference screen. A server component: every control here either
 * links to an unbuilt route or acts on data the API does not serve, so nothing
 * on this screen is interactive yet.
 *
 * Does not own: the shell (the role's `layout.tsx` supplies `AppShell`), the RBAC
 * guard (also the layout), or any data fetching (the records arrive from the
 * data module so this component stays presentational and testable in isolation).
 *
 * The yield chart is a static SVG. It encodes relative bar heights and the April
 * 2025 peak that the reference labels; `data-testid="yield-chart"` exists so the
 * test can pin the peak tooltip without coupling to pixels.
 */

const STAT_CARD_ACCENTS: Record<OwnerStatAccent, { burst: string; iconBox: string }> = {
  primary: { burst: "bg-primary/5", iconBox: "bg-primary-fixed text-primary" },
  secondary: {
    burst: "bg-secondary-fixed/40",
    iconBox: "bg-surface-container-high text-on-secondary-fixed-variant",
  },
  tertiary: { burst: "bg-tertiary-fixed/30", iconBox: "bg-surface-container-low text-tertiary" },
};

type OwnerStatAccent = (typeof OWNER_STATS)[number]["accent"];

const YIELD_BARS = [56, 62, 71, 78, 88, 100];

function StatCard({ stat, locale }: { stat: (typeof OWNER_STATS)[number]; locale: Locale }) {
  const accent = STAT_CARD_ACCENTS[stat.accent];
  const chipTone =
    stat.accent === "secondary"
      ? "bg-secondary-fixed text-on-secondary-fixed-variant"
      : "bg-surface-container-low text-tertiary";

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-5 shadow-sm transition-shadow hover:shadow-md">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -mr-6 -mt-6 right-0 top-0 h-24 w-24 rounded-full transition-transform group-hover:scale-110 ${accent.burst}`}
      />
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.iconBox}`}>
          <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
            {stat.icon}
          </span>
        </div>
        {stat.chipIcon ? (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-label-sm font-semibold ${chipTone}`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
              {stat.chipIcon}
            </span>
            {stat.chip}
          </span>
        ) : (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 font-label-sm text-label-sm font-semibold ${chipTone}`}
          >
            {stat.chip}
          </span>
        )}
      </div>
      <div className="mt-4">
        <span className="block font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {t(locale, "owner", stat.labelKey)}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className={`font-headline-md text-headline-md ${stat.kind === "money" ? "text-primary" : "text-on-surface"}`}>
            {formatNumber(stat.value, locale)}
          </span>
          <span className="font-label-sm text-label-sm font-semibold text-outline">{stat.unit}</span>
        </div>
        <p className="mt-1.5 font-label-sm text-label-sm text-on-surface-variant">{stat.caption}</p>
      </div>
    </div>
  );
}

function YieldChart() {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-primary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Listings Performance & Rental Yield
            </h2>
          </div>
          <p className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant">
            Yield trajectories benchmarked against BCEAO escrow transfers
          </p>
        </div>
        <div className="inline-flex self-start rounded-lg bg-surface-container-low p-1 sm:self-center">
          {["7 Days", "30 Days", "This Quarter", "2025 YTD"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={`rounded-md px-3 py-1 font-label-sm text-label-sm transition-colors ${
                index === 1
                  ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div data-testid="yield-chart" className="relative h-72 pt-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[78%] top-4 z-20 flex -translate-x-1/2 flex-col items-center rounded-lg bg-on-background px-3 py-2 text-inverse-on-surface shadow-xl"
        >
          <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-inverse-primary">
            {YIELD_PEAK.month}
          </span>
          <span className="font-headline-sm text-headline-sm leading-tight text-on-primary">
            {YIELD_PEAK.value}
          </span>
          <span className="mt-0.5 font-label-sm text-label-sm font-medium text-tertiary-fixed">
            {YIELD_PEAK.detail}
          </span>
        </div>
        <svg
          role="img"
          aria-label={`Monthly escrow net revenue. Peak ${YIELD_PEAK.month}: ${YIELD_PEAK.value}`}
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {YIELD_BARS.map((height, index) => (
            <rect
              key={YIELD_SERIES[index]}
              x={index * 16 + 2}
              y={100 - height}
              width="10"
              height={height}
              rx="2"
              className={index === YIELD_BARS.length - 1 ? "fill-primary" : "fill-primary-container"}
            />
          ))}
        </svg>
        <div className="flex justify-between px-6 pt-2 font-label-sm text-label-sm font-semibold text-outline">
          {YIELD_SERIES.map((label, index) => (
            <span key={label} className={index === YIELD_SERIES.length - 1 ? "text-primary" : ""}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter rounded-xl bg-surface-container-low p-4 pt-4 md:grid-cols-3">
        {OCCUPANCY_METRICS.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-sm">
              <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${metric.tone}`}>
                {metric.icon}
              </span>
            </div>
            <div>
              <span className="block font-label-sm text-label-sm text-outline">{metric.label}</span>
              <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentInquiries() {
  const inboxDot = (status: "funded" | "bailiff") =>
    status === "funded"
      ? "bg-surface-container-highest text-tertiary"
      : "bg-secondary-fixed text-on-secondary-fixed-variant";

  return (
    <div className="flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-fixed text-primary">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              assignment_turned_in
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Recent Inquiries & Move-In Requests
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Instant dossier validation with pre-funded escrow deposits
            </p>
          </div>
        </div>
        <a className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-primary hover:underline">
          View all 42 inquiries
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
        </a>
      </div>

      <div className="flex flex-col gap-3">
        {RECENT_INQUIRIES.map((inquiry) => (
          <div
            key={inquiry.id}
            className="flex flex-col justify-between gap-4 rounded-xl bg-surface-container-low p-4 transition-colors hover:bg-surface-container-high md:flex-row md:items-center"
          >
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed font-label-md text-label-md font-semibold text-primary">
                {inquiry.name
                  .replace(/^Dr\.\s*/, "")
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="flex items-center gap-2">
                  <span className="truncate font-label-md text-label-md font-semibold text-on-surface">
                    {inquiry.name}
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-tertiary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-tertiary-fixed">
                    <span aria-hidden="true" className="material-symbols-outlined text-[13px]">
                      {inquiry.tierIcon}
                    </span>
                    {inquiry.tier}
                  </span>
                </div>
                <div className="mt-0.5 flex items-center gap-2 truncate font-label-sm text-label-sm text-on-surface-variant">
                  <span className="font-medium text-primary">{inquiry.property}</span>
                  <span>•</span>
                  <span className="truncate">{inquiry.dates}</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 md:justify-end">
              <div className="flex flex-col items-end">
                <span
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-label-sm text-label-sm font-semibold ${inboxDot(inquiry.status)}`}
                >
                  {inquiry.status === "bailiff" ? (
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                      policy
                    </span>
                  ) : (
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-tertiary" />
                  )}
                  {inquiry.status === "funded" ? "Escrow Funded" : "Awaiting Bailiff Inspection"}
                </span>
                <span className="mt-0.5 font-label-sm text-label-sm text-outline">
                  {inquiry.amount}
                </span>
              </div>
              <button
                type="button"
                className="rounded-lg bg-primary px-4 py-2 font-label-sm text-label-sm font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
              >
                Review & Accept
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegalCompliance() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed">
            <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
              gavel
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Legal Compliance</h3>
            <span className="font-label-sm text-label-sm text-outline">Cadastre & OHADA Seal</span>
          </div>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-low text-tertiary">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
            verified
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low p-4">
        <div className="flex items-center justify-between">
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {LEGAL_COMPLIANCE.heading}
          </span>
          <span className="rounded bg-tertiary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-tertiary-fixed">
            {LEGAL_COMPLIANCE.badge}
          </span>
        </div>
        <p className="font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
          {LEGAL_COMPLIANCE.summary}
        </p>
        <div className="flex items-center gap-2 pt-2 text-on-surface">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-primary">
            account_balance
          </span>
          <span className="font-label-sm text-label-sm font-medium">
            {LEGAL_COMPLIANCE.complianceLine}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline">{LEGAL_COMPLIANCE.auditLabel}</span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {LEGAL_COMPLIANCE.auditDate}
          </span>
        </div>
        <button
          type="button"
          className="flex items-center gap-0.5 font-label-md text-label-md font-semibold text-primary hover:underline"
        >
          View Deeds
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            launch
          </span>
        </button>
      </div>
    </div>
  );
}

function OccupancyClasses() {
  return (
    <div className="flex flex-col gap-5 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Occupancy by Asset Class</h3>
        <span className="font-label-sm text-label-sm text-outline">Live Capacity</span>
      </div>
      <div className="flex flex-col gap-4">
        {OCCUPANCY_CLASSES.map((asset) => (
          <div key={asset.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between font-label-md text-label-md">
              <span className="font-medium text-on-surface">{asset.label}</span>
              <span className="font-semibold text-primary">{asset.value}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div className={`h-full rounded-full ${asset.bar}`} style={{ width: `${asset.percent}%` }} />
            </div>
            <span className="font-label-sm text-label-sm text-outline">{asset.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OwnerDashboard({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col pb-16">
      <div className="flex flex-col justify-between gap-gutter pt-base pb-gutter xl:flex-row xl:items-end">
        <div className="flex max-w-3xl flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wide text-on-primary-fixed">
              Institutional Tier Portal
            </span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              Live Sync • Dakar & Abidjan
            </span>
          </div>
          <h1 className="mt-1 font-headline-md text-headline-md leading-none tracking-tight text-on-surface xl:font-display-lg xl:text-display-lg">
            {t(locale, "owner", "owner.dashboard.title")}
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {t(locale, "owner", "owner.dashboard.subtitle")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-start xl:self-end">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-2.5 font-label-md text-label-md text-primary shadow-sm transition-all hover:bg-surface-container-high"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[19px]">
              picture_as_pdf
            </span>
            Download Portfolio Report (PDF)
          </button>
          <Link
            href={`/${locale}/owner/properties/new`}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              add
            </span>
            + Add New Property
          </Link>
        </div>
      </div>

      <section
        aria-label={t(locale, "owner", "owner.dashboard.title")}
        className="mb-gutter grid grid-cols-1 gap-gutter sm:grid-cols-2 xl:grid-cols-4"
      >
        {OWNER_STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} locale={locale} />
        ))}
      </section>

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-gutter lg:col-span-8">
          <YieldChart />
          <RecentInquiries />
        </div>
        <div className="flex flex-col gap-gutter lg:col-span-4">
          <LegalCompliance />
          <OccupancyClasses />
          <div className="flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
                bolt
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Quick Actions & Tools
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className="group flex w-full items-center justify-between rounded-lg bg-surface-container-low p-3 font-label-md text-label-md text-on-surface transition-all hover:bg-surface-container-high"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px] text-outline transition-colors group-hover:text-primary"
                    >
                      {action.icon}
                    </span>
                    {action.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-[18px] text-outline transition-transform group-hover:translate-x-0.5"
                  >
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-primary p-5 text-on-primary shadow-sm">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-surface-tint/40" />
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-tertiary-fixed">
                insights
              </span>
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wide text-primary-fixed">
                {MARKET_BENCHMARK.eyebrow}
              </span>
            </div>
            <p className="mt-2 font-headline-sm text-headline-sm leading-snug">{MARKET_BENCHMARK.title}</p>
            <p className="mt-1 font-label-sm text-label-sm text-primary-fixed">{MARKET_BENCHMARK.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}