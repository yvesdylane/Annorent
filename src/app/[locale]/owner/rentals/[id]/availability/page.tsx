import { AvailabilityCalendar } from "@/components/owner/availability-calendar";

/**
 * Unit availability — `/[locale]/owner/rentals/[id]/availability`.
 *
 * Composition only (file-structure.md rule 11): the page resolves the dynamic
 * `[id]` segment and passes it to the shared calendar, which pre-selects the
 * unit and highlights it in the side rail (see
 * `components/owner/availability-calendar.tsx`).
 */

export default async function OwnerUnitAvailabilityPage({
  params,
}: PageProps<"/[locale]/owner/rentals/[id]/availability">) {
  const { id } = await params;

  return <AvailabilityCalendar unitId={id} />;
}