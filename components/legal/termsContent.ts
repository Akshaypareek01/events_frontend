import type { LegalPage } from "@/components/legal/LegalDocument";

const collect = ["User Type", "Full Name", "Email Address", "Mobile Number", "City", "Country"] as const;

/** Event Terms & Conditions, effective 1 October 2026. */
export const termsDocument: LegalPage = {
  kicker: "SAMSARA WELLNESS",
  title: "Event Terms & Conditions",
  effectiveDate: "Effective Date: 1 October 2026",
  relatedHref: "/privacy-policy",
  relatedLabel: "Event Privacy Policy",
  intro: [
    "These Terms & Conditions (“Terms”) apply to individuals worldwide who register for or participate in public online or offline wellness programmes organised, hosted, co-hosted or promoted by Samsaraa WellTek Pvt. Ltd., Bengaluru, Karnataka, India (“Samsara Wellness”, “Company”, “we”, “us” or “our”).",
    "These Terms cover Yoga Retreats, Wellness Retreats, Yoga & Meditation Sessions, Workshops, Festivals and other public wellness Events.",
    "These Terms do not apply to corporate wellness programmes, corporate clients, employee wellness programmes or B2B services, which may be governed by separate agreements or terms.",
    "By registering for or participating in an Event, you agree to these Terms and the Samsara Wellness Event Privacy Policy.",
  ],
  sections: [
    {
      title: "1. Event registration",
      blocks: [
        { kind: "paragraph", text: "Participants must provide accurate and complete information during registration." },
        { kind: "paragraph", text: "For Event registration, Samsara Wellness may collect:" },
        { kind: "list", items: collect },
        { kind: "paragraph", text: "Registration may be subject to availability, capacity and successful payment where applicable." },
        { kind: "paragraph", text: "Event access, login details or registration details must not be shared with unauthorised persons." },
      ],
    },
    {
      title: "2. Online events",
      blocks: [
        { kind: "paragraph", text: "For online Events:" },
        {
          kind: "list",
          items: [
            "Participants are responsible for having a suitable device and internet connection.",
            "Event access links and login credentials must not be shared with unauthorised persons.",
            "Participants may be required to verify their identity using registration information.",
            "Samsara Wellness is not responsible for interruptions caused by the participant's device, internet connection or third-party platforms.",
            "Samsara Wellness may change the online platform or access method where reasonably necessary.",
          ],
        },
      ],
    },
    {
      title: "3. Offline events and retreats",
      blocks: [
        { kind: "paragraph", text: "For offline Events and Retreats:" },
        {
          kind: "list",
          items: [
            "Participants must follow venue rules and reasonable instructions from Event staff, trainers and teachers.",
            "Participants must behave respectfully and safely.",
            "Participants are responsible for their personal belongings.",
            "Samsara Wellness is not responsible for loss, theft or damage to personal belongings except where liability cannot legally be excluded.",
            "Participants are responsible for reaching the Event or Retreat venue on time.",
            "Accommodation, meals, transportation and other facilities will be provided only where specifically mentioned in the relevant Event or Retreat description.",
          ],
        },
      ],
    },
    {
      title: "4. Event changes, rescheduling and cancellation",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness may reasonably modify the Event date, time, venue, online platform, schedule, trainer, teacher, speaker or activities." },
        { kind: "paragraph", text: "The Company may postpone, reschedule or cancel an Event due to operational requirements, venue issues, technical problems, safety concerns, government restrictions, force majeure or circumstances beyond its reasonable control." },
        { kind: "paragraph", text: "Where Samsara Wellness cancels an Event, applicable refund or adjustment options will be communicated to registered participants." },
      ],
    },
    {
      title: "5. Participant cancellation and refund policy",
      blocks: [
        { kind: "paragraph", text: "The following policy applies unless a particular Event or Retreat registration page specifically states different terms." },
        { kind: "label", text: "Minimum refundable registration amount" },
        { kind: "paragraph", text: "Registrations below ₹500 (Indian Rupees) / US$15 (US Dollars) are non-refundable." },
        { kind: "paragraph", text: "For registrations of ₹500 / US$15 or above, the following cancellation policy applies:" },
        {
          kind: "table",
          headers: ["Cancellation timing", "Refund"],
          rows: [
            ["7 or more days before the Event", "90% refund – 10% administrative charges deducted"],
            ["5–6 days before the Event", "70% refund – 30% cancellation charges deducted"],
            ["2–4 days before the Event", "50% refund – 50% cancellation charges deducted"],
            ["Less than 2 days / within 48 hours before the Event", "No refund"],
          ],
        },
        { kind: "paragraph", text: "For Events priced in currencies other than INR or USD, the applicable Event registration page will specify the applicable cancellation and refund terms." },
        { kind: "label", text: "Adjustment towards a future event" },
        { kind: "paragraph", text: "Instead of receiving an eligible refund, a participant may request that the applicable amount be adjusted towards a future Samsara Wellness Event or Retreat, subject to availability and the terms applicable to that Event." },
        { kind: "label", text: "Refund processing" },
        { kind: "paragraph", text: "Refund requests should be submitted to assist@samsarawellness.in." },
        { kind: "paragraph", text: "Eligible refunds will be processed within 7 days after approval of the refund request and will generally be returned through the original payment method." },
        { kind: "paragraph", text: "Applicable non-recoverable payment gateway, transaction or processing charges may be deducted where applicable." },
      ],
    },
    {
      title: "6. No-show policy",
      blocks: [
        { kind: "paragraph", text: "If a participant does not attend an Event or Retreat and has not cancelled within the applicable cancellation period, the registration will generally be treated as a no-show and will not qualify for a refund." },
        { kind: "paragraph", text: "For online Events, failure to join the Event does not automatically create a right to a refund." },
      ],
    },
    {
      title: "7. Health, medical and participation disclaimer",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness Events, Yoga Retreats, Wellness Retreats, Yoga & Meditation sessions, workshops and related activities may involve physical movement, Yoga postures, stretching, breathing practices, meditation, relaxation techniques, Ayurveda-inspired wellness practices, outdoor activities and other wellness activities." },
        { kind: "paragraph", text: "Participation is voluntary. Participants are responsible for determining whether they are suitable to participate based on their individual health, physical condition and circumstances." },
        { kind: "paragraph", text: "Participants should inform and discuss with the trainer, teacher, instructor or Event representative before continuing if they experience any pain, discomfort, dizziness, breathlessness, fatigue, injury, physical limitation or other concern during an Event or activity." },
        { kind: "paragraph", text: "Participants should seek advice from a qualified medical professional before participating if they have a medical condition, injury, pregnancy, recent surgery, physical limitation or any other health concern that may affect their participation." },
        { kind: "paragraph", text: "Samsara Wellness does not provide medical diagnosis, medical treatment or emergency medical care through its Events. Information and activities provided during an Event are intended for general wellness and educational purposes and should not be considered medical advice." },
        { kind: "paragraph", text: "Participants should immediately stop an activity if they experience significant pain, discomfort, dizziness, breathlessness or any other concerning symptom and seek appropriate medical assistance where necessary." },
        { kind: "paragraph", text: "By registering for or participating in an Event, participants acknowledge that wellness and physical activities may involve inherent risks and voluntarily assume responsibility for their participation." },
        { kind: "paragraph", text: "To the maximum extent permitted by applicable law, Samsaraa WellTek Pvt. Ltd., Samsara Wellness, its trainers, teachers, instructors, Event organisers, representatives and associated service providers shall not be responsible or liable for any injury, illness, health complication, loss, damage or other consequence arising from or relating to a participant's voluntary participation in an Event or activity, except to the extent such liability cannot legally be excluded or limited." },
      ],
    },
    {
      title: "8. Retreat and outdoor activities",
      blocks: [
        { kind: "paragraph", text: "Some Retreats may include activities such as trekking, nature walks, outdoor Yoga, excursions, swimming, travel between locations or other physical activities." },
        { kind: "paragraph", text: "Such activities may involve additional risks." },
        { kind: "paragraph", text: "Participants must follow all safety instructions provided by Samsara Wellness, trainers, teachers, venues or activity providers." },
        { kind: "paragraph", text: "Any activity-specific requirements or restrictions communicated before or during the Retreat must be followed." },
      ],
    },
    {
      title: "9. Photography, video and recording",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness may photograph, record or otherwise capture portions of an Event for documentation, educational, promotional, marketing, social-media or archival purposes." },
        { kind: "paragraph", text: "Participants may appear in photographs, videos or recordings taken during an Event." },
        { kind: "paragraph", text: "Where applicable law requires specific consent, Samsara Wellness will provide an appropriate consent mechanism." },
        { kind: "paragraph", text: "Participants must not photograph, record or distribute identifiable images or recordings of other participants without appropriate permission." },
      ],
    },
    {
      title: "10. Participant conduct",
      blocks: [
        { kind: "paragraph", text: "Participants must not:" },
        {
          kind: "list",
          items: [
            "engage in abusive, threatening, discriminatory or unlawful behaviour;",
            "harass Event staff, trainers, teachers, speakers or participants;",
            "disrupt an Event;",
            "share Event login credentials without permission;",
            "record or distribute paid Event content without permission;",
            "reproduce, sell or commercially exploit Event materials without written permission; or",
            "engage in conduct that compromises the safety, privacy or experience of others.",
          ],
        },
        { kind: "paragraph", text: "Samsara Wellness may remove a participant from an Event for violation of these Terms." },
      ],
    },
    {
      title: "11. Intellectual property",
      blocks: [
        { kind: "paragraph", text: "Event content, presentations, recordings, photographs, videos, graphics, branding, documents, materials and other content provided by Samsara Wellness or its authorised trainers, teachers or speakers are protected by applicable intellectual property laws." },
        { kind: "paragraph", text: "Participants may not reproduce, distribute, sell, publish or commercially exploit such content without prior written permission." },
      ],
    },
    {
      title: "12. Personal information",
      blocks: [
        { kind: "paragraph", text: "Information collected during Event registration and participation will be handled in accordance with the Samsara Wellness Event Privacy Policy." },
        { kind: "paragraph", text: "Information may be used for Event registration, login/access, attendance management, Event-related communication, internal administration and marketing/promotional communication in accordance with the applicable consent and applicable law." },
      ],
    },
    {
      title: "13. Marketing communications",
      blocks: [
        { kind: "paragraph", text: "Where applicable consent has been provided, Samsara Wellness may send information regarding:" },
        {
          kind: "list",
          items: [
            "upcoming Events and Retreats;",
            "wellness programmes;",
            "Samsara Wellness services;",
            "offers and promotions;",
            "educational content; and",
            "other Samsara Wellness activities.",
          ],
        },
        { kind: "paragraph", text: "Marketing consent may be withdrawn by contacting assist@samsarawellness.in." },
      ],
    },
    {
      title: "14. Third-party services",
      blocks: [
        { kind: "paragraph", text: "Events and Retreats may use third-party platforms, payment gateways, venues, accommodation providers, transportation providers, communication services or other service providers." },
        { kind: "paragraph", text: "Use of such services may be subject to the respective third party's terms and policies." },
      ],
    },
    {
      title: "15. Force majeure",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness shall not be responsible for delay, interruption, postponement or cancellation caused by circumstances beyond its reasonable control, including natural disasters, public emergencies, government restrictions, strikes, venue closures, technical failures, connectivity problems or other unforeseen circumstances." },
      ],
    },
    {
      title: "16. Limitation of liability",
      blocks: [
        { kind: "paragraph", text: "To the maximum extent permitted by applicable law, Samsaraa WellTek Pvt. Ltd. shall not be liable for indirect, incidental, special or consequential losses arising from participation in an Event." },
        { kind: "paragraph", text: "Nothing in these Terms excludes or limits liability that cannot legally be excluded or limited." },
      ],
    },
    {
      title: "17. Governing law and jurisdiction",
      blocks: [
        { kind: "paragraph", text: "These Terms shall be governed by the laws of India." },
        { kind: "paragraph", text: "Subject to applicable mandatory laws and consumer rights, courts having jurisdiction in Bengaluru, Karnataka, India, shall have jurisdiction over disputes arising from or relating to these Terms or an Event." },
      ],
    },
    {
      title: "18. Changes to these terms",
      blocks: [
        { kind: "paragraph", text: "Samsara Wellness may update these Terms from time to time to reflect changes in Events, services, technology, business practices or applicable law." },
        { kind: "paragraph", text: "The updated version will be published on the relevant Event registration page or website." },
      ],
    },
    {
      title: "19. Contact",
      blocks: [
        { kind: "paragraph", text: "Samsaraa WellTek Pvt. Ltd., Bengaluru, Karnataka, India. Brand: Samsara Wellness." },
        { kind: "paragraph", text: "General / Customer Support / Refunds: assist@samsarawellness.in" },
        { kind: "paragraph", text: "Legal Matters: legal@samsarawellness.in" },
      ],
    },
  ],
};
