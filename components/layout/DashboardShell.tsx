import Link from "next/link";
import type { ReactNode } from "react";

/** Dashboard chrome — nav + content. Accepts optional logoutAction for teacher pages. */
export function DashboardShell({
  children,
  onLogout,
}: {
  children: ReactNode;
  onLogout?: () => void;
}) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="border-b border-[var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <span className="font-[family-name:var(--font-display)] text-lg">Dashboard</span>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]"
            >
              Home
            </Link>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}