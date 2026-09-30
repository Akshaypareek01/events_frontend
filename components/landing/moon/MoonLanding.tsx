import Image from "next/image";
import Link from "next/link";
import { AppDownloadBanner } from "@/components/landing/moon/AppDownloadBanner";
import { MoonCta } from "@/components/landing/moon/MoonCta";
import { MoonHeader } from "@/components/landing/moon/MoonHeader";
import {
  SAMSARA_SITE,
  moonEvent,
  moonExplore,
  moonFaq,
  moonSteps,
  moonWho,
} from "@/components/landing/moon/content";

const display = "font-[family-name:var(--font-display)]";

/**
 * The Moon Within marketing page. Visual only — registration and login stay on existing routes.
 */
export function MoonLanding() {
  return (
    <div className="bg-[#f4f1ec] text-gray-900">
      <MoonHeader />
      <main>
        <Hero />
        <TrustStrip />
        <Intro />
        <Cycles />
        <Explore />
        <Story />
        <Who />
        <Journey />
        <EventCard />
        <HostedBy />
        <Faq />
        <FinalCta />
        <AppDownloadBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section aria-labelledby="moon-title" className="bg-[#fbf6ef]">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-2 lg:py-16">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-bold tracking-[0.14em] text-orange-700">
            ONLINE FULL MOON CIRCLE FOR WOMEN
          </p>
          <h1 id="moon-title" className={`${display} mt-3 text-4xl font-medium leading-tight sm:text-5xl`}>
            The Moon Within
          </h1>
          <p className={`${display} mt-4 text-lg text-gray-800`}>
            There is a moon above you. And there is another rhythm within you.
          </p>
          <p className="mt-4 max-w-xl text-gray-600">
            Have you noticed how the same emotions, needs or patterns seem to return again and again?
            Explore what your cyclical nature may reveal through a guided online experience exploring lunar
            rhythms, menstrual cycle awareness and inner reflection.
          </p>
          <p className="mt-5 text-xs font-bold tracking-wide text-orange-700">
            ONLINE · WOMEN ONLY · FULL MOON SPECIAL
          </p>
          <div className="mt-6 flex justify-center lg:justify-start">
            <MoonCta>Join the Circle</MoonCta>
          </div>
        </div>
        <div className="relative order-1 -mx-4 aspect-[4/5] w-[calc(100%+2rem)] max-w-none overflow-hidden sm:-mx-6 sm:w-[calc(100%+3rem)] lg:order-2 lg:mx-0 lg:w-full lg:rounded-3xl lg:shadow-[0_18px_50px_rgba(28,25,20,0.12)]">
          <Image
            src="/moon/hero.webp"
            alt="Woman sitting by moonlit water, hosting The Moon Within circle"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = ["Full Moon Special", "Women Only", "100% Online", "Guided Reflection"];
  return (
    <section aria-label="Event highlights" className="bg-orange-500 text-white">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 py-4 text-sm font-semibold">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function Intro() {
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
      <h2 className={`${display} text-3xl font-medium leading-snug sm:text-4xl`}>
        There is a rhythm
        <br />
        within you.
      </h2>
      <div>
        <p className={`${display} text-xl font-medium`}>
          The moon changes. Our energy changes. Our needs change.
        </p>
        <p className="mt-4 text-gray-600">
          The Moon Within invites you to slow down and become curious about the rhythms within you.
          Together, we&apos;ll explore the lunar cycle and menstrual cycle as two different lenses for
          reflecting on change, energy, emotions, needs and inner experience.
        </p>
        <a
          href="#explore"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-orange-500 bg-white px-8 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white"
        >
          Explore the Experience
        </a>
      </div>
    </section>
  );
}

function Cycles() {
  return (
    <section className="bg-white py-16" aria-labelledby="cycles-title">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 id="cycles-title" className={`${display} text-3xl font-medium`}>
            Two cycles. Two lenses.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <CycleCard
              title="Lunar Cycle"
              phases={["New Moon", "Waxing", "Full Moon", "Waning"]}
              body="A natural rhythm of changing light and phases."
            />
            <CycleCard
              title="Menstrual Cycle"
              phases={["Menstruation", "Follicular", "Ovulation", "Luteal"]}
              body="A biological cycle that can involve changing physical and emotional experiences."
            />
          </div>
          <p className={`${display} mt-6 text-lg`}>
            Different cycles. Different processes. A shared invitation to notice rhythm and change.
          </p>
        </div>
        <Image
          src="/moon/cycles.webp"
          alt="Woman meditating between night and day, with moon phases and blossoms"
          width={300}
          height={300}
          className="mx-auto w-full max-w-xs"
        />
      </div>
    </section>
  );
}

/** One cycle card: phase chips plus a short description. */
function CycleCard({ title, phases, body }: { title: string; phases: string[]; body: string }) {
  return (
    <article className="rounded-2xl border border-orange-100 bg-[#fbf6ef] p-5">
      <h3 className="text-lg font-semibold text-orange-800">{title}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {phases.map((phase) => (
          <li key={phase} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700">
            {phase}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-gray-600">{body}</p>
    </article>
  );
}

function Explore() {
  return (
    <section id="explore" aria-labelledby="explore-title" className="scroll-mt-20 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="explore-title" className={`${display} text-center text-3xl font-medium`}>
          What&apos;s inside the circle?
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {moonExplore.map((item) => (
            <article key={item.title} className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
              <p className="text-2xl" aria-hidden="true">
                {item.icon}
              </p>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
        <Image
          src="/moon/journal.webp"
          alt="Woman journaling by the water at sunset, pausing to reflect"
          width={300}
          height={300}
          className="w-56"
        />
        <h2 className={`${display} mt-6 text-3xl font-medium`}>Pause. Reflect. Listen.</h2>
        <p className="mt-3 max-w-sm text-gray-600">
          You don&apos;t need to arrive with answers. You simply need to arrive as you are.
        </p>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section aria-labelledby="who-title" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="who-title" className={`${display} text-center text-3xl font-medium`}>
          This circle is for you if...
        </h2>
        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-2">
          {moonWho.map((item) => (
            <li key={item} className="flex gap-3 rounded-2xl bg-white px-4 py-4 text-sm shadow-sm">
              <span className="font-bold text-orange-500" aria-hidden="true">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-gray-500">
          No previous experience with meditation, cycle tracking or women&apos;s circles is required.
        </p>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="journey-title" className={`${display} text-center text-3xl font-medium`}>
          Your journey through The Moon Within
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {moonSteps.map((step) => (
            <li key={step.num} className="text-center">
              <p className={`${display} text-4xl text-orange-300`}>{step.num}</p>
              <h3 className="mt-2 text-sm font-bold tracking-wide text-orange-800">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const eventDetails = [
  { label: "Date", value: moonEvent.dateLabel },
  { label: "Time", value: "7:30pm IST onwards" },
  { label: "Format", value: "Online" },
  { label: "Who", value: "Women only" },
] as const;

function EventCard() {
  return (
    <section id="event" aria-labelledby="event-title" className="scroll-mt-20 border-y border-orange-100 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="text-xs font-bold tracking-[0.14em] text-orange-700">FULL MOON CIRCLE</p>
          <h2 id="event-title" className={`${display} mt-3 text-4xl font-medium leading-tight sm:text-5xl`}>
            {moonEvent.title}
          </h2>
          <p className="mt-4 max-w-md text-lg text-gray-600">{moonEvent.subtitle}</p>
          <p className="mt-3 max-w-md text-gray-600">
            One evening online. Arrive as you are — no prior circle or meditation experience needed.
          </p>
          <div className="mt-8">
            <MoonCta>Join the Circle</MoonCta>
          </div>
        </div>

        <dl className="overflow-hidden rounded-3xl border border-orange-100 bg-[#fbf6ef] shadow-[0_18px_50px_rgba(28,25,20,0.06)]">
          <div className="border-b border-orange-100 bg-white px-6 py-5 sm:px-8">
            <p className="text-xs font-bold tracking-[0.14em] text-orange-700">WHEN AND WHERE</p>
            <p className={`${display} mt-1 text-2xl font-medium`}>26 October, evening</p>
          </div>
          {eventDetails.map((row) => (
            <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-orange-100/80 px-6 py-4 last:border-b-0 sm:px-8">
              <dt className="text-sm font-medium text-gray-500">{row.label}</dt>
              <dd className="text-sm font-semibold text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function HostedBy() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h2 className={`${display} text-3xl font-medium`}>Hosted by Samsara Wellness</h2>
      <p className="mt-2 text-sm font-bold tracking-wide text-orange-700">
        YOGA · AYURVEDA · MENTAL WELLBEING
      </p>
      <p className="mt-4 text-gray-600">
        Samsara Wellness is an AI-powered holistic wellness platform integrating Yoga, Ayurveda and
        Mental Wellbeing. We combine ancient wisdom with modern technology to create personalised
        wellness experiences, including live Yoga and Meditation, Dosha Analysis, mood and health
        tracking, and women&apos;s wellness support.
      </p>
      <a
        href={SAMSARA_SITE}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-orange-500 px-8 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-500 hover:text-white"
      >
        Explore Samsara Wellness
      </a>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 id="faq-title" className={`${display} text-center text-3xl font-medium`}>
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-orange-100">
          {moonFaq.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-xl text-orange-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-4 text-sm text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold text-orange-700">Your rhythm is worth listening to.</p>
      <h2 className={`${display} mt-2 text-4xl font-medium`}>Explore. Reflect. Reconnect.</h2>
      <p className="mt-3 text-gray-600">The Moon Within — an online full moon circle for women</p>
      <div className="mt-6">
        <MoonCta>Join the Circle</MoonCta>
      </div>
      <p className="mt-4 text-sm text-gray-500">Hosted by Samsara Wellness</p>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Image
            src="/samsaralogomain.png"
            alt="Samsara Wellness"
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <p className="mt-2 text-sm text-gray-500">Yoga · Ayurveda · Mental Wellbeing</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
          <a href={SAMSARA_SITE} target="_blank" rel="noreferrer" className="hover:text-orange-600">
            About
          </a>
          <a href="mailto:legal@samsarawellness.com" className="hover:text-orange-600">
            Contact
          </a>
          <Link href="/privacy-policy" className="hover:text-orange-600">
            Privacy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-orange-600">
            Terms
          </Link>
          <Link href="/login" className="hover:text-orange-600">
            Login
          </Link>
          <Link href="/register" className="hover:text-orange-600">
            Register
          </Link>
        </nav>
      </div>
      <p className="border-t border-orange-50 py-4 text-center text-xs text-gray-400">
        Copyright© 2026 Samsaraa Wellness Pvt Ltd. All rights reserved.
      </p>
    </footer>
  );
}
