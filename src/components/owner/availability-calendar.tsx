"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  CALENDAR_LEGEND,
  CALENDAR_MONTH,
  CALENDAR_RATES,
  CALENDAR_SETTINGS,
  CALENDAR_SUMMARY,
  CALENDAR_UNITS,
  CALENDAR_REF,
  MAY_2025,
  WEEK_DAYS,
  type CalendarDay,
} from "@/lib/owner/calendar";

/**
 * Availability Calendar — `/[locale]/owner/rentals` and
 * `/[locale]/owner/rentals/[id]/availability`.
 *
 * Owns: the month/week grid of reservation states, the unit switcher, the legend,
 * the three summary tiles, and the pricing settings rail — rebuilt against the
 * owner-portal reference screen. A client component because the unit tabs and the
 * month/week toggle are interactive; cells themselves are status display until the
 * API serves real bookings.
 *
 * `unitId` (optional) lets the per-unit route open a specific unit's tab.
 */

const CORNER_ICONS: Partial<Record<NonNullable<CalendarDay["corner"]>, string>> = {
  bolt: "bolt",
  build: "build",
  pool: "pool",
  task_alt: "task_alt",
  lock: "lock",
  logout: "logout",
  apartment: "apartment",
  event_available: "event_available",
  schedule: "schedule",
  hourglass_bottom: "hourglass_bottom",
  fact_check: "fact_check",
  verified_user: "verified_user",
  check_circle: "check_circle",
};

function DayCell({ cell }: { cell: CalendarDay }) {
  const base =
    "flex min-h-[108px] flex-col justify-between rounded-lg p-2 transition-colors";

  switch (cell.tone) {
    case "prev":
      return (
        <div data-testid="day-cell" className={cn(base, "select-none bg-surface-container-low/40 opacity-40")}>
          <span className="font-label-md text-label-md text-outline">{cell.day}</span>
          <span className="font-label-sm text-[10px] text-outline">{cell.monthLabel}</span>
        </div>
      );
    case "booked":
      return (
        <div data-testid="day-cell" className={cn(base, "relative cursor-pointer bg-primary-container text-on-primary shadow-sm group hover:bg-primary")}>
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[17px] font-bold">{cell.day}</span>
            {cell.corner === "dot" ? (
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed" />
            ) : (
              <span aria-hidden="true" className="material-symbols-outlined text-[15px] opacity-90">
                {cell.corner ? CORNER_ICONS[cell.corner] : ""}
              </span>
            )}
          </div>
          <div className="rounded bg-primary/40 p-1 backdrop-blur-sm">
            <p className="truncate font-label-sm text-[11px] font-bold leading-tight text-on-primary">
              {cell.title}
            </p>
            <p className="mt-0.5 truncate font-label-sm text-[10px] opacity-90 leading-none">
              {cell.sub}
            </p>
          </div>
        </div>
      );
    case "blocked":
      return (
        <div data-testid="day-cell" className={cn(base, "cursor-not-allowed bg-secondary-container text-on-secondary-container")}>
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[17px] font-semibold">{cell.day}</span>
            <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-outline">
              {cell.corner ? CORNER_ICONS[cell.corner] : ""}
            </span>
          </div>
          <div className="rounded bg-surface-container-lowest/60 p-1">
            <p className="font-label-sm text-[11px] font-semibold leading-tight text-on-surface">
              {cell.title}
            </p>
            <p className="mt-0.5 truncate font-label-sm text-[10px] text-outline leading-none">
              {cell.sub}
            </p>
          </div>
        </div>
      );
    case "selected":
      return (
        <div data-testid="day-cell" className={cn(base, "cursor-pointer bg-surface-container-lowest shadow-md outline outline-2 outline-primary")}>
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[17px] font-bold text-primary">{cell.day}</span>
            <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
              {cell.corner ? CORNER_ICONS[cell.corner] : ""}
            </span>
          </div>
          <div className="rounded bg-primary/10 p-1">
            <span className="font-label-sm text-[10px] font-bold text-primary uppercase">Selected</span>
            <p className="mt-0.5 font-label-sm text-[10px] leading-none text-on-surface">{cell.sub}</p>
          </div>
        </div>
      );
    case "pending":
      return (
        <div data-testid="day-cell" className={cn(base, "cursor-pointer bg-primary-fixed text-on-primary-fixed hover:bg-surface-container-high")}>
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[17px] font-bold">{cell.day}</span>
            <span className={cn("material-symbols-outlined text-[16px] text-primary", cell.corner === "schedule" && "animate-spin")}>
              {cell.corner ? CORNER_ICONS[cell.corner] : ""}
            </span>
          </div>
          <div className="rounded bg-surface-container-lowest/80 p-1">
            <p className="truncate font-label-sm text-[11px] font-semibold text-primary leading-tight">
              {cell.title}
            </p>
            <p className="mt-0.5 truncate font-label-sm text-[10px] leading-none text-on-surface-variant">
              {cell.sub}
            </p>
          </div>
        </div>
      );
    default: {
      return (
        <div
          data-testid="day-cell"
          className={cn(
            base,
            "cursor-pointer bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:bg-surface-container-low",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-headline-sm text-[17px] font-bold text-on-surface">{cell.day}</span>
            {cell.corner === "weekend" ? (
              <span className="rounded bg-surface-container-high px-1 py-0.2 font-label-sm text-[9px] font-semibold text-primary">
                Weekend
              </span>
            ) : (
              <span aria-hidden="true" className="material-symbols-outlined text-[15px] text-tertiary">
                {cell.corner ? CORNER_ICONS[cell.corner] : ""}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="self-start rounded bg-surface-container px-1.5 py-0.5 font-label-sm text-[11px] font-semibold text-primary">
              {cell.title}
            </span>
            <span className="mt-0.5 font-label-sm text-[10px] text-outline">{cell.sub}</span>
          </div>
        </div>
      );
    }
  }
}

export function AvailabilityCalendar({ unitId }: { unitId?: string }) {
  const initial = CALENDAR_UNITS.some((unit) => unit.id === unitId)
    ? unitId
    : CALENDAR_UNITS[0].id;
  const [activeUnit, setActiveUnit] = useState<string>(initial ?? CALENDAR_UNITS[0].id);
  const [weekView, setWeekView] = useState(false);

  return (
    <div className="flex flex-col pb-16">
      <header className="flex flex-col justify-between gap-gutter pb-gutter pt-base xl:flex-row xl:items-end">
        <div className="flex max-w-2xl flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2.5 py-0.5 font-label-sm text-label-sm uppercase tracking-wider text-primary">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {CALENDAR_REF.badge}
            </span>
            <span className="font-label-sm text-label-sm text-outline">{CALENDAR_REF.ref}</span>
          </div>
          <h1 className="font-display-lg text-[32px] leading-tight tracking-tight font-bold text-on-surface md:text-[38px]">
            {CALENDAR_REF.title}
          </h1>
          <p className="mt-2 font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {CALENDAR_REF.description}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start xl:self-end">
          <button
            type="button"
            className="group flex items-center gap-2 rounded-lg bg-surface-container-lowest px-4 py-2.5 font-label-md text-label-md text-on-surface shadow-sm transition-all hover:bg-surface-container-low hover:shadow"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[19px] text-primary transition-transform duration-500 group-hover:rotate-180">
              sync
            </span>
            Sync External iCal / Airbnb
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md transition-all hover:bg-primary hover:shadow-lg"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              add
            </span>
            Block Custom Dates
          </button>
        </div>
      </header>

      <section className="mb-gutter flex flex-col gap-4 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-container shadow-sm">
              <img
                src="/images/listings/properties-01.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 right-1 rounded bg-surface-container-lowest/90 px-1 text-[9px] font-bold text-primary backdrop-blur">
                VR 3D
              </span>
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate font-headline-sm text-headline-sm font-semibold text-on-surface">
                  {CALENDAR_REF.unitTitle}
                </span>
                <span className="rounded-md bg-surface-container px-2 py-0.5 font-label-sm text-label-sm font-mono text-primary">
                  #AN-CI-882
                </span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm font-semibold text-tertiary">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                    verified
                  </span>
                  Verified Titre Foncier
                </span>
              </div>
              <span className="truncate font-label-md text-label-md text-on-surface-variant">
                5-Room Luxury Villa • Cocody Ambassades, Abidjan • Escrow #ESC-8921-CI
              </span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 overflow-x-auto rounded-lg bg-surface-container-low p-1">
            {CALENDAR_UNITS.map((unit) => (
              <button
                key={unit.id}
                type="button"
                aria-pressed={activeUnit === unit.id}
                onClick={() => setActiveUnit(unit.id)}
                className={cn(
                  "whitespace-nowrap rounded-md px-3 py-1.5 font-label-md text-label-md transition-all",
                  activeUnit === unit.id
                    ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                {unit.label}
              </button>
            ))}
          </div>
        </div>

        <div className="-mx-4 -mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-b-xl bg-surface-container-low/60 px-4 py-2.5 pt-3">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Status Indicators:
          </span>
          {CALENDAR_LEGEND.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span aria-hidden="true" className={`inline-block h-3.5 w-3.5 rounded ${item.dot}`} />
              <span className="font-label-sm text-label-sm font-medium text-on-surface">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 items-start gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-base lg:col-span-12 xl:col-span-8">
          <div className="flex flex-col rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
            <div className="flex flex-col justify-between gap-base pb-gutter sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <button
                    type="button"
                    aria-label="Previous month"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                      chevron_left
                    </span>
                  </button>
                  <h2 className="px-2 font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
                    {CALENDAR_MONTH.label}
                  </h2>
                  <button
                    type="button"
                    aria-label="Next month"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low"
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
                      chevron_right
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  className="rounded-md bg-surface-container-low px-3 py-1 font-label-sm text-label-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
                >
                  Today
                </button>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="hidden items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1 font-label-sm text-label-sm text-on-surface-variant sm:flex">
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">
                    lock
                  </span>
                  BCEAO Fiduciary Vault Active
                </div>
                <div className="flex items-center rounded-lg bg-surface-container-low p-1">
                  <button
                    type="button"
                    aria-pressed={!weekView}
                    onClick={() => setWeekView(false)}
                    className={cn(
                      "rounded px-3 py-1 font-label-sm text-label-sm transition-all",
                      !weekView
                        ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                        : "font-medium text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    aria-pressed={weekView}
                    onClick={() => setWeekView(true)}
                    className={cn(
                      "rounded px-3 py-1 font-label-sm text-label-sm transition-all",
                      weekView
                        ? "bg-surface-container-lowest font-semibold text-primary shadow-sm"
                        : "font-medium text-on-surface-variant hover:text-on-surface",
                    )}
                  >
                    Week
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 pb-2 text-center">
              {WEEK_DAYS.map((day, index) => (
                <div
                  key={day}
                  className={cn(
                    "py-1 font-label-md text-label-md font-semibold uppercase tracking-wider",
                    index >= 5 ? "text-primary" : "text-outline",
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {MAY_2025.map((cell) => (
                <DayCell key={`${cell.monthLabel ?? "d"}-${cell.day}`} cell={cell} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-base md:grid-cols-3">
            {CALENDAR_SUMMARY.map((summary) => (
              <div
                key={summary.label}
                className="flex items-center gap-3.5 rounded-xl bg-surface-container-lowest p-4 shadow-sm"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${summary.iconBox}`}>
                  <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                    {summary.icon}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                    {summary.label}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {summary.value}
                    </span>
                    {summary.unit ? (
                      <span className="font-label-sm text-[11px] text-on-surface-variant">
                        {summary.unit}
                      </span>
                    ) : (
                      <span className={`font-label-sm text-label-sm font-semibold ${summary.noteTone}`}>
                        {summary.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-base lg:col-span-12 xl:col-span-4">
          <div className="flex-col rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
            {CALENDAR_RATES.map((rates) => (
              <div key={rates.label}>
                <div className="flex items-center justify-between border-b border-surface-container-high/60 pb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${rates.iconBox}`}>
                        <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                          {rates.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                          {rates.label}
                        </h3>
                        <p className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant">
                          {rates.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-col gap-4">
                  {CALENDAR_SETTINGS.map((setting) => (
                    <div key={setting.field} className="flex flex-col gap-1.5">
                      <label className="font-label-md text-label-md font-medium text-on-surface">
                        {setting.field}
                      </label>
                      <input
                        readOnly
                        value={setting.value}
                        aria-label={setting.field}
                        className="w-full rounded-lg bg-surface-container-low px-3 py-2.5 font-label-md text-label-md text-on-surface focus:outline-none"
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="rounded-lg bg-primary px-4 py-2.5 font-label-md text-label-md font-semibold text-on-primary transition-colors hover:bg-primary-container"
                  >
                    Save Rate Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}