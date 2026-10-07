/**
 * Static owner listings content — `/[locale]/owner/properties`.
 *
 * Owns: the mock property-portfolio records the Listings Management page renders
 * before the Core API exists, rebuilt against the owner-portal reference screen.
 * Same seam and absence of real ownership checks as `src/lib/owner/dashboard.ts`.
 */

export type ListingsHeroStat = {
  label: string;
  value: string;
  unit?: string;
  note: string;
  tone: "default" | "tertiary" | "primary";
  noteIcon?: string;
};

export const LISTINGS_HERO_STATS: readonly ListingsHeroStat[] = [
  {
    label: "Total Portfolio Value",
    value: "10,350,000",
    unit: "/mo",
    note: "+8.4% vs last quarter",
    tone: "default",
    noteIcon: "trending_up",
  },
  {
    label: "Escrow Securitization",
    value: "94.2%",
    note: "BCEAO Trust-Guaranteed",
    tone: "tertiary",
    noteIcon: "verified_user",
  },
  {
    label: "Occupancy Index",
    value: "83.3%",
    unit: "(15/18)",
    note: "2 Leases in Finalization",
    tone: "default",
  },
  {
    label: "Notarial Audit Status",
    value: "14 Cleared / 3 In-Review",
    note: "Cadastre Sync: Live",
    tone: "primary",
    noteIcon: "history_edu",
  },
];

export const LISTING_TYPE_FILTERS = [
  "All Types (Villas, Apartments, Flex)",
  "Villas",
  "Apartments & Penthouses",
  "Commercial & Offices",
] as const;

export const LISTING_CITY_FILTERS = [
  "All Cities (Abidjan, Dakar, Douala)",
  "Abidjan (11)",
  "Dakar (4)",
  "Douala (2)",
  "Kigali (1)",
] as const;

export const LISTING_SORT_FILTERS = [
  "Sort: Highest Revenue",
  "Recently Updated",
  "Occupancy Priority",
  "Cadastre Verification",
] as const;

export type ListingStatusTab = {
  id: "all" | "verified" | "pending" | "locked";
  label: string;
  count: number;
  dot?: string;
  countClass?: string;
};

export const LISTING_STATUS_TABS: readonly ListingStatusTab[] = [
  { id: "all", label: "All", count: 18, countClass: "bg-on-primary/20" },
  { id: "verified", label: "Verified", count: 14, dot: "bg-tertiary", countClass: "bg-tertiary/15 text-tertiary" },
  { id: "pending", label: "Pending Review", count: 3, dot: "bg-[#D97706]", countClass: "bg-[#FEF3C7] text-[#92400E]" },
  { id: "locked", label: "Locked / Maintenance", count: 1, dot: "bg-secondary", countClass: "bg-secondary-container text-on-secondary-container" },
];

export type OwnerListing = {
  id: string;
  code: string;
  title: string;
  status: "verified" | "pending" | "locked";
  statusBadge: string;
  statusBadgeStyle: string;
  location: string;
  specs: string[];
  /** e.g. the rented strip or the audit note under the title block. */
  note: {
    icon?: string;
    head: string;
    body: string;
    cta?: string;
    style: "rented" | "amber" | "maintenance";
  };
  priceCfa: number;
  priceNote: string;
  target?: string;
  displayError?: string;
  primaryAction: "view" | "view-draft" | "unlock";
  hasOpenAction?: boolean;
  coverLabel?: string;
  coverOverlay?: boolean;
  vr?: boolean;
  image: string;
  imageAlt: string;
};

export const OWNER_LISTINGS: readonly OwnerListing[] = [
  {
    id: "ci-882",
    code: "#AN-CI-882",
    title: "Villa Contemporaine Les Palmes",
    status: "verified",
    statusBadge: "Verified & Cadastre Notarized",
    statusBadgeStyle: "bg-tertiary/10 text-tertiary",
    location: "Cocody Ambassades, Abidjan",
    specs: ["5 Beds", "6 Baths", "620 m²", "Furnished Long-Term Lease"],
    note: {
      head: "Occupied:",
      body: "Amara Diallo (Institutional Expat Contract)",
      style: "rented",
    },
    priceCfa: 2800000,
    priceNote: "Escrow Secured Fiduciary",
    target: "Yield: 9.8% p.a. net",
    primaryAction: "view",
    hasOpenAction: true,
    vr: true,
    image: "/images/listings/properties-01.jpg",
    imageAlt: "Contemporary villa in Cocody Ambassades with a walled garden",
  },
  {
    id: "sn-410",
    code: "#AN-SN-410",
    title: "Penthouse Vue Mer Panoramique",
    status: "pending",
    statusBadge: "Pending Notary Review",
    statusBadgeStyle: "bg-[#FEF3C7] text-[#92400E]",
    location: "Les Almadies, Dakar",
    specs: ["4 Beds", "4 Baths", "380 m²", "Executive Penthouse"],
    note: {
      icon: "hourglass_top",
      head: "Audit Note:",
      body: "Title deed validation by Chamber of Notaries Dakar in progress (ETA ~24h).",
      cta: "Submit Supplemental Docs",
      style: "amber",
    },
    priceCfa: 2400000,
    priceNote: "Vacant — 6 Inquiries Pending",
    target: "Target: 2,600,000 FCFA",
    primaryAction: "view-draft",
    hasOpenAction: true,
    vr: true,
    image: "/images/listings/rentals-01.jpg",
    imageAlt: "Penthouse overlooking the sea in Les Almadies, Dakar",
  },
  {
    id: "cm-102",
    code: "#AN-CM-102",
    title: "Résidence Architecturale Bonapriso",
    status: "verified",
    statusBadge: "Verified",
    statusBadgeStyle: "bg-tertiary/10 text-tertiary",
    location: "Bonapriso, Douala",
    specs: ["4 Beds", "3 Baths", "450 m²", "Serviced Residence"],
    note: {
      head: "Occupied:",
      body: "Société Générale Capital Lease",
      style: "rented",
    },
    priceCfa: 1950000,
    priceNote: "Deposit in Escrow Vault",
    target: "3-Year Long Lease",
    primaryAction: "view",
    hasOpenAction: true,
    image: "/images/listings/properties-02.jpg",
    imageAlt: "Architectural residence in Bonapriso, Douala",
  },
  {
    id: "ci-904",
    code: "#AN-CI-904",
    title: "Le Loft d'Artiste Biétry",
    status: "locked",
    statusBadge: "Locked / Offline",
    statusBadgeStyle: "bg-secondary-container text-on-secondary-container",
    location: "Marcory Biétry, Abidjan",
    specs: ["2 Beds", "2 Baths", "165 m²", "Flexible Short/Mid-Term"],
    note: {
      icon: "handyman",
      head: "Scheduled annual generator overhaul & HVAC maintenance until May 20, 2025.",
      body: "System block applied",
      style: "maintenance",
    },
    priceCfa: 1950000,
    priceNote: "Rate: 85,000 FCFA / day",
    displayError: "Direct bookings paused",
    primaryAction: "unlock",
    coverLabel: "Maintenance",
    coverOverlay: true,
    image: "/images/listings/rentals-02.jpg",
    imageAlt: "Artist loft in Marcory Biétry, Abidjan",
  },
  {
    id: "ci-331",
    code: "#AN-CI-331",
    title: "Plateau Corporate Hub — Suite C",
    status: "verified",
    statusBadge: "Verified Institutional",
    statusBadgeStyle: "bg-tertiary/10 text-tertiary",
    location: "Le Plateau, Abidjan",
    specs: ["14 Desks", "2 Meeting Rooms", "240 m²"],
    note: {
      head: "Occupied:",
      body: "Ecobank Group — Flex Corporate Agreement",
      style: "rented",
    },
    priceCfa: 3200000,
    priceNote: "Escrow Autopay: Active",
    target: "Multi-tenant flex lease",
    primaryAction: "view",
    vr: true,
    image: "/images/listings/properties-03.jpg",
    imageAlt: "Corporate coworking suite on Le Plateau, Abidjan",
  },
];

export const LISTING_ACTIONS = {
  edit: "Edit",
  view: "View",
  viewDraft: "View Draft",
  unlock: "Unlock",
  applyBulk: "Apply",
  exportCsv: "Export CSV",
} as const;