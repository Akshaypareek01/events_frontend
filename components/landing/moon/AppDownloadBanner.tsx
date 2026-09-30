"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PLAY_STORE =
  "https://play.google.com/store/apps/details?id=com.samsarawellnessyogav3.app";
const APP_STORE = "https://apps.apple.com/in/app/samsara-wellness/id6749355131";

/**
 * Returns the App Store on iPhone and iPad, and the Play Store everywhere else.
 */
function storeUrl(): string {
  const ua = navigator.userAgent;
  const iPadOs = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iPad|iPhone|iPod/.test(ua) || iPadOs) return APP_STORE;
  return PLAY_STORE;
}

/**
 * Launch-offer banner under the closing call to action.
 * Android opens Google Play. iPhone and iPad open the App Store.
 */
export function AppDownloadBanner() {
  const [href, setHref] = useState(PLAY_STORE);

  useEffect(() => {
    setHref(storeUrl());
  }, []);

  const storeName = href === APP_STORE ? "the App Store" : "Google Play";

  return (
    <section aria-label="Download the Samsara Wellness app" className="px-4 pb-16 sm:px-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Join Samsara Wellness on ${storeName}`}
        className="mx-auto block max-w-md overflow-hidden rounded-3xl shadow-[0_18px_50px_rgba(28,25,20,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 md:max-w-6xl"
      >
        <Image
          src="/moon/app-banner-mobile.webp"
          alt="Samsara Wellness launch offer, ₹5,999 a year, valid till 30 October 2026."
          width={941}
          height={1671}
          sizes="(min-width: 768px) 1px, 100vw"
          className="h-auto w-full md:hidden"
        />
        <Image
          src="/moon/app-banner.png"
          alt="Samsara Wellness launch offer, ₹5,999 a year, valid till 30 October 2026."
          width={1131}
          height={300}
          sizes="(min-width: 768px) 72rem, 1px"
          className="hidden h-auto w-full md:block"
        />
      </a>
    </section>
  );
}
