"use client";

import Link from "next/link";
import { useHasUserToken } from "@/hooks/useHasUserToken";

const primary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-[var(--color-primary-fg)] shadow-sm transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]";

const secondary =
  "inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3 text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]";

/** Hero CTAs: register flow vs return to dashboard when session exists. */
export function LandingHeroActions() {
  const loggedIn = useHasUserToken();

  if (loggedIn) {
    return (
      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/dashboard" className={primary}>
          Go to dashboard
        </Link>
        <a href="#schedule" className={secondary}>
          View schedule
        </a>
      </div>
    );
  }

  return (
    <div className="mt-10 flex flex-wrap gap-4">
      <Link href="/register" className={primary}>
        Register now
      </Link>
      <a href="#schedule" className={secondary}>
        View schedule
      </a>
    </div>
  );
}
