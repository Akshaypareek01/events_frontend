import { Cinzel, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

/** Landing page (IYD) typography — matches `public/samsara-iyd-landing.html`. */
const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-iyd-display",
});

const fontAccent = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-iyd-accent",
});

export default function PayLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${fontDisplay.variable} ${fontAccent.variable} min-h-dvh`}>{children}</div>
  );
}
