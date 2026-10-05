/**
 * Labels shared by more than one role's screens.
 *
 * Owns: strings that are genuinely cross-role — the shell chrome and the
 * affordances the tenant, owner, hotel-owner, and admin sections all render.
 * Does not own: page copy. A label used by exactly one role goes in that role's
 * namespace (`owner.ts`, `account.ts`, `hotel.ts`, `admin.ts`) per
 * file-structure.md rule 2.
 *
 * Deliberate omission: `marketing.ts` already carries its own `common.pagination`,
 * `common.of`, `common.previous`, and `common.next` keys for the public browse
 * pages. They are NOT duplicated here — one string gets one home, and a second
 * copy would be free to drift. The browse pages keep calling the `marketing`
 * namespace for those four; when the public surface is next revisited they should
 * move here in one pass, together.
 *
 * English only, for the same reason as `owner.ts`: the owner surface ships
 * single-language and every locale resolves to these strings via `t()`'s
 * per-key English fallback.
 */

export const common = {
  en: {
    "common.appName": "Annorent",
    "common.skipToContent": "Skip to main content",
    "common.primaryNavigation": "Primary",
    "common.mainContent": "Main content",
    "common.loading": "Loading",
    "common.retry": "Try again",
    "common.signOut": "Sign out",
    "common.language": "Language",
  },
} as const;

/** Keys the shared labels can be asked for. */
export type CommonKey = keyof (typeof common)["en"];