import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Button.
 *
 * Owns: the four button intents and the two control heights, so every action
 * across all four roles looks and behaves the same.
 * Does not own: icons — callers pass a `<span className="material-symbols-outlined">`
 * as children. Does not own: loading state; a caller that needs one swaps in its
 * own `Skeleton` and sets `disabled`.
 *
 * `type` defaults to `"button"`: most of these sit near unrelated forms, and a
 * default of `"submit"` would silently post them.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  // The `outline-variant` border measures 1.70:1 against white, which is below
  // the 3:1 that WCAG 1.4.11 (non-text contrast) asks of a control boundary.
  // An outlined button is therefore only safe when its own label carries the
  // affordance, which it does at 9.81:1 — but if a variant ever needs to rely
  // on the border alone, swap it for `border-outline` first.
  secondary: "bg-surface-container-lowest text-primary border border-outline-variant hover:bg-surface-container",
  ghost: "bg-transparent text-primary hover:bg-surface-container",
  danger: "bg-error text-on-error hover:opacity-90",
};

const SIZE_CLASS = {
  sm: "h-9 px-4 text-label-md",
  md: "h-11 px-6 text-label-md",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE_CLASS;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full",
        "font-label-md text-label-md transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}