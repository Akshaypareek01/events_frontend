"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackAddToCart, trackContact } from "@/lib/metaPixel";

/**
 * Register link that also sends AddToCart.
 */
export function MetaRegisterLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Link href="/register" className={className} onClick={() => trackAddToCart()}>
      {children}
    </Link>
  );
}

/**
 * Mailto link that sends Meta's Contact event.
 */
export function MetaContactLink({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a href="mailto:legal@samsarawellness.com" className={className} onClick={() => trackContact()}>
      {children}
    </a>
  );
}
