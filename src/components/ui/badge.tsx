import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Status pill.
 *
 * Owns: the one status-to-colour mapping the whole product shares —
 * `context/ui-context.md` fixes Verified/Confirmed/Available to success,
 * Pending/awaiting-review to pending, and Locked/Cancelled/Suspended to locked,
 * and requires every status to be readable without relying on colour alone.
 *
 * Does not own: what a status *means* for a given entity, or any transition
 * between statuses — it only renders one.
 *
 * The four tones map onto the three status tokens added to `globals.css` plus
 * the existing neutral, on a `bg-surface-container` (`#e8edff`) pill. Measured
 * contrast for that exact pairing:
 *
 * | tone    | on pill | on white |
 * |---------|---------|----------|
 * | success | 4.56:1  | 5.32:1   |
 * | pending | 5.08:1  | 5.93:1   |
 * | locked  | 5.08:1  | 5.93:1   |
 * | neutral | 8.02:1  | 9.36:1   |
 *
 * All clear 4.5:1 (WCAG AA for normal text), which is why the status colours
 * are new tokens rather than the brand `#36B373` — that measures 2.67:1 on
 * white and fails. Do not swap a tone back to `text-primary` on the assumption
 * that a darker brand reads better; the measured numbers are what the palette
 * was chosen for.
 */

export type BadgeTone = "success" | "pending" | "locked" | "neutral";

const TONE_CLASS: Record<BadgeTone, string> = {
  success: "text-success",
  pending: "text-pending",
  locked: "text-locked",
  neutral: "text-on-surface-variant",
};

export function Badge({
  tone,
  children,
  className,
}: {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-container px-3 py-1",
        "font-label-sm text-label-sm whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}