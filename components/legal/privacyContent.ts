import type { LegalPage } from "@/components/legal/LegalDocument";

const collect = ["User Type", "Full Name", "Email Address", "Mobile Number", "City", "Country"] as const;

/** Event Privacy Policy, effective 1 October 2026. */
export const privacyDocument: LegalPage = {
  kicker: "SAMSARA WELLNESS",
  title: "Event Privacy Policy",
  effectiveDate: "Effective Date: 1 October 2026",
  relatedHref: "/terms-and-conditions",
  relatedLabel: "Event Terms & Conditions",
  intro: [
    "This Event Privacy Policy explains how Samsaraa WellTek Pvt. Ltd. (“Samsara Wellness”, “Company”, “we”, “us” or “our”) collects, uses, stores and protects personal information of individuals worldwide who register for or participate in Samsara Wellness public online and offline Events.",
    "This includes Yoga Retreats, Wellness Retreats, Yoga & Meditation Sessions, Workshops, Festivals and other public wellness programmes.",
    "This Policy does not apply to corporate/B2B programmes that may be governed by separate policies or agreements.",
  ],
  sections: [
    {
      title: "1. Information we collect",
      blocks: [
        { kind: "paragraph", text: "For Event registration, we may collect:" },
        { kind: "list", items: collect },
        { kind: "paragraph", text: "Depending on the Event, we may also collect payment/transaction information and information voluntarily provided by participants for Event administration, support or feedback." },
        { kind: "paragraph", text: "We aim to collect information reasonably necessary for Event administration and the purposes described in this Policy." },
      ],
    },
    {
      title: "2. How we use your information",
      blocks: [
        { kind: "label", text: "Event registration and administration" },
        {
          kind: "list",
          items: [
            "processing Event registration;",
            "confirming registration;",
            "identifying participants;",
            "managing attendance;",
            "providing Event access or login;",
            "sending Event confirmations and reminders;",
            "providing customer support; and",
            "managing cancellations and refunds.",
          ],
        },
        { kind: "label", text: "Internal administration" },
        {
          kind: "list",
          items: [
            "maintaining Event records;",
            "accounting and transaction reconciliation;",
            "operational purposes;",
            "security; and",
            "legal or regulatory compliance.",
          ],
        },
        { kind: "label", text: "Marketing and promotional communication" },
        { kind: "paragraph", text: "Where applicable consent has been provided and permitted by applicable law, information may be used to send marketing and promotional communications relating to Samsara Wellness Events, Retreats, programmes, services and offers." },
      ],
    },
    {
      title: "3. Event login information",
      blocks: [
        { kind: "paragraph", text: "For online Events, registration information may be used to provide Event access or login functionality." },
        { kind: "paragraph", text: "You do not need to download or use the Samsara Wellness App to register for or participate in an Event, unless specifically stated for that particular Event." },
      ],
    },
    {
      title: "4. Payment information",
      blocks: [
        { kind: "paragraph", text: "Where payment is required, transactions may be processed through third-party payment gateways." },
        { kind: "paragraph", text: "Samsara Wellness may receive transaction information required to confirm payment, process refunds and maintain financial records." },
        { kind: "paragraph", text: "Complete payment credentials may be processed directly by the relevant payment service provider." },
      ],
    },
    {
      title: "5. Photographs, videos and recordings",
      blocks: [
        { kind: "paragraph", text: "Certain Events may be photographed, filmed or recorded for documentation, promotional, educational, marketing, social-media or archival purposes." },
        { kind: "paragraph", text: "Participants may appear in photographs, videos or recordings captured during an Event." },
        { kind: "paragraph", text: "Where applicable law requires specific consent, an appropriate consent mechanism will be provided." },
      ],
    },
    {
      title: "6. Sharing of personal information",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness does not intend to sell your personal information." },
        { kind: "paragraph", text: "Information may be shared with service providers or partners where reasonably necessary for:" },
        {
          kind: "list",
          items: [
            "Event registration and management;",
            "online Event hosting;",
            "payment processing;",
            "email, SMS or WhatsApp communication;",
            "technology and hosting;",
            "customer support;",
            "Event venue or Retreat management;",
            "accommodation or activity providers where relevant; or",
            "legal, regulatory, safety or security requirements.",
          ],
        },
        { kind: "paragraph", text: "Information shared will be limited to what is reasonably necessary for the relevant purpose." },
      ],
    },
    {
      title: "7. Data security",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness takes reasonable technical and organisational measures to protect personal information against unauthorised access, misuse, alteration, disclosure, loss or destruction." },
        { kind: "paragraph", text: "However, no electronic transmission or storage system can be guaranteed to be completely secure." },
      ],
    },
    {
      title: "8. Data retention",
      blocks: [
        { kind: "paragraph", text: "We may retain Event registration information for as long as reasonably necessary for:" },
        {
          kind: "list",
          items: [
            "Event administration;",
            "internal records;",
            "accounting;",
            "legal compliance;",
            "dispute resolution;",
            "legitimate business purposes; and",
            "other applicable requirements.",
          ],
        },
        { kind: "paragraph", text: "When information is no longer reasonably required and there is no legal or legitimate reason for continued retention, it may be deleted or anonymised." },
      ],
    },
    {
      title: "9. Marketing communications",
      blocks: [
        { kind: "paragraph", text: "Where marketing consent has been provided, Samsara Wellness may send information about:" },
        {
          kind: "list",
          items: [
            "upcoming Events and Retreats;",
            "wellness programmes;",
            "services;",
            "offers and promotions;",
            "educational content; and",
            "related wellness activities.",
          ],
        },
        { kind: "paragraph", text: "You may withdraw marketing consent at any time by contacting assist@samsarawellness.in." },
        { kind: "paragraph", text: "Withdrawal of marketing consent will not affect your participation in an Event or the lawfulness of processing carried out before withdrawal." },
      ],
    },
    {
      title: "10. Third-party platforms",
      blocks: [
        { kind: "paragraph", text: "Online Events may use third-party platforms for video conferencing, registration, payments, communication or other services." },
        { kind: "paragraph", text: "Such platforms may process information according to their own privacy policies and terms." },
      ],
    },
    {
      title: "11. Your privacy rights",
      blocks: [
        { kind: "paragraph", text: "Subject to applicable law, you may have rights relating to your personal information, including rights concerning access, correction, withdrawal of consent and grievance redressal." },
        { kind: "paragraph", text: "Requests may be submitted to legal@samsarawellness.in." },
        { kind: "paragraph", text: "General questions and customer support may be directed to assist@samsarawellness.in." },
      ],
    },
    {
      title: "12. Children",
      blocks: [
        { kind: "paragraph", text: "Unless specifically stated otherwise, Samsara Wellness Events are intended for adults." },
        { kind: "paragraph", text: "Where an Event specifically involves children or minors, registration and participation should be completed by or with the involvement of a parent or legal guardian, as applicable." },
      ],
    },
    {
      title: "13. Global participants",
      blocks: [
        { kind: "paragraph", text: "This Privacy Policy applies to participants worldwide." },
        { kind: "paragraph", text: "Depending on your country or region, additional privacy, consumer or data-protection rights may apply to you under applicable law." },
        { kind: "paragraph", text: "Samsaraa WellTek Pvt. Ltd. will process personal information in accordance with applicable data-protection and privacy requirements." },
      ],
    },
    {
      title: "14. Changes to this privacy policy",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness may update this Privacy Policy from time to time." },
        { kind: "paragraph", text: "The updated version will be published on the relevant Event registration page or website." },
      ],
    },
    {
      title: "15. Contact and grievance redressal",
      blocks: [
        { kind: "paragraph", text: "Samsaraa WellTek Pvt. Ltd., Bengaluru, Karnataka, India. Brand: Samsara Wellness." },
        { kind: "paragraph", text: "Legal / Privacy / Grievance Matters: legal@samsarawellness.in" },
        { kind: "paragraph", text: "General / Customer Support / Refunds: assist@samsarawellness.in" },
      ],
    },
    {
      title: "16. Governing law and jurisdiction",
      blocks: [
        { kind: "paragraph", text: "This Privacy Policy shall be governed by the laws of India, subject to any mandatory privacy or consumer rights applicable to participants in their respective jurisdictions." },
        { kind: "paragraph", text: "Subject to applicable law, courts having jurisdiction in Bengaluru, Karnataka, India, shall have jurisdiction in relation to matters arising from this Privacy Policy." },
      ],
    },
  ],
};
