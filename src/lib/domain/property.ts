/**
 * Property domain types shared by the owner's surfaces.
 *
 * Owns: the vocabulary of a property as this frontend models it — status,
 * transaction type, and the record shapes the owner dashboard renders.
 * Does not own: DTOs from the Core API. Those are machine-generated into
 * `src/lib/domain/generated/` from the backend's OpenAPI spec via
 * `scripts/generate-api-types.mjs` and are never hand-written here — see
 * `context/code-standards.md` §Shared types and file-structure.md rule 4.
 *
 * These are the hand-written domain objects those generated types map *onto*,
 * which is why the row→domain mapping lives here in one place rather than
 * being scattered across components.
 */

/** Lifecycle of a listing. Keep in sync with the `properties.status` enum. */
export const propertyStatuses = [
  "draft",
  "pending_review",
  "active",
  "locked",
  "sold",
  "rented",
] as const;

export type PropertyStatus = (typeof propertyStatuses)[number];

/** How a property is offered. Mirrors `properties.transaction_type`. */
export const transactionTypes = ["sale", "rent", "flexible_rent"] as const;

export type TransactionType = (typeof transactionTypes)[number];

export type OwnerProperty = {
  id: string;
  title: string;
  transactionType: TransactionType;
  status: PropertyStatus;
  district: string;
  /** Whole CFA francs. XOF has no minor unit, so this is always an integer. */
  priceCfa: number;
  bedrooms: number;
  areaSqm: number;
  isVerified: boolean;
  views30d: number;
  /** ISO 8601, UTC. */
  updatedAtIso: string;
  /** Path under `/public/images/listings/`. */
  image: string;
  /** Required: the listing grid is icon-and-text, never image-only. */
  imageAlt: string;
};

export type OwnerStatKind = "money" | "count";

export type OwnerStat = {
  id: string;
  /** Key into the `owner` i18n namespace. */
  labelKey: string;
  kind: OwnerStatKind;
  /** Material Symbols ligature name. */
  icon: string;
  /** Present when `kind === "money"`. */
  valueCfa?: number;
  /** Present when `kind === "count"`. */
  value?: number;
  /** Set on counts that are ratios, so the card renders "78%". */
  unit?: "percent";
};

export type OwnerActivityKind = "booking" | "payment" | "message" | "verification";

export type OwnerActivity = {
  id: string;
  kind: OwnerActivityKind;
  /** Key into the `owner` i18n namespace. */
  titleKey: string;
  /** ISO 8601, UTC. */
  occurredAtIso: string;
  /** Present for `payment` and `booking` kinds. */
  amountCfa?: number;
};