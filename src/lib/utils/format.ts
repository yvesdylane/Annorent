import { defaultLocale, localeTags, type Locale } from "@/lib/i18n";

/**
 * Display formatters for the owner's surfaces.
 *
 * Owns: turning stored numbers and ISO strings into locale-aware display text —
 * West/Central African CFA franc amounts, plain counts, calendar dates, and
 * relative times.
 * Does not own: any network call, any currency conversion, or rate logic. These
 * are pure display helpers; the money *arithmetic* lives with the domain that
 * owns it (see `context/code-standards.md` — no business logic in the render
 * layer), and the raw integer amounts stay the single source of truth.
 *
 * `now` is a parameter on the relative formatter rather than read from the clock
 * so that callers and tests are deterministic.
 */

function tag(locale: Locale): string {
  return localeTags[locale] ?? localeTags[defaultLocale];
}

export function formatCfa(value: number, locale: Locale): string {
  return new Intl.NumberFormat(tag(locale), {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(tag(locale)).format(value);
}

export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(tag(locale), {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

export function formatRelativeTime(iso: string, locale: Locale, now: Date): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return iso;

  const deltaMs = then.getTime() - now.getTime();
  const formatter = new Intl.RelativeTimeFormat(tag(locale), { numeric: "auto" });

  for (const [unit, msPerUnit] of RELATIVE_UNITS) {
    if (Math.abs(deltaMs) >= msPerUnit) {
      return formatter.format(Math.round(deltaMs / msPerUnit), unit);
    }
  }

  return formatter.format(Math.round(deltaMs / 1000), "second");
}