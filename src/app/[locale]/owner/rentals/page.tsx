import { AvailabilityCalendar } from "@/components/owner/availability-calendar";

/**
 * Availability calendar — `/[locale]/owner/rentals`.
 *
 * Composition only (file-structure.md rule 11): no chrome of its own, no RBAC
 * guard (the role's `layout.tsx` handles that). The calendar is a client
 * component and owns its own unit-tab state.
 */

export default function OwnerRentalsPage() {
  return <AvailabilityCalendar />;
}