/**
 * Static owner-dashboard content — `/[locale]/owner`.
 *
 * Owns: the mock records the owner dashboard renders before the Core API exists,
 * rebuilt against the owner-portal reference screen. The shapes mirror what the
 * API will return, so replacing this with a fetch is a change to this file only —
 * the same seam `src/lib/marketing/home.ts` uses for the public site (see
 * file-structure.md §3).
 * Does not own: any real authorization or ownership check. Every record here
 * belongs to one hard-coded owner id; the real per-owner scoping is server-side
 * in the Core API (`context/security.md` §RBAC), never in this file.
 *
 * `labelKey` values must resolve in the `owner` i18n namespace —
 * `owner-messages.test.ts` fails the build otherwise.
 */

export type OwnerStatCard = {
  id: string;
  /** Key into the `owner` i18n namespace. */
  labelKey: string;
  kind: "count" | "money";
  /** Material Symbols ligature name. */
  icon: string;
  /** Burst in the card corner, echoing the icon tone. */
  accent: "primary" | "secondary" | "tertiary";
  /** Badge in the card header (e.g. "+2 this month"). */
  chip: string;
  chipIcon?: string;
  /** The headline number. */
  value: number;
  /** Headline unit suffix, e.g. "Properties", "Inquiries", "FCFA". */
  unit: string;
  /** Secondary line under the headline. */
  caption: string;
};

export const OWNER_STATS: readonly OwnerStatCard[] = [
  {
    id: "active",
    labelKey: "owner.dashboard.stats.activeLabel",
    kind: "count",
    icon: "home_work",
    accent: "primary",
    chip: "+2 this month",
    chipIcon: "trending_up",
    value: 18,
    unit: "Properties",
    caption: "14 Rented • 4 Ready for Move-In",
  },
  {
    id: "pending",
    labelKey: "owner.dashboard.stats.pendingLabel",
    kind: "count",
    icon: "verified",
    accent: "secondary",
    chip: "Est. clearance 48h",
    value: 3,
    unit: "Properties",
    caption: "In Cadastre & Notarial Inspection",
  },
  {
    id: "inquiries",
    labelKey: "owner.dashboard.stats.inquiriesLabel",
    kind: "count",
    icon: "mark_chat_unread",
    accent: "primary",
    chip: "+28% vs last week",
    chipIcon: "arrow_upward",
    value: 42,
    unit: "Inquiries",
    caption: "18 Direct bookings • 24 Physical tours",
  },
  {
    id: "revenue",
    labelKey: "owner.dashboard.stats.revenueLabel",
    kind: "money",
    icon: "account_balance_wallet",
    accent: "tertiary",
    chip: "100% Payout Guaranteed",
    chipIcon: "shield",
    value: 14850000,
    unit: "FCFA",
    caption: "Secured in BCEAO custodial vault",
  },
];

/** Yield chart on the dashboard — the peer months and the peak month label. */
export const YIELD_SERIES: readonly string[] = [
  "Nov 2024",
  "Dec 2024",
  "Jan 2025",
  "Feb 2025",
  "Mar 2025",
  "Apr 2025",
];

export const YIELD_PEAK = {
  month: "April 2025",
  value: "14.85M FCFA",
  detail: "88% Occupancy • Peak",
} as const;

export type OccupancyMetric = {
  icon: string;
  tone: string;
  label: string;
  value: string;
};

export const OCCUPANCY_METRICS: readonly OccupancyMetric[] = [
  { icon: "donut_large", tone: "text-primary", label: "Average Occupancy", value: "91.4%" },
  { icon: "speed", tone: "text-tertiary", label: "Avg. Time to Lease", value: "6.2 days" },
  { icon: "fact_check", tone: "text-primary-container", label: "Inquiry Conversion", value: "34% Verified" },
];

export type RecentInquiry = {
  id: string;
  name: string;
  tier: string;
  tierIcon: string;
  property: string;
  dates: string;
  status: "funded" | "bailiff";
  amount: string;
};

export const RECENT_INQUIRIES: readonly RecentInquiry[] = [
  {
    id: "inq-1",
    name: "Amara Diallo",
    tier: "99% Tier 1",
    tierIcon: "verified",
    property: "Villa Cocody Ambassades",
    dates: "May 1, 2025 - Apr 30, 2026",
    status: "funded",
    amount: "3.5M FCFA Deposited",
  },
  {
    id: "inq-2",
    name: "Dr. Ibrahim Touré",
    tier: "98% Tier 1",
    tierIcon: "verified",
    property: "Plateau Panoramic Penthouse",
    dates: "May 15, 2025 (12 Months)",
    status: "bailiff",
    amount: "Scheduled for Tomorrow",
  },
  {
    id: "inq-3",
    name: "Sarah Diop",
    tier: "96% Tier 1",
    tierIcon: "verified_user",
    property: "Almadies Sunset Ocean Loft",
    dates: "June 1, 2025 (Flexible Expat)",
    status: "funded",
    amount: "2.2M FCFA Deposited",
  },
];

export const LEGAL_COMPLIANCE = {
  badge: "Certified",
  heading: "100% Audited Title Deeds",
  summary:
    "All 18 properties have registered Land Title (Titre Foncier / ACD) verified by licensed notarial partners in Côte d'Ivoire & Senegal.",
  complianceLine: "BCEAO Escrow Regulation Compliant",
  auditLabel: "Next Registry Audit",
  auditDate: "August 15, 2025",
} as const;

export type OccupancyClass = {
  label: string;
  value: string;
  detail: string;
  bar: string;
  percent: number;
};

export const OCCUPANCY_CLASSES: readonly OccupancyClass[] = [
  { label: "Luxury Residential Villas", value: "94% Occupied", detail: "8 of 8 units currently leased", bar: "bg-primary", percent: 94 },
  { label: "Furnished Executive Suites", value: "88% Occupied", detail: "6 of 7 units currently leased", bar: "bg-surface-tint", percent: 88 },
  { label: "Coworking & Flex Hubs", value: "92% Occupied", detail: "120 of 130 corporate desks reserved", bar: "bg-tertiary", percent: 92 },
];

export const QUICK_ACTIONS: readonly { icon: string; label: string }[] = [
  { icon: "tune", label: "Adjust Seasonal Rates" },
  { icon: "event_available", label: "Schedule Bailiff Handover" },
  { icon: "calendar_month", label: "Bulk Update Availability" },
  { icon: "receipt_long", label: "Generate Landlord Tax Statement" },
];

export const MARKET_BENCHMARK = {
  eyebrow: "Market Benchmark",
  title: "Yield in Abidjan Cocody grew by +12.4% YoY.",
  body: "Demand for VR-ready apartments with escrow guarantees remains in highest percentile.",
} as const;