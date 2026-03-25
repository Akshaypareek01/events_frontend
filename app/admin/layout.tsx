import { Cinzel, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

const fontDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-iyd-display",
});

const fontAccent = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-iyd-accent",
});

/** Warm IYD background + saffron `--color-*` overrides (see `globals.css` `.admin-iyd`) for all `/admin` routes. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${fontDisplay.variable} ${fontAccent.variable} admin-iyd min-h-dvh bg-[#FDF6EE] text-[#1C1208]`}
    >
      {children}
    </div>
  );
}
