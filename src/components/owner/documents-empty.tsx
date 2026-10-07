/**
 * Documents & Cadastral Vault — `/[locale]/owner/documents`.
 *
 * Owns: the composition of the vault header and the empty state shown until the
 * first document is uploaded. A server component: there is nothing interactive
 * here yet. The Cadastre sync — `Titre Foncier` certificates, OHADA lease
 * agreements, insurance binders, and BCEAO escrow attestations — goes live with
 * the API; until then the vault is empty by design and says so.
 *
 * Does not own: the shell, the RBAC guard (both the role's `layout.tsx`), or any
 * document fetching.
 */

const VAULT_FEATURES = [
  {
    icon: "verified_user",
    title: "Title Deed Certificates",
    description: "Notarized Titre Foncier / ACD records validated against the live cadastre registry.",
  },
  {
    icon: "gavel",
    title: "OHADA Lease Binders",
    description: "Signed lease agreements, riders, and renewal options against the standard OHADA template.",
  },
  {
    icon: "account_balance",
    title: "Escrow Attestations",
    description: "BCEAO custodial vault receipts issued at deposit, mid-term, and final settlement.",
  },
] as const;

export function DocumentsEmpty() {
  return (
    <div className="flex w-full flex-col pb-16">
      <div className="flex flex-col justify-between gap-gutter pt-base pb-gutter xl:flex-row xl:items-end">
        <div className="flex max-w-3xl flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wide text-on-primary-fixed">
              Institutional Tier Portal
            </span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              Live Cadastre Sync • Abidjan & Dakar
            </span>
          </div>
          <h1 className="font-headline-md mt-1 text-headline-md font-semibold leading-none tracking-tight text-on-surface">
            Documents & Cadastral Vault
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            Certified title deeds, OHADA lease binders, insurance certificates, and escrow
            attestations for your portfolio — watermarked and tamper-proof.
          </p>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-label-md text-label-md text-on-primary shadow-md transition-all hover:bg-primary-container hover:shadow-lg"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
            upload_file
          </span>
          Upload First Document
        </button>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest px-gutter py-20 text-center shadow-sm">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container-low">
          <span aria-hidden="true" className="material-symbols-outlined text-[40px] text-outline">
            folder_open
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">
          No documents in the vault yet
        </h2>
        <p className="mt-2 max-w-xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
          The moment a listing completes notarial verification, its cadastral certificates and
          escrow attestations are archived here automatically. You can also upload a document
          manually to kick off the verification workflow.
        </p>
      </div>

      <div className="mt-gutter grid grid-cols-1 gap-gutter md:grid-cols-3">
        {VAULT_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col gap-3 rounded-xl bg-surface-container-lowest p-5 shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
              <span aria-hidden="true" className="material-symbols-outlined text-[24px]">
                {feature.icon}
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              {feature.title}
            </h3>
            <p className="font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}