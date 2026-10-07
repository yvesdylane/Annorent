"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import {
  CADASTRAL_DOC,
  PHOTO_TAGS,
  UPLOADED_PHOTOS,
  VIDEO_ASSET,
  WIZARD_REF,
  WIZARD_STEPS,
} from "@/lib/owner/add-property";

/**
 * Add Property wizard — `/[locale]/owner/properties/new`.
 *
 * Owns: the four-step listing wizard — Details & Specs, Photos & 3D Tours,
 * Pricing & Escrow, Legal Review & Submit — rebuilt against the owner-portal
 * reference screen (which captures the flow mid-Step 2). A client component
 * because the stepper is interactive; the fields themselves are uncontrolled
 * chrome until the API and the real form wizards land.
 *
 * Does not own: the shell, the RBAC guard (both the role's `layout.tsx`), or any
 * persistence — there is none yet.
 */

function SpecsForm() {
  const fields = [
    { label: "Property Title", placeholder: "e.g. Villa Contemporaine Les Palmes" },
    { label: "District / City", placeholder: "Cocody Ambassades, Abidjan" },
    { label: "Bedrooms", placeholder: "5" },
    { label: "Bathrooms", placeholder: "6" },
    { label: "Living Area (m²)", placeholder: "620" },
    { label: "Monthly Rent (FCFA)", placeholder: "2,800,000" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-semibold text-on-surface">
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-on-surface shadow-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="font-label-md text-label-md font-semibold text-on-surface">
            Transaction Type
          </label>
          <div className="flex flex-wrap gap-2">
            {["Long-Term Lease", "Flexible Short/Mid-Term", "For Sale"].map((option) => (
              <button
                key={option}
                type="button"
                className={cn(
                  "rounded-lg px-3.5 py-1.5 font-label-md text-label-md transition-colors",
                  option === "Long-Term Lease"
                    ? "bg-primary-container text-on-primary font-semibold shadow-sm"
                    : "bg-surface-container-lowest text-on-surface-variant shadow-sm hover:bg-surface-container",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl bg-surface-container-low/50 p-4">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          Filling the title and city is enough to save a draft. Notarial
          verification is requested at Step 4.
        </p>
      </div>
    </div>
  );
}

function MediaStep() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between gap-gutter rounded-xl bg-surface-container-low/30 p-6 lg:flex-row lg:items-center">
        <div className="flex max-w-3xl flex-col">
          <div className="mb-1.5 flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-primary">
              perm_media
            </span>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Photos, Floor Plans & Immersive 3D Tours
            </h2>
          </div>
          <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
            Properties featuring verified 3D virtual tours and certified photography receive{" "}
            <strong className="font-semibold text-on-surface">3.8x more tenant inquiries</strong>{" "}
            and qualify for express notarial clearance in Côte d&apos;Ivoire & Senegal.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-lg bg-tertiary-container/10 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-tertiary">
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-on-tertiary">
              verified_user
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm font-bold text-tertiary">
              BCEAO Digital Watermark
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Tamper-proof ownership chain
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
              1
            </span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              High-Resolution Photos
            </h3>
            <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-on-surface-variant">
              Minimum 8 photos required
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-label-sm text-label-sm text-outline">
              4 of 12 uploaded • 24.5 MB
            </span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full w-1/3 rounded-full bg-primary-container" />
            </div>
          </div>
        </div>

        <div className="group relative flex flex-col items-center justify-center rounded-xl bg-surface-container-low px-6 py-10 transition-all hover:bg-surface-container">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary-fixed/60 transition-transform group-hover:scale-105">
            <span aria-hidden="true" className="material-symbols-outlined text-[32px] text-primary">
              cloud_upload
            </span>
          </div>
          <p className="text-center font-headline-sm text-headline-sm font-medium text-on-surface">
            Drag and drop your JPEG/PNG photos here, or{" "}
            <span className="decoration-2 text-primary underline underline-offset-4">
              browse files
            </span>
          </p>
          <p className="mt-1 text-center font-label-sm text-label-sm text-outline">
            Supports RAW, JPEG, WebP up to 25MB per asset • Automatic orientation and lens
            correction applied
          </p>
        </div>

        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {UPLOADED_PHOTOS.map((photo) => (
            <div
              key={photo.name}
              className="flex flex-col overflow-hidden rounded-xl bg-surface-container shadow-sm group"
            >
              <div className="relative h-48 w-full bg-gradient-to-t from-black/70 via-black/20 to-black/20">
                <span aria-hidden="true" className="material-symbols-outlined absolute inset-0 m-auto flex items-center justify-center text-[40px] text-on-primary/70">
                  image
                </span>
                {photo.cover ? (
                  <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-primary shadow-sm">
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                      star
                    </span>
                    Cover Photo
                  </span>
                ) : null}
                <span className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between truncate font-label-md text-label-md font-semibold text-on-primary drop-shadow">
                  {photo.caption}
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-on-primary/80">
                    drag_indicator
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between bg-surface-container-lowest p-3">
                <span className="font-label-sm text-label-sm font-mono text-outline">
                  {photo.name} • {photo.size}
                </span>
                {photo.verified ? (
                  <span className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-tertiary">
                    <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                      verified
                    </span>
                    4K Ready
                  </span>
                ) : (
                  <button
                    type="button"
                    className="font-label-sm text-label-sm font-semibold text-primary hover:underline"
                  >
                    Make Cover
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low/40 p-gutter">
        <div className="flex items-center justify-between">
          <label className="font-label-md text-label-md font-semibold text-on-surface">
            Photo Categorization & Smart Room Tagging
          </label>
          <span className="font-label-sm text-label-sm text-outline">
            Click tags to filter upload view or apply tags to active asset
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PHOTO_TAGS.map((tag) => (
            <button
              key={tag.label}
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3.5 py-1.5 font-label-md text-label-md transition-colors",
                tag.active
                  ? "bg-primary-container font-semibold text-on-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-high",
              )}
            >
              {tag.icon ? (
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {tag.icon}
                </span>
              ) : null}
              {tag.label}
            </button>
          ))}
          <button
            type="button"
            className="flex items-center gap-1 rounded-lg bg-surface-container-low px-3 py-1.5 font-label-md text-label-md font-semibold text-primary transition-colors hover:bg-surface-container-high"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              add
            </span>
            Custom Tag
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-xl bg-surface-container-low/20 p-gutter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
                2
              </span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Video Walkthrough & Drone
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-outline">Up to 4K • MP4, MOV</span>
          </div>
          <div className="group flex items-center gap-4 rounded-xl bg-surface-container-lowest p-3 shadow-sm">
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-surface-container">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span aria-hidden="true" className="material-symbols-outlined text-[28px] text-on-primary">
                  play_circle
                </span>
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 font-label-sm text-[10px] font-mono text-on-primary">
                {VIDEO_ASSET.duration}
              </span>
            </div>
            <div className="min-w-0 flex-1 flex-col">
              <span className="block truncate font-label-md text-label-md font-bold text-on-surface">
                {VIDEO_ASSET.name}
              </span>
              <span className="mt-0.5 block font-label-sm text-label-sm font-mono text-outline">
                {VIDEO_ASSET.meta}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 rounded bg-tertiary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-tertiary-fixed">
                <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                  check_circle
                </span>
                {VIDEO_ASSET.badge}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-6 text-center transition-colors hover:bg-surface-container-low">
            <span aria-hidden="true" className="material-symbols-outlined mb-1 text-[28px] text-primary">
              video_call
            </span>
            <span className="font-label-md text-label-md font-semibold text-on-surface">
              Upload Interior Walkthrough or Horizon Drone Video
            </span>
            <span className="mt-0.5 font-label-sm text-label-sm text-outline">
              Max file size 500MB • Auto-transcoded to CDN streaming
            </span>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 overflow-hidden rounded-xl bg-surface-container-low/20 p-gutter">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
                3
              </span>
              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Matterport 3D Tour / 360° Scan
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1 font-label-sm text-label-sm font-semibold text-on-primary shadow-sm">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                view_in_ar
              </span>
              Annorent VR Certified
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between font-label-md text-label-md font-semibold text-on-surface">
              <span>Matterport or Metareal Public Share URL</span>
              <span className="cursor-pointer font-label-sm text-label-sm text-primary hover:underline">
                How to obtain URL?
              </span>
            </label>
            <div className="relative flex items-center">
              <span aria-hidden="true" className="material-symbols-outlined absolute left-3 text-[20px] text-outline">
                link
              </span>
              <input
                type="url"
                placeholder="https://my.matterport.com/show/..."
                aria-label="Matterport share URL"
                className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-24 font-mono text-label-md text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                className="absolute right-1.5 rounded bg-surface-container-high px-3 py-1.5 font-label-sm text-label-sm font-semibold text-primary transition-colors hover:bg-surface-container-highest"
              >
                Verify Link
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                view_in_ar
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Request Annorent 3D Scanning Crew
              </span>
              <p className="mt-0.5 font-label-sm text-label-sm text-on-surface-variant">
                Complimentary on-site Matterport Pro3 laser scanning for verified
                institutional listings in Abidjan & Dakar.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-primary px-3 py-1.5 font-label-sm text-label-sm font-semibold text-on-primary transition-opacity hover:opacity-90"
                >
                  Schedule Field Crew
                </button>
                <span className="font-label-sm text-label-sm text-outline">
                  Next available: Tomorrow, 10:00 AM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
              4
            </span>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              Cadastral & Floor Plan Documents
            </h3>
          </div>
          <span className="flex items-center gap-1 font-label-sm text-label-sm font-semibold text-tertiary">
            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
              verified
            </span>
            Notarial Registry Connected
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl bg-surface-container-low/40 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error-container text-error">
                <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                  picture_as_pdf
                </span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-label-md text-label-md font-bold text-on-surface">
                  {CADASTRAL_DOC.name}
                </span>
                <span className="font-label-sm text-label-sm font-mono text-outline">
                  {CADASTRAL_DOC.meta}
                </span>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded-md bg-tertiary-fixed px-2.5 py-1 font-label-sm text-label-sm font-semibold text-tertiary">
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                check
              </span>
              Validated
            </span>
          </div>
          <div className="flex cursor-pointer items-center justify-between rounded-xl bg-surface-container-lowest p-4 shadow-sm transition-colors hover:bg-surface-container-low">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                  upload_file
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Upload 2D Architect Blueprint
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  DWG, PDF, or high-res vector
                </span>
              </div>
            </div>
            <span className="font-label-sm text-label-sm font-semibold text-primary">Browse</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingStep() {
  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
            1
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Escrow-Backed Pricing
          </h3>
        </div>
        {[
          { label: "Monthly Rent (FCFA)", value: "2,800,000" },
          { label: "Daily Rate (Instant Book)", value: "95,000" },
          { label: "Security Deposit (FCFA)", value: "1,400,000" },
          { label: "Weekend Uplift (%)", value: "10" },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md font-medium text-on-surface">
              {field.label}
            </label>
            <input
              type="text"
              defaultValue={field.value}
              className="w-full rounded-lg bg-surface-container-lowest px-3.5 py-2.5 font-label-md text-label-md text-on-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
            2
          </span>
          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Escrow & Payout Structure
          </h3>
        </div>
        <div className="flex flex-col gap-3 rounded-xl bg-surface-container-low/50 p-5">
          {[
            ["Escrow Deposit Split", "50% Owner / 50% Vault"],
            ["Payout Schedule", "Monthly on the 1st (BCEAO bank transfer)"],
            ["Landlord Tax Withholding", "OHADA-compliant, auto-withheld"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between border-b border-surface-container-high/50 pb-3 font-label-md text-label-md last:border-0 last:pb-0"
            >
              <span className="text-on-surface-variant">{label}</span>
              <span className="font-semibold text-on-surface">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-primary-fixed/10 p-4">
          <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-primary">
            lock
          </span>
          <p className="font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
            Deposits are held in a BCEAO custodial vault until handover. A notarial
            attestation is issued on acceptance — both parties are covered under OHADA.
          </p>
        </div>
      </div>
    </div>
  );
}

function LegalStep() {
  const items = [
    { icon: "description", label: "Titre Foncier registered and certified", state: "Validated" },
    { icon: "gavel", label: "Notarial review & attestation issued", state: "Validated" },
    { icon: "verified_user", label: "BCEAO digital watermark applied to media", state: "Validated" },
    { icon: "shield", label: "Property insurance certificate uploaded", state: "Pending" },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-fixed font-label-sm text-label-sm font-bold text-primary">
          4
        </span>
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          Notarial & Cadastre Review
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl bg-surface-container-low/50 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-lowest text-primary shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
              </div>
              <span className="font-label-md text-label-md font-semibold text-on-surface">
                {item.label}
              </span>
            </div>
            <span
              className={cn(
                "rounded-md px-2.5 py-1 font-label-sm text-label-sm font-semibold",
                item.state === "Validated"
                  ? "bg-tertiary-fixed text-tertiary"
                  : "bg-[#FEF3C7] text-[#92400E]",
              )}
            >
              {item.state}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-label-md text-label-md font-bold text-on-primary shadow-md transition-all hover:opacity-95"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
          verified_user
        </span>
        Submit for Notarial Verification
      </button>
    </div>
  );
}

export function AddPropertyWizard({ initialStep = 0 }: { initialStep?: number }) {
  const safeStep = Math.min(Math.max(initialStep, 0), WIZARD_STEPS.length - 1);
  const [step, setStep] = useState(safeStep);

  return (
    <div className="flex flex-col pb-16">
      <div className="flex flex-col justify-between gap-gutter pt-base pb-gutter md:flex-row md:items-center">
        <div className="flex max-w-2xl flex-col">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              {WIZARD_REF.eyebrow}
            </span>
            <span className="font-label-sm text-label-sm text-outline-variant">•</span>
            <span className="font-label-sm text-label-sm font-semibold text-primary">
              {WIZARD_REF.ref}
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">
            {WIZARD_REF.title}
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {WIZARD_REF.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="px-base py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Cancel & Exit
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-surface-container-lowest px-5 py-2.5 font-label-md text-label-md font-semibold text-primary shadow-sm transition-all hover:bg-surface-container-high"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              save
            </span>
            Save Draft
          </button>
        </div>
      </div>

      <div className="mb-gutter w-full rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
        <div className="relative grid grid-cols-1 gap-base md:grid-cols-4">
          {WIZARD_STEPS.map((wizardStep, index) => {
            const state =
              index < step ? "complete" : index === step ? "active" : "upcoming";
            return (
              <button
                key={wizardStep.id}
                type="button"
                data-testid={`wizard-step-${wizardStep.number}`}
                onClick={() => setStep(index)}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-base text-left transition-colors",
                  state === "active" && "bg-primary-fixed/40",
                  state === "complete" && "bg-surface-container-low/60",
                  state === "upcoming" && "bg-surface-container-low/40",
                )}
              >
                {state === "complete" ? (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tertiary-fixed font-label-sm text-label-sm font-bold text-tertiary">
                    <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                      check
                    </span>
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-label-sm text-label-sm",
                      state === "active"
                        ? "bg-primary-container font-bold text-on-primary shadow-sm"
                        : "bg-surface-container-high font-semibold text-secondary",
                    )}
                  >
                    {wizardStep.number}
                  </span>
                )}
                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "font-label-sm text-label-sm font-bold uppercase tracking-wider",
                      state === "complete" && "text-tertiary",
                      state === "active" && "text-primary",
                      state === "upcoming" && "font-semibold text-secondary",
                    )}
                  >
                    Step {wizardStep.number} •{" "}
                    {state === "complete" ? "Completed" : state === "active" ? "In Progress" : "Pending"}
                  </span>
                  <span
                    className={cn(
                      "truncate font-label-md text-label-md",
                      state === "active"
                        ? "font-bold text-on-surface"
                        : state === "complete"
                          ? "font-semibold text-on-surface"
                          : "font-medium text-secondary",
                    )}
                  >
                    {wizardStep.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-8 rounded-xl bg-surface-container-lowest p-gutter shadow-sm md:p-8">
        {step === 0 ? <SpecsForm /> : null}
        {step === 1 ? <MediaStep /> : null}
        {step === 2 ? <PricingStep /> : null}
        {step === 3 ? <LegalStep /> : null}
      </div>

      <div className="mt-gutter flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface-container-lowest p-gutter shadow-sm">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((current) => Math.max(current - 1, 0))}
            className="flex items-center gap-2 rounded-lg bg-surface-container-low px-6 py-3 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to{step === 0 ? " Start" : step === 1 ? " Details" : " Previous"}
          </button>
          <div className="flex items-center gap-4">
            <span className="hidden font-label-sm text-label-sm text-outline sm:inline-block">
              All changes automatically saved to cloud vault
            </span>
            <button
              type="button"
              onClick={() => setStep((current) => Math.min(current + 1, WIZARD_STEPS.length - 1))}
              className="flex items-center gap-2 rounded-lg bg-primary-container px-8 py-3.5 font-label-md text-label-md font-bold text-on-primary shadow-sm transition-all hover:opacity-95"
            >
              {step === WIZARD_STEPS.length - 1 ? "Submit for Notarial Verification" : "Save & Continue to Next Step"}
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-center text-outline">
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-tertiary">
            lock
          </span>
          <span className="font-label-sm text-label-sm">
            All media is watermarked with certified cadastral metadata and protected
            against unauthorized duplication under BCEAO fiduciary guidelines.
          </span>
        </div>
      </div>
    </div>
  );
}