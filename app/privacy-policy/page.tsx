import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { privacyDocument } from "@/components/legal/privacyContent";

export const metadata: Metadata = {
  title: "Event Privacy Policy | Samsara Wellness",
  description:
    "Event Privacy Policy for Samsara Wellness public online and offline programmes, effective 1 October 2026.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocument {...privacyDocument} />;
}
