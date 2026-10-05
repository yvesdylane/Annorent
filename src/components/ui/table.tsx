import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Table surface.
 *
 * Owns: only the frame — rounded, bordered, horizontally scrollable. Callers
 * write their own `<thead>` / `<tbody>` / `<th>` / `<td>` so a table can be a
 * data grid or a definition list without a second component (rule 8).
 * Does not own: column definitions, sorting, or pagination.
 */

export function Table({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-start">{children}</table>
    </div>
  );
}