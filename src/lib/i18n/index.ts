/**
 * Locale registry and message lookup.
 *
 * Owns: the supported-locale list, per-locale direction, and the typed
 * `t()` lookup used by server and client components.
 * Does not own: translation authoring (that lives in `messages/*.ts`).
 *
 * This is the one permitted barrel-style module in the project — see
 * `context/file-structure.md` rule 16, which exempts `lib/i18n/index.ts`
 * because it is a real module rather than a re-export shim.
 */

import { auth, type AuthKey } from "./messages/auth";
import { common, type CommonKey } from "./messages/common";
import { marketing, type MarketingKey } from "./messages/marketing";
import { owner, type OwnerKey } from "./messages/owner";

export const locales = ["en", "fr", "pt", "ar", "sw"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Locales that require a right-to-left layout (ui-context.md, F11). */
export const rtlLocales: readonly Locale[] = ["ar"];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** BCP 47 tags for `<html lang>` and `Intl` formatting. */
export const localeTags: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  pt: "pt",
  ar: "ar",
  sw: "sw",
};

/** Endonyms — a language switcher reads in its own language. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  pt: "Português",
  ar: "العربية",
  sw: "Kiswahili",
};

type MessageTable = Record<string, string>;

/** A namespace may ship fewer locales than the app supports; `t()` falls back. */
type PartialLocaleMessages = { [K in Locale]?: MessageTable };

const messages = {
  auth: auth as unknown as PartialLocaleMessages,
  marketing: marketing as unknown as PartialLocaleMessages,
  owner: owner as unknown as PartialLocaleMessages,
  common: common as unknown as PartialLocaleMessages,
} satisfies Record<string, PartialLocaleMessages>;

export type Namespace = keyof typeof messages;

/**
 * Look up a message. Falls back to English, then to the key itself, so a
 * missing translation is visible in the UI rather than rendering as `undefined`.
 */
export function t(locale: Locale, namespace: Namespace, key: string): string {
  const tables = messages[namespace];
  return (
    tables[locale]?.[key] ?? tables[defaultLocale]?.[key] ?? key
  );
}

export type { AuthKey, CommonKey, MarketingKey, OwnerKey };
