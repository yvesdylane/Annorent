import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder.
 *
 * Owns: a pulsing block matching the shape of content that has not arrived.
 * Does not own: layout. The parent reserves the space — the skeleton only fills
 * it. Every current usage reserves correct dimensions, so nothing shifts when
 * data lands (no layout jump).
 */

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-surface-container", className)}
    />
  );
}