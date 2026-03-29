import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Samsara Wellness",
  description:
    "Terms and conditions for the 80-Day Global Online Yoga Event (2nd April - 21st June 2026).",
};

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    points: [
      "By registering and/or making payment, you agree to be bound by these Terms & Conditions.",
    ],
  },
  {
    title: "2. Eligibility",
    points: [
      "Open to participants worldwide.",
      "Minimum age: 12 years.",
      "Minors must participate under parental/guardian supervision.",
    ],
  },
  {
    title: "3. Nature of Services",
    points: [
      "The program consists of online yoga sessions conducted over 80 days.",
      "Includes Yoga Asanas, Pranayama, Meditation, and wellness practices.",
    ],
  },
  {
    title: "4. Health Disclaimer",
    points: [
      "Participation is voluntary and at your own risk.",
      "You confirm you are medically fit.",
      "Consult a doctor before participation if required.",
      "Samsara Wellness is not liable for any injury, illness, or damages.",
    ],
  },
  {
    title: "5. Registration & Access",
    points: [
      "Registration is mandatory.",
      "Access is non-transferable.",
      "Sharing login/access details is prohibited.",
    ],
  },
  {
    title: "6. B2B & Individual Access",
    points: [
      "Corporate (B2B): Access may be free under organizational agreements.",
      "Individuals: Paid participation as per listed pricing.",
    ],
  },
  {
    title: "7. Payment Terms",
    points: [
      "Fees must be paid in full before accessing sessions.",
      "Pricing may vary by geography or offer.",
    ],
  },
  {
    title: "8. Refund & Cancellation Policy",
    points: [
      "Fees are non-refundable and non-transferable.",
      "No refunds for missed sessions, partial attendance, or schedule changes.",
      "In case of event cancellation by organizer, refund (partial/full) is at sole discretion.",
      "Payment gateway charges and taxes are non-refundable.",
    ],
  },
  {
    title: "9. GST & Invoicing (India)",
    points: [
      "GST will be applied as per applicable laws.",
      "Invoice will be issued upon payment.",
      "Users must provide correct billing details.",
    ],
  },
  {
    title: "10. International Payments",
    points: [
      "Payments may be processed in foreign currencies.",
      "Exchange rates and bank charges are user’s responsibility.",
    ],
  },
  {
    title: "11. Intellectual Property",
    points: [
      "All content belongs to Samsara Wellness.",
      "No recording, sharing, or reproduction allowed.",
    ],
  },
  {
    title: "12. Recording & Media Consent",
    points: [
      "Sessions may be recorded.",
      "You consent to use of your image/video for promotional or training purposes.",
    ],
  },
  {
    title: "13. Program Changes",
    points: [
      "Organizer may modify schedule, trainers, or format without prior notice.",
    ],
  },
  {
    title: "14. Technical Disclaimer",
    points: [
      "Users are responsible for internet and device.",
      "Organizer is not liable for technical issues on user side.",
    ],
  },
  {
    title: "15. Limitation of Liability",
    points: ["No liability for indirect, incidental, or consequential damages."],
  },
  {
    title: "16. Governing Law",
    points: [
      "Governed by laws of India.",
      "Jurisdiction: Bangalore, Karnataka.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#fdf6ee] px-4 py-10 text-[#1c1914] sm:px-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-orange-100 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8 space-y-3 border-b border-orange-100 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
            TERMS & CONDITIONS
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">
            80-Day Global Online Yoga Event
          </h1>
          <p className="text-sm text-gray-600">
            2nd April - 21st June 2026
          </p>
          <p className="text-sm text-gray-700">
            This event is organized by Samsara Wellness, Bangalore, India, in alignment
            with guidelines of the Ministry of AYUSH.
          </p>
        </div>

        <div className="space-y-6">
          {termsSections.map((section) => (
            <section key={section.title} className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
                {section.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section
          id="privacy"
          className="mt-8 scroll-mt-6 space-y-2 border-t border-orange-100 pt-6"
        >
          <h2 className="text-base font-semibold text-gray-900">Privacy</h2>
          <p className="text-sm leading-6 text-gray-700">
            We use the information you provide at registration (name, email, phone, location) to run this
            event, send updates, and process payments where applicable. We do not sell your data. For privacy
            requests, contact us at the email below.
          </p>
        </section>

        <section className="mt-8 space-y-2 border-t border-orange-100 pt-6">
          <h2 className="text-base font-semibold text-gray-900">17. Contact</h2>
          <p className="text-sm text-gray-700">Samsara Wellness</p>
          <p className="text-sm text-gray-700">Bangalore, India</p>
          <p className="text-sm text-gray-700">
            Email:{" "}
            <a href="mailto:legal@samsarawellness.com" className="text-orange-600 hover:underline">
              legal@samsarawellness.com
            </a>
          </p>
        </section>

        <div className="mt-10">
          <Link href="/register" className="text-sm font-medium text-orange-600 hover:underline">
            Back to registration
          </Link>
        </div>
      </div>
    </div>
  );
}
