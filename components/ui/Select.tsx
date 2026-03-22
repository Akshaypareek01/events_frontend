import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const baseClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] shadow-inner outline-none transition-[box-shadow,border-color] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-ring)]";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function Select({
  className,
  options,
  placeholder = "Select…",
  ...props
}: SelectProps) {
  return (
    <select className={cn(baseClass, className)} {...props}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
