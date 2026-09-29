/** Static copy for The Moon Within landing. CTAs are wired in the components, not here. */

export const moonExplore = [
  {
    icon: "🌙",
    title: "Two Cycles, Two Lenses",
    body: "Explore lunar and menstrual cycles as different frameworks for understanding rhythm and change.",
  },
  {
    icon: "🌸",
    title: "What Is Your Cycle Showing You?",
    body: "Explore the four phases of the menstrual cycle and the shifts that may accompany them.",
  },
  {
    icon: "🪷",
    title: "Reflection & Inner Listening",
    body: "A guided space to turn inward, listen and explore what you may need.",
  },
  {
    icon: "💗",
    title: "Patterns, Needs & Intuition",
    body: "Reflect on recurring experiences, boundaries, needs and inner knowing.",
  },
] as const;

export const moonWho = [
  "You want to understand your menstrual cycle more consciously",
  "You're curious about cyclical patterns",
  "You notice changes in your energy or emotions",
  "You want more space for self-reflection",
  "You're exploring women's wellbeing",
  "You want to reconnect with your own rhythm",
  "You're curious about lunar and menstrual cycles",
] as const;

export const moonSteps = [
  {
    num: "01",
    title: "Arrive",
    body: "Create a quiet space and arrive exactly as you are.",
  },
  {
    num: "02",
    title: "Explore",
    body: "Explore cycles, patterns, energy and inner experience through guided reflection.",
  },
  {
    num: "03",
    title: "Reflect",
    body: "Take away questions and insights you can continue exploring beyond the session.",
  },
] as const;

/**
 * Single source for The Moon Within start.
 * Dashboard join timing uses `startsAt` (26 Oct 2026, 19:30 IST).
 */
export const moonEvent = {
  title: "The Moon Within",
  subtitle: "Online Full Moon Circle for Women",
  dateLabel: "26th October 2026",
  startsAt: "2026-10-26T19:30:00+05:30",
} as const;

export const moonEventFacts = [
  moonEvent.dateLabel,
  "7:30pm IST onwards",
  "Online",
  "Women only",
] as const;

export const moonFaq = [
  {
    q: "What is The Moon Within?",
    a: "The Moon Within is an online full moon circle for women, offering guided reflection on lunar rhythms, the menstrual cycle and inner experience.",
  },
  {
    q: "Is this an online event?",
    a: "Yes. The circle is held fully online, so you can join from wherever feels comfortable to you.",
  },
  {
    q: "Do I need to track my menstrual cycle?",
    a: "No. Cycle tracking isn't required — the session is a starting point for curiosity, not a data review.",
  },
  {
    q: "Do I need prior meditation experience?",
    a: "Not at all. The circle is welcoming to anyone, regardless of previous meditation, cycle-tracking or circle experience.",
  },
  {
    q: "What should I bring?",
    a: "Just yourself, a quiet space, and anything that helps you feel comfortable — a journal, a cushion or a warm drink.",
  },
  {
    q: "Is this a medical or diagnostic session?",
    a: "No. The Moon Within is a reflective, educational space and is not a substitute for medical advice or diagnosis.",
  },
  {
    q: "Who can attend?",
    a: "This circle is open to women who are curious about their cyclical nature, at any stage of their menstrual journey.",
  },
] as const;

export const SAMSARA_SITE = "https://www.samsarawellness.in";
