"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useHasUserToken } from "@/hooks/useHasUserToken";

const solid =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

const outline =
  "inline-flex min-h-11 items-center justify-center rounded-full border border-orange-500 bg-white px-8 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500";

type MoonCtaProps = {
  children: ReactNode;
  tone?: "solid" | "outline";
  className?: string;
};

/**
 * Landing join button. Signed-out visitors go to registration; a session goes to the dashboard.
 */
export function MoonCta({ children, tone = "solid", className = "" }: MoonCtaProps) {
  const loggedIn = useHasUserToken();
  const href = loggedIn ? "/dashboard" : "/register";

  return (
    <Link href={href} className={`${tone === "solid" ? solid : outline} ${className}`}>
      {loggedIn ? "Go to dashboard" : children}
    </Link>
  );
}
