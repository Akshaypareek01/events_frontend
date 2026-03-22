"use client";

import Link from "next/link";
import { useHasUserToken } from "@/hooks/useHasUserToken";

const btnPrimary =
  "inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3 text-sm font-medium text-[var(--color-primary-fg)] shadow-sm hover:opacity-95";

/** Pricing section primary action: register vs dashboard. */
export function LandingPricingCta() {
  const loggedIn = useHasUserToken();

  if (loggedIn) {
    return (
      <Link href="/dashboard" className={btnPrimary}>
        Open dashboard
      </Link>
    );
  }

  return (
    <Link href="/register" className={btnPrimary}>
      Register now
    </Link>
  );
}
