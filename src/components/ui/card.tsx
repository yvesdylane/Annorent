import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Card.
 *
 * Owns: the elevated surface treatment shared by the dashboard's stat tiles,
 * table panel, and activity feed.
 * Does not own: inner structure. There is deliberately no `CardHeader` /
 * `CardBody` pair — file-structure.md rule 8 allows one exported component per
 * file, and callers compose plain `<div>`s inside `<Card>` instead. Revisit this
 * only if three or more call sites end up repeating the same inner markup.
 *
 * The shadow value matches the one the marketing cards already use
 * (`shadow-[0_4px_20px_rgba(23,43,77,0.08)]`), so the public site and the owner
 * surfaces sit at the same elevation.
 */

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface-container-lowest border border-outline-variant",
        "shadow-[0_4px_20px_rgba(23,43,77,0.08)]",
        className,
      )}
    >
      {children}
    </div>
  );
}