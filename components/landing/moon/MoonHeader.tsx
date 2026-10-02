"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHasUserToken } from "@/hooks/useHasUserToken";
import { trackAddToCart } from "@/lib/metaPixel";

const links = [
  { href: "#explore", label: "Experience" },
  { href: "#journey", label: "Journey" },
  { href: "#event", label: "Details" },
  { href: "#faq", label: "FAQ" },
] as const;

/** Three-line menu control for small screens. */
function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

/** Close control inside the mobile sidebar. */
function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/**
 * Login, register, or dashboard. Shared by the desktop bar and the mobile sidebar.
 */
function AuthActions({ loggedIn, onNavigate, stacked }: { loggedIn: boolean; onNavigate?: () => void; stacked?: boolean }) {
  if (loggedIn) {
    return (
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Dashboard
      </Link>
    );
  }

  return (
    <div className={stacked ? "flex flex-col gap-3" : "flex items-center gap-3 text-sm"}>
      <Link
        href="/login"
        onClick={onNavigate}
        className={
          stacked
            ? "inline-flex min-h-11 items-center justify-center rounded-full border border-orange-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-orange-400"
            : "font-medium text-gray-600 hover:text-orange-600"
        }
      >
        Login
      </Link>
      <Link
        href="/register"
        onClick={() => {
          trackAddToCart();
          onNavigate?.();
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
      >
        Register
      </Link>
    </div>
  );
}

/**
 * Sticky landing nav. On small screens the links and account actions live in a left sidebar.
 */
export function MoonHeader() {
  const loggedIn = useHasUserToken();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /** Close the drawer after a sidebar link is used. */
  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-orange-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0" aria-label="Samsara home">
          <Image
            src="/samsaralogomain.png"
            alt="Samsara"
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav aria-label="Page sections" className="hidden items-center gap-5 text-sm text-gray-500 md:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-orange-600">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <AuthActions loggedIn={loggedIn} />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-orange-50 md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(true)}
        >
          <MenuIcon />
        </button>
      </div>

      {open
        ? createPortal(
        <div className="md:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed top-0 left-0 z-50 flex h-dvh w-[min(100%,18.5rem)] flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-orange-100 px-4 py-3">
              <Link href="/" onClick={closeMenu} aria-label="Samsara home">
                <Image
                  src="/samsaralogomain.png"
                  alt="Samsara"
                  width={120}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-800 hover:bg-orange-50"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <CloseIcon />
              </button>
            </div>

            <nav aria-label="Page sections" className="flex flex-col px-3 py-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-base font-medium text-gray-800 hover:bg-orange-50 hover:text-orange-700"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto border-t border-orange-100 p-4">
              <AuthActions loggedIn={loggedIn} onNavigate={closeMenu} stacked />
            </div>
          </aside>
        </div>,
        document.body,
      )
        : null}
    </header>
  );
}
