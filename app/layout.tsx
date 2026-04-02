import type { Metadata, Viewport } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontBody = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Samsara Yoga — 80-Day Yoga Mohotsav",
  description: "Daily morning & evening live classes. Register for ₹499 + 18% GST (₹588.82) or via your company.",
};

/** Mobile-first: proper scaling + theme color for browser chrome. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f4f1ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} h-full`}
    >
      <body className="flex min-h-dvh min-h-full flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] font-[family-name:var(--font-body)] antialiased">
        {children}
        <Script
          src="https://apis.chatbot.nvhotech.in/chatbot.js"
          strategy="afterInteractive"
          data-user-id="69ce0a8ddb5e1b75035784e3"
        />
      </body>
    </html>
  );
}
