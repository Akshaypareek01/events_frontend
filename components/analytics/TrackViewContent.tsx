"use client";

import { useEffect } from "react";
import { trackViewContent } from "@/lib/metaPixel";

/**
 * Fires ViewContent once when the landing page mounts.
 */
export function TrackViewContent() {
  useEffect(() => {
    trackViewContent();
  }, []);
  return null;
}
