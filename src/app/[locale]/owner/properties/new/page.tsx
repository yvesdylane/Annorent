import { AddPropertyWizard } from "@/components/owner/add-property-wizard";

/**
 * Add a new property — `/[locale]/owner/properties/new`.
 *
 * Composition only (file-structure.md rule 11): no chrome of its own, no RBAC
 * guard (the role's `layout.tsx` handles that). The wizard is a client
 * component and owns its own step state.
 */

export default function OwnerNewPropertyPage() {
  return <AddPropertyWizard />;
}