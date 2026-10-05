import Image from "next/image";
import { t, type Locale } from "@/lib/i18n";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { Table } from "@/components/ui/table";
import { formatCfa, formatDate } from "@/lib/utils/format";
import type { OwnerProperty, PropertyStatus } from "@/lib/domain/property";

/**
 * The owner's listings table.
 *
 * Owns: rendering one row per property with its thumbnail, price, status, view
 * count, and last-updated date. Rows are not yet links — `properties/[id]/edit`
 * is an unbuilt route, so there is nowhere to point at. Wiring the link is part
 * of that route's task, not this one.
 *
 * Does not own: filtering, sorting, or pagination. The dashboard shows the
 * owner's whole portfolio; those arrive with the properties list route.
 *
 * The status mapping below is the `context/ui-context.md` convention applied to
 * the domain's six states: `draft` and `sold`/`rented` are terminal or
 * not-yet-listed, and render in neutral gray rather than being given a colour of
 * their own.
 */

/** Header labels, in column order — five entries, matching the five cells below. */
const COLUMN_KEYS = [
  "owner.dashboard.listings.column.property",
  "owner.dashboard.listings.column.price",
  "owner.dashboard.listings.column.status",
  "owner.dashboard.listings.column.views",
  "owner.dashboard.listings.column.updated",
] as const;

const STATUS_TONE: Record<PropertyStatus, BadgeTone> = {
  draft: "neutral",
  pending_review: "pending",
  active: "success",
  locked: "locked",
  sold: "neutral",
  rented: "neutral",
};

const STATUS_KEY: Record<PropertyStatus, string> = {
  draft: "owner.status.draft",
  pending_review: "owner.status.pending_review",
  active: "owner.status.active",
  locked: "owner.status.locked",
  sold: "owner.status.sold",
  rented: "owner.status.rented",
};

export function ListingTable({
  locale,
  properties,
}: {
  locale: Locale;
  properties: readonly OwnerProperty[];
}) {
  if (properties.length === 0) {
    return (
      <p className="rounded-lg bg-surface-container px-4 py-8 text-center text-body-md text-on-surface-variant">
        {t(locale, "owner", "owner.dashboard.listings.empty")}
      </p>
    );
  }

  return (
    <Table>
      <thead>
        <tr className="border-b border-outline-variant">
          {COLUMN_KEYS.map((key) => (
            <th
              key={key}
              scope="col"
              className="px-4 py-3 text-start font-label-sm text-label-sm text-on-surface-variant"
            >
              {t(locale, "owner", key)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {properties.map((property) => (
          <tr key={property.id} className="border-b border-outline-variant last:border-0">
            <th scope="row" className="px-4 py-3 text-start font-normal">
              <span className="flex items-center gap-3">
                <Image
                  src={property.image}
                  alt={property.imageAlt}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-md object-cover"
                />
                <span className="min-w-0">
                  <span className="block truncate font-label-md text-label-md text-on-surface">
                    {property.title}
                  </span>
                  <span className="block text-label-sm text-label-sm text-on-surface-variant">
                    {t(locale, "owner", `owner.transaction.${property.transactionType}`)}
                  </span>
                </span>
              </span>
            </th>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface">
              {formatCfa(property.priceCfa, locale)}
            </td>
            <td className="px-4 py-3">
              <Badge tone={STATUS_TONE[property.status]}>
                {t(locale, "owner", STATUS_KEY[property.status])}
              </Badge>
            </td>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface-variant">
              {property.views30d}
            </td>
            <td className="px-4 py-3 text-label-md text-label-md text-on-surface-variant">
              {formatDate(property.updatedAtIso, locale)}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}