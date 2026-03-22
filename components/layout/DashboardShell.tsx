import Link from "next/link";
import type { ReactNode } from "react";

/** Phase 08: user dashboard chrome (nav + content). */
export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <span className="font-[family-name:var(--font-display)] text-lg">Dashboard</span>
          <Link href="/" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
            Home
          </Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
