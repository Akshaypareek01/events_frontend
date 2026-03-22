import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { MarketingShell } from "@/components/layout/MarketingShell";

export default function UiPreviewPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-12 sm:px-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-3xl">UI preview</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Phase 02 primitives — dev only.</p>
        </div>
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            Inputs
          </h2>
          <Input placeholder="Email" type="email" />
          <FieldError>This field has an error</FieldError>
        </Card>
        <Card className="flex items-center gap-3">
          <Spinner />
          <span className="text-sm text-[var(--color-muted)]">Loading state</span>
        </Card>
      </div>
    </MarketingShell>
  );
}
