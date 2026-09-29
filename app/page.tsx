import type { Metadata } from "next";
import { MoonLanding } from "@/components/landing/moon/MoonLanding";

export const metadata: Metadata = {
  title: "The Moon Within — Online Full Moon Circle for Women | Samsara Wellness",
  description:
    "Join The Moon Within, an online full moon circle for women hosted by Samsara Wellness. 26th October 2026, 7:30pm IST.",
};

/** Marketing home. Registration, login, and payment stay on their existing routes. */
export default function Home() {
  return <MoonLanding />;
}
