import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { MarketingShell } from "@/components/layout/MarketingShell";

type SearchParams = Promise<{ kind?: string }>;

export default async function RegisterSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { kind } = await searchParams;
  const corporate = kind === "corporate";

  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <Card>
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text)]">
            You&apos;re in
          </h1>
          {corporate ? (
            <p className="mt-4 text-[var(--color-muted)]">
              Your corporate access is active. Dashboard login arrives in Phase 07 — for now, watch for
              email updates (Phase 06).
            </p>
          ) : (
            <p className="mt-4 text-[var(--color-muted)]">
              Registration saved. Complete payment (₹499) when we wire Cashfree — you&apos;ll get a link by
              email (stub logged on the server today).
            </p>
          )}
          <Link
            href="/"
            className="mt-8 inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-primary-fg)]"
          >
            Back to home
          </Link>
        </Card>
      </div>
    </MarketingShell>
  );
}
