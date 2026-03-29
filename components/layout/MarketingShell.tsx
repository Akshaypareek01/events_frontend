import Link from "next/link";
import type { ReactNode } from "react";
import { MarketingAuthLinks } from "@/components/layout/MarketingAuthLinks";

type MarketingShellProps = {
  children: ReactNode;
  /** Landing-only anchors; hide on auth routes where they don’t apply. */
  showSchedulePricing?: boolean;
};

export function MarketingShell({
  children,
  showSchedulePricing = true,
}: MarketingShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6">
          <Link href="/" className="font-[family-name:var(--font-display)] text-lg tracking-tight">
            Samsara Yoga
          </Link>
          <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm sm:justify-end">
            {showSchedulePricing && (
              <>
                <a href="#schedule" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  Schedule
                </a>
                <a href="#pricing" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">
                  Pricing
                </a>
              </>
            )}
            <MarketingAuthLinks />
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/60 py-8 text-center text-sm text-[var(--color-muted)]">
        <p>80-day program · Live on Zoom · Questions? Email the organizers.</p>
      </footer>
    </div>
  );
}
