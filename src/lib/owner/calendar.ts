/**
 * Static availability-calendar content — `/[locale]/owner/rentals`.
 *
 * Owns: the mock May 2025 month grid and the supporting records the calendar
 * page renders before the Core API exists, rebuilt against the owner-portal
 * reference screen. Same seam and absence of real ownership checks as
 * `src/lib/owner/dashboard.ts`.
 */

export const CALENDAR_REF = {
  ref: "Ref: CI-ABJ-MGT",
  badge: "Escrow Active Portfolio",
  title: "Unit Availability & Seasonal Rates Calendar",
  description:
    "Manage reservation schedules, block maintenance intervals, set flexible daily/monthly rates, and sync escrow deposits across your rental units.",
  unitTitle: "Villa Contemporaine Les Palmes",
} as const;

export const CALENDAR_UNITS = [
  { id: "main-villa", label: "Main Villa (5R)" },
  { id: "pavilion-b", label: "Pavilion Suite B" },
  { id: "plateau-4b", label: "Penthouse Plateau (#4B)" },
] as const;

export const CALENDAR_LEGEND = [
  { dot: "bg-primary-container", label: "Booked (Confirmed Escrow)" },
  { dot: "bg-secondary-container", label: "Blocked (Maintenance / Owner)" },
  { dot: "bg-surface-container-lowest shadow-sm", label: "Available (Instant Book)" },
  { dot: "bg-primary-fixed", label: "Pending Inquiry (Under Notary Review)" },
] as const;

export const CALENDAR_MONTH = { label: "May 2025" } as const;

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type CalendarDay = {
  day: number;
  monthLabel?: string;
  tone: "prev" | "booked" | "blocked" | "available" | "selected" | "pending";
  /** Small glyph shown in the cell corner. */
  corner?: "bolt" | "build" | "pool" | "task_alt" | "lock" | "logout" | "apartment" | "event_available" | "schedule" | "hourglass_bottom" | "fact_check" | "verified_user" | "check_circle" | "weekend" | "dot";
  title?: string;
  sub?: string;
};

export const MAY_2025: readonly CalendarDay[] = [
  { day: 28, monthLabel: "Apr", tone: "prev" },
  { day: 29, monthLabel: "Apr", tone: "prev" },
  { day: 30, monthLabel: "Apr", tone: "prev" },
  { day: 1, tone: "booked", corner: "verified_user", title: "A. Diallo", sub: "2.8M FCFA" },
  { day: 2, tone: "booked", corner: "lock", title: "Escrow Secured", sub: "Deposit #812" },
  { day: 3, tone: "booked", corner: "dot", title: "Weekend Stay", sub: "Active Tenant" },
  { day: 4, tone: "booked", corner: "logout", title: "Checkout 12:00", sub: "Bailiff Exit Audit" },
  { day: 5, tone: "blocked", corner: "build", title: "AC Servicing", sub: "HVAC Recalibration" },
  { day: 6, tone: "blocked", corner: "pool", title: "Pool Maintenance", sub: "Water Filtration" },
  { day: 7, tone: "blocked", corner: "task_alt", title: "Final Handover", sub: "Ready for Guests" },
  { day: 8, tone: "available", corner: "bolt", title: "95k", sub: "Instant Book" },
  { day: 9, tone: "available", corner: "bolt", title: "95k", sub: "FCFA/night" },
  { day: 10, tone: "available", corner: "weekend", title: "105k", sub: "Weekend Flex" },
  { day: 11, tone: "available", corner: "weekend", title: "105k", sub: "Weekend Flex" },
  { day: 12, tone: "available", corner: "bolt", title: "95k", sub: "Instant Book" },
  { day: 13, tone: "selected", corner: "check_circle", sub: "95,000 FCFA" },
  { day: 14, tone: "selected", corner: "check_circle", sub: "95,000 FCFA" },
  { day: 15, tone: "selected", corner: "check_circle", sub: "95,000 FCFA" },
  { day: 16, tone: "available", corner: "bolt", title: "95k", sub: "Flexible Daily" },
  { day: 17, tone: "available", corner: "bolt", title: "105k", sub: "Available" },
  { day: 18, tone: "booked", corner: "apartment", title: "Ecobank Flex", sub: "Executive Suite" },
  { day: 19, tone: "booked", corner: "dot", title: "Corp Stay", sub: "Confirmed" },
  { day: 20, tone: "booked", corner: "dot", title: "Corp Stay", sub: "Escrow Deposited" },
  { day: 21, tone: "booked", corner: "dot", title: "Corp Stay", sub: "Direct Payout" },
  { day: 22, tone: "booked", corner: "dot", title: "Corp Stay", sub: "Mid-stay Maid" },
  { day: 23, tone: "booked", corner: "dot", title: "Corp Stay", sub: "Ecobank Group" },
  { day: 24, tone: "booked", corner: "event_available", title: "Late Checkout", sub: "18:00 Payout" },
  { day: 25, tone: "pending", corner: "schedule", title: "Inquiry #902", sub: "Dossier Review" },
  { day: 26, tone: "pending", corner: "hourglass_bottom", title: "Pending ID", sub: "Notary Check" },
  { day: 27, tone: "pending", corner: "schedule", title: "Pre-Auth Hold", sub: "380k FCFA" },
  { day: 28, tone: "pending", corner: "fact_check", title: "Accept / Reject", sub: "Expires in 6h" },
  { day: 29, tone: "available", corner: "bolt", title: "95k", sub: "Instant Book" },
  { day: 30, tone: "available", corner: "bolt", title: "95k", sub: "Instant Book" },
  { day: 31, tone: "available", corner: "weekend", title: "105k", sub: "Weekend Flex" },
];

export type CalendarSummary = {
  icon: string;
  iconBox: string;
  label: string;
  value: string;
  /** Present on money tiles; `note`/`noteTone` carry the delta instead. */
  unit?: string;
  note?: string;
  noteTone?: string;
};

export const CALENDAR_SUMMARY: readonly CalendarSummary[] = [
  { icon: "trending_up", iconBox: "bg-primary-container/10 text-primary", label: "Occupancy Rate", value: "77.4%", note: "+6.2% vs Apr", noteTone: "text-tertiary" },
  { icon: "payments", iconBox: "bg-tertiary/10 text-tertiary", label: "Projected Revenue", value: "4,850,000", unit: "FCFA" },
  { icon: "account_balance", iconBox: "bg-surface-container-high text-primary", label: "Escrow Held Today", value: "5,600,000", note: "Protected", noteTone: "text-tertiary" },
];

export const CALENDAR_RATES = [
  { icon: "tune", iconBox: "bg-primary-container/10 text-primary", label: "Pricing & Deposit Settings", description: "Adjust rates for Villa Contemporaine Les Palmes" },
] as const;

export const CALENDAR_SETTINGS = [
  { field: "Standard Monthly Rent", value: "2,800,000 FCFA" },
  { field: "Daily Rate (Instant Book)", value: "95,000 FCFA" },
  { field: "Weekend Uplift", value: "+10% (105,000 FCFA)" },
  { field: "Escrow Deposit Split", value: "50% Owner / 50% Vault" },
] as const;