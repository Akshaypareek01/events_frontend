import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "destructive";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-fg)] shadow-sm hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
  secondary:
    "bg-[var(--color-surface-muted)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-surface)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
  ghost:
    "text-[var(--color-text)] hover:bg-[var(--color-surface-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
  destructive:
    "bg-[var(--color-danger)] text-white hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[var(--color-danger)]",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
