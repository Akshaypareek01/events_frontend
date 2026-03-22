import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** e.g. log out when the admin is authenticated (dashboard only). */
  headerRight?: ReactNode;
};

/** Shared admin layout: single header with title + optional actions + back to site. */
export function AdminShell({ children, headerRight }: Props) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--color-text)] hover:opacity-90"
          >
            Admin
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {headerRight}
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)]/60 hover:text-[var(--color-text)]"
            >
              <span className="sm:hidden">Site</span>
              <span className="hidden sm:inline">Back to site</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
