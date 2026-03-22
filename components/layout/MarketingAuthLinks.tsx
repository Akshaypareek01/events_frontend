"use client";

import Link from "next/link";
import { useHasUserToken } from "@/hooks/useHasUserToken";

/** Nav auth: Login + Register, or Dashboard when already signed in. */
export function MarketingAuthLinks() {
  const loggedIn = useHasUserToken();

  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        className="rounded-full bg-[var(--color-primary)] px-4 py-2 font-medium text-[var(--color-primary-fg)] hover:opacity-95"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-[var(--color-muted)] hover:text-[var(--color-text)]"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-[var(--color-primary)] px-4 py-2 font-medium text-[var(--color-primary-fg)]"
      >
        Register
      </Link>
    </>
  );
}
