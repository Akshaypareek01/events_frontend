import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { termsDocument } from "@/components/legal/termsContent";

export const metadata: Metadata = {
  title: "Event Terms & Conditions | Samsara Wellness",
  description:
    "Event Terms & Conditions for Samsara Wellness public online and offline programmes, effective 1 October 2026.",
};

export default function TermsAndConditionsPage() {
  return <LegalDocument {...termsDocument} />;
}
