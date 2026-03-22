import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;
  return (
    <p id={id} className={cn("text-sm text-[var(--color-danger)]", className)}>
      {children}
    </p>
  );
}
