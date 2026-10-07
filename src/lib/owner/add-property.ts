/**
 * Static add-property wizard content — `/[locale]/owner/properties/new`.
 *
 * Owns: the mock wizard step definitions, uploaded media records, and asset tags
 * the wizard renders before the Core API exists, rebuilt against the owner-portal
 * reference screen. Same seam and absence of real ownership checks as
 * `src/lib/owner/dashboard.ts`.
 */

export const WIZARD_REF = {
  eyebrow: "Listing Pipeline",
  ref: "Ref: ANR-CI-2024-884",
  title: "List a New Property or Unit",
  description:
    "Complete property specs, upload high-resolution media and virtual tours, configure escrow-backed pricing, and request notarized cadastral verification.",
} as const;

export const WIZARD_STEPS = [
  { id: "specs", number: 1, label: "Details & Specs" },
  { id: "media", number: 2, label: "Photos & 3D Tours" },
  { id: "pricing", number: 3, label: "Pricing & Escrow" },
  { id: "legal", number: 4, label: "Legal Review & Submit" },
] as const;

export type UploadedPhoto = {
  name: string;
  size: string;
  caption: string;
  /** Only one photo carries the cover treatment; optional on the others. */
  cover?: boolean;
  verified?: boolean;
};

export const UPLOADED_PHOTOS: readonly UploadedPhoto[] = [
  { name: "IMG_COC_01.JPG", size: "6.2 MB", caption: "Grand Living Salon", cover: true, verified: true },
  { name: "IMG_COC_02.JPG", size: "5.8 MB", caption: "Master Suite", verified: false },
  { name: "IMG_COC_03.JPG", size: "7.1 MB", caption: "Modern Fitted Kitchen", verified: false },
  { name: "IMG_COC_04.JPG", size: "5.4 MB", caption: "Infinity Pool & Patio", verified: false },
];

export type PhotoTag = {
  label: string;
  active: boolean;
  icon?: string;
};

export const PHOTO_TAGS: readonly PhotoTag[] = [
  { label: "Reception Salon", active: true, icon: "check" },
  { label: "Villa Facade & Gates", active: false },
  { label: "Master & Guest Bedrooms", active: false },
  { label: "Spa Bathrooms", active: false },
  { label: "Security Gate & CCTV", active: false, icon: "shield" },
  { label: "Backup Generator & Inverter Room", active: false, icon: "bolt" },
];

export const VIDEO_ASSET = {
  name: "Villa_Cocody_Drone_Exterior_4K.mp4",
  meta: "142 MB • 3840x2160 @ 60fps",
  badge: "Processed • High Definition",
  duration: "01:48",
} as const;

export const CADASTRAL_DOC = {
  name: "Cadastre_Lot_4102_Cocody_Certifie.pdf",
  meta: "1.8 MB • Ministry of Construction Sealed",
} as const;