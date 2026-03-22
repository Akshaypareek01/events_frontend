import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
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
  title: "Samsara Yoga — 3 Month Program",
  description: "Daily morning & evening live classes. Register for ₹499 or via your company.",
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
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)] antialiased">
        {children}
      </body>
    </html>
  );
}
