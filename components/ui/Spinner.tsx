import { cn } from "@/lib/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
