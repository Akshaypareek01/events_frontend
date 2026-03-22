import { Card } from "@/components/ui/Card";
import { LandingHeroActions } from "@/components/landing/LandingHeroActions";
import { LandingPricingCta } from "@/components/landing/LandingPricingCta";
import { MarketingShell } from "@/components/layout/MarketingShell";

export default function Home() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden border-b border-[var(--color-border)]">
        <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Live · Online · 3 months
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--color-text)] sm:text-5xl">
            A calmer body &amp; steadier mind — twice a day, with your cohort.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
            Morning and evening sessions on Zoom. Structured progression, human guidance, and a
            rhythm you can actually keep.
          </p>
          <LandingHeroActions />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] sm:text-3xl">
          Why join
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              t: "Daily accountability",
              d: "Two live touchpoints so the habit sticks — not a library you never open.",
            },
            { t: "Guided & safe", d: "Clear cues, modifications, and a host who actually sees the room." },
            { t: "Cohort energy", d: "Practice alongside others for three months — momentum compounds." },
          ].map((item) => (
            <Card key={item.t} className="p-5">
              <h3 className="font-medium text-[var(--color-text)]">{item.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="schedule" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]/50">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] sm:text-3xl">
            Class timings
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">All times in IST · Join links unlock after registration.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                Morning
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">07:00 AM</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Energize, open the breath, set intention.</p>
            </Card>
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
                Evening
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">07:00 PM</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Wind down, restore, sleep deeper.</p>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-8 rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-muted)]/40 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)] sm:text-3xl">
              Pricing
            </h2>
            <p className="mt-2 text-[var(--color-muted)]">
              <span className="font-semibold text-[var(--color-text)]">₹499</span> for the full program.
              <br />
              <span className="text-[var(--color-primary)]">Corporate participants</span> are covered by the
              company — no individual payment.
            </p>
          </div>
          <LandingPricingCta />
        </div>
      </section>
    </MarketingShell>
  );
}
