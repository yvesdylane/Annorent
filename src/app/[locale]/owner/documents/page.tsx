import { DocumentsEmpty } from "@/components/owner/documents-empty";

/**
 * Documents & Cadastral vault — `/[locale]/owner/documents`.
 *
 * Composition only (file-structure.md rule 11): no chrome of its own, no RBAC
 * guard (the role's `layout.tsx` handles that). The vault renders the empty
 * state until documents start arriving from the API.
 */

export default function OwnerDocumentsPage() {
  return <DocumentsEmpty />;
}