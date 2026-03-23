import type { Metadata } from "next";

/** Pixel-identical IYD landing lives in `public/samsara-iyd-landing.html` (with `/login` in nav). */
export const metadata: Metadata = {
  title: "International Yoga Day 2026 | Samsara Wellness",
  description:
    "Join Samsara Wellness for International Yoga Day — teachers, corporates, sponsors, and community.",
};

export default function Home() {
  return (
    <iframe
      title="International Yoga Day 2026 | Samsara Wellness"
      src="/samsara-iyd-landing.html"
      className="fixed inset-0 z-0 block h-[100dvh] w-full border-0 bg-[#FDF6EE]"
    />
  );
}
