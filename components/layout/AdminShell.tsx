import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** e.g. log out when the admin is authenticated (dashboard only). */
  headerRight?: ReactNode;
};

/** Shared admin layout: single header with title + optional actions + back to site (IYD / saffron when inside `.admin-iyd`). */
export function AdminShell({ children, headerRight }: Props) {
  return (
    <div className="flex min-h-full flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link
            href="/admin"
            className="font-[family-name:var(--font-iyd-display)] text-xl font-normal tracking-tight text-[var(--color-text)] hover:text-[#E8541A]"
          >
            Admin
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            {headerRight}
            <Link
              href="/"
              className="rounded-sm px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5A3C22] transition hover:bg-[#E8541A]/8 hover:text-[#1C1208]"
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
