import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm font-medium text-[var(--color-primary)]">
          <Link href="/" className="hover:underline">
            ← Back
          </Link>
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl text-[var(--color-text)]">
          Register
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          We&apos;ll save your details first. Individual users continue to payment next; corporate accounts
          are approved by your coordinator.
        </p>
        <Card className="mt-8">
          <RegisterForm />
        </Card>
      </div>
    </MarketingShell>
  );
}
