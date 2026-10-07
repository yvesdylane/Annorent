import Link from "next/link";
import {
  LISTING_ACTIONS,
  LISTING_CITY_FILTERS,
  LISTING_SORT_FILTERS,
  LISTING_STATUS_TABS,
  LISTING_TYPE_FILTERS,
  LISTINGS_HERO_STATS,
  OWNER_LISTINGS,
  type OwnerListing,
} from "@/lib/owner/listings";
import { type Locale } from "@/lib/i18n";
import { formatNumber } from "@/lib/utils/format";

/**
 * Listings Management — `/[locale]/owner/properties`.
 *
 * Owns: the composition of the portfolio header, hero stats, the filter bar and
 * status tabs, the listing cards, and the bulk/pagination footer — rebuilt
 * against the owner-portal reference screen. A server component: the filters and
 * tabs are non-functional chrome until the API lands, so the full 18-property
 * grid is represented by the reference's five on-page cards.
 *
 * Does not own: the shell, the RBAC guard (both the role's `layout.tsx`), or any
 * data fetching — the records come from the data module.
 */

function ListingCard({ listing, locale }: { listing: OwnerListing; locale: Locale }) {
  const priceNoteTone =
    listing.displayError === undefined ? "text-tertiary" : "text-outline";

  const actionButtons = (() => {
    switch (listing.primaryAction) {
      case "unlock":
        return (
          <>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-tertiary-container px-3 py-1.5 font-label-md text-label-md text-on-tertiary transition-colors hover:bg-tertiary"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                lock_open
              </span>
              {LISTING_ACTIONS.unlock}
            </button>
            <button
              type="button"
              className="rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
            >
              {LISTING_ACTIONS.edit}
            </button>
          </>
        );
      case "view-draft":
        return (
          <>
            <button
              type="button"
              className="rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
            >
              {LISTING_ACTIONS.edit}
            </button>
            <button
              type="button"
              className="rounded-lg bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
            >
              {LISTING_ACTIONS.viewDraft}
            </button>
          </>
        );
      default:
        return (
          <>
            <button
              type="button"
              className="rounded-lg bg-surface-container px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
            >
              {LISTING_ACTIONS.edit}
            </button>
            <button
              type="button"
              className="rounded-lg bg-primary/10 px-3 py-1.5 font-label-md text-label-md text-primary transition-colors hover:bg-primary/20"
            >
              {LISTING_ACTIONS.view}
            </button>
          </>
        );
    }
  })();

  return (
    <div className="group rounded-2xl bg-surface-container-lowest p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl xl:h-36 xl:w-72">
          <img
            src={listing.image}
            alt={listing.imageAlt}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              listing.coverOverlay ? "saturate-50 group-hover:saturate-100" : ""
            }`}
          />
          {listing.coverOverlay ? (
            <div className="absolute inset-0 bg-on-surface/20" />
          ) : null}
          {listing.coverLabel ? (
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 font-label-sm text-[11px] font-semibold uppercase tracking-wide text-on-secondary">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                build
              </span>
              {listing.coverLabel}
            </div>
          ) : null}
          {listing.vr ? (
            <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-md bg-inverse-surface/80 px-2.5 py-1 font-label-sm text-label-sm text-inverse-on-surface shadow-sm backdrop-blur-md">
              <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                view_in_ar
              </span>
              360° VR Visit
            </div>
          ) : null}
          <div className="absolute bottom-2.5 left-2.5 rounded bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-[11px] font-mono tracking-wider text-on-surface">
            {listing.code}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
              <h2 className="truncate font-headline-sm text-headline-sm text-on-surface">
                {listing.title}
              </h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-label-sm text-label-sm ${listing.statusBadgeStyle}`}
              >
                {listing.status === "pending" ? (
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                    pending
                  </span>
                ) : (
                  <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                    check_circle
                  </span>
                )}
                {listing.statusBadge}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 font-label-md text-label-md text-outline">
              <span className="flex items-center gap-1 font-medium text-on-surface">
                <span aria-hidden="true" className="material-symbols-outlined text-[17px] text-outline">
                  location_on
                </span>
                {listing.location}
              </span>
              {listing.specs.map((spec) => (
                <span key={spec} className="flex items-center gap-2">
                  <span aria-hidden="true">•</span>
                  <span>{spec}</span>
                </span>
              ))}
            </div>
          </div>

          {listing.note.style === "amber" ? (
            <div className="flex flex-col justify-between gap-2 rounded-xl bg-[#FFFBEB] p-2.5 text-[#92400E] sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                {listing.note.icon ? (
                  <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-[#D97706]">
                    {listing.note.icon}
                  </span>
                ) : null}
                <span className="font-label-sm text-label-sm">
                  <strong>{listing.note.head}</strong> {listing.note.body}{" "}
                  {listing.note.cta ? (
                    <button
                      type="button"
                      className="ml-1 flex items-center gap-1 font-label-sm text-label-sm font-medium text-primary hover:underline"
                    >
                      <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                        upload_file
                      </span>
                      {listing.note.cta}
                    </button>
                  ) : null}
                </span>
              </div>
            </div>
          ) : listing.note.style === "maintenance" ? (
            <div className="flex flex-col justify-between gap-2 rounded-xl bg-surface-container-low p-2.5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5 text-outline">
                <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-secondary">
                  {listing.note.icon}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  {listing.note.head}.{" "}
                </span>
              </div>
              <div className="font-label-sm text-label-sm text-outline">{listing.note.body}</div>
            </div>
          ) : (
            <div className="flex flex-col justify-between gap-2 rounded-xl bg-surface-container-low p-2.5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-tertiary" />
                <span className="font-label-md text-label-md text-on-surface">
                  <strong className="font-semibold text-on-surface">{listing.note.head}</strong>{" "}
                  {listing.note.body}
                </span>
              </div>
              <div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  calendar_today
                </span>
                <span>Escrow Autopay: Active</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-start justify-between gap-3 pt-2 xl:w-64 xl:items-end xl:pt-0">
          <div className="xl:text-right">
            <div className="font-headline-md text-headline-md font-bold tracking-tight text-primary">
              {formatNumber(listing.priceCfa, locale)} FCFA
            </div>
            <div
              className={`mt-0.5 flex items-center gap-1 font-label-sm text-label-sm font-medium ${priceNoteTone}`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[15px]">
                {listing.primaryAction === "view" ? "lock" : "mail"}
              </span>
              {listing.priceNote}
            </div>
            {listing.target ? (
              <span className="mt-0.5 block font-label-sm text-[11px] text-outline">
                {listing.target}
              </span>
            ) : null}
            {listing.displayError ? (
              <span className="mt-0.5 block font-label-sm text-[11px] font-medium text-error">
                {listing.displayError}
              </span>
            ) : null}
          </div>
          <div className="flex w-full items-center justify-end gap-2 xl:w-auto">
            {actionButtons}
            <button
              type="button"
              aria-label={`More actions for ${listing.title}`}
              className="rounded-lg p-1.5 text-outline transition-colors hover:bg-surface-container-low hover:text-on-surface"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListingsManagement({ locale }: { locale: Locale }) {
  return (
    <div className="flex flex-col pb-16">
      <div className="flex flex-col justify-between gap-6 py-8 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Institutional Portfolio Engine
            </span>
            <span className="text-xs tracking-tight text-outline">
              ● Refreshed Today at 09:42 GMT
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg tracking-tight text-balance text-on-surface">
            My Properties & Listings Management
          </h1>
          <p className="mt-2 max-w-xl font-body-md text-body-md text-on-surface-variant">
            Oversee your institutional real estate portfolio, manage status, update
            pricing, and audit notarial verifications across West & Central Africa.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start lg:self-end">
          <button
            type="button"
            className="group flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-2.5 font-label-md text-label-md text-on-surface shadow-sm transition-all duration-200 hover:bg-surface-container-high"
          >
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[19px] text-outline transition-colors group-hover:text-on-surface"
            >
              download
            </span>
            {LISTING_ACTIONS.exportCsv}
          </button>
          <Link
            href={`/${locale}/owner/properties/new`}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md transition-all duration-200 hover:bg-surface-tint hover:shadow-lg"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              add
            </span>
            + Add Property
          </Link>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {LISTINGS_HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              {stat.label}
            </span>
            <span className={`mt-1 font-headline-sm text-headline-sm ${stat.tone === "tertiary" ? "text-tertiary" : "text-on-surface"}`}>
              {stat.value}
              {stat.unit ? <span className="text-xs font-normal text-outline"> {stat.unit}</span> : null}
            </span>
            <div
              className={`mt-2 flex items-center gap-1.5 font-label-sm text-label-sm ${
                stat.tone === "primary" ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {stat.noteIcon ? (
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {stat.noteIcon}
                </span>
              ) : (
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-tertiary" />
              )}
              <span>{stat.note}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <span aria-hidden="true" className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline">
              search
            </span>
            <input
              type="search"
              placeholder="Search properties, tenants, leases..."
              aria-label="Search properties"
              className="w-full rounded-xl bg-surface-container-low py-2.5 pl-11 pr-4 font-label-md text-label-md text-on-surface transition-all placeholder:text-outline focus:bg-surface-container-lowest focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-1.5 transition-colors hover:bg-surface-container">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-outline">
                apartment
              </span>
              <select
                aria-label="Filter by property type"
                className="cursor-pointer appearance-none bg-transparent pr-4 font-label-md text-label-md text-on-surface focus:outline-none"
              >
                {LISTING_TYPE_FILTERS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2 text-[16px] text-outline">
                expand_more
              </span>
            </div>
            <div className="relative flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-1.5 transition-colors hover:bg-surface-container">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-outline">
                public
              </span>
              <select
                aria-label="Filter by city"
                className="cursor-pointer appearance-none bg-transparent pr-4 font-label-md text-label-md text-on-surface focus:outline-none"
              >
                {LISTING_CITY_FILTERS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2 text-[16px] text-outline">
                expand_more
              </span>
            </div>
            <div className="relative flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-1.5 transition-colors hover:bg-surface-container">
              <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-outline">
                swap_vert
              </span>
              <select
                aria-label="Sort listings"
                className="cursor-pointer appearance-none bg-transparent pr-4 font-label-md text-label-md text-on-surface focus:outline-none"
              >
                {LISTING_SORT_FILTERS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2 text-[16px] text-outline">
                expand_more
              </span>
            </div>
            <div className="flex items-center rounded-xl bg-surface-container-low p-1">
              <button
                type="button"
                aria-label="Table view"
                className="rounded-lg bg-surface-container-lowest p-1.5 text-primary shadow-xs transition-all"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  table_rows
                </span>
              </button>
              <button
                type="button"
                aria-label="Grid view"
                className="rounded-lg p-1.5 text-outline transition-all hover:text-on-surface"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  grid_view
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          {LISTING_STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 font-label-sm text-label-sm transition-all ${
                tab.id === "all"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-low text-on-surface hover:bg-surface-container"
              }`}
            >
              {tab.dot ? <span aria-hidden="true" className={`h-2 w-2 rounded-full ${tab.dot}`} /> : null}
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-semibold ${
                  tab.id === "all" ? "bg-on-primary/20 text-on-primary" : tab.countClass
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {OWNER_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} listing={listing} locale={locale} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 font-label-md text-label-md text-on-surface-variant">
            <input type="checkbox" aria-label="Select all listings on page" className="h-4 w-4 accent-primary" />
            Select All (5 on page)
          </label>
          <div className="relative">
            <select
              aria-label="Bulk actions"
              className="appearance-none rounded-xl bg-surface-container-low px-3 py-1.5 pr-8 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container focus:outline-none"
            >
              <option>Bulk Actions...</option>
              <option>Bulk Adjust Price</option>
              <option>Bulk Calendar Block</option>
              <option>Export Selected</option>
              <option>Request Notary Escrow Audit</option>
            </select>
            <span aria-hidden="true" className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[16px] text-outline">
              expand_more
            </span>
          </div>
          <button
            type="button"
            className="rounded-xl bg-surface-container-low px-3 py-1.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container"
          >
            {LISTING_ACTIONS.applyBulk}
          </button>
        </div>
        <div className="font-label-md text-label-md text-center text-outline">
          Showing <span className="font-semibold text-on-surface">1 – 5</span> of{" "}
          <span className="font-semibold text-on-surface">18</span> properties
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl bg-surface-container-low opacity-50"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              chevron_left
            </span>
          </button>
          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              className={`flex h-9 w-9 items-center justify-center rounded-xl font-label-md text-label-md transition-colors ${
                page === 1
                  ? "bg-primary font-semibold text-on-primary shadow-xs"
                  : "text-on-surface hover:bg-surface-container"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-container-low transition-colors hover:bg-surface-container"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}