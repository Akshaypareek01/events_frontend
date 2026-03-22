import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DashboardUser = {
  userType: "normal" | "corporate";
  paymentStatus: "pending" | "paid" | "free";
  isApproved: boolean;
};

type BadgeTone = "success" | "neutral" | "accent";

const toneClass: Record<BadgeTone, string> = {
  success:
    "border-[var(--color-success)]/35 bg-[var(--color-success)]/12 text-[var(--color-success)]",
  neutral:
    "border-[var(--color-border)] bg-[var(--color-surface-muted)]/80 text-[var(--color-muted)]",
  accent:
    "border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
};

function Badge({ children, tone }: { children: ReactNode; tone: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}

/**
 * Corporate label first (when applicable), then verification and payment status.
 * No “Individual” label; no corporate “free” copy.
 */
export function UserStatusBadges({ user }: { user: DashboardUser }) {
  const showPaymentLine =
    user.paymentStatus === "paid" || user.paymentStatus === "pending";

  return (
    <div className="flex flex-col gap-3" aria-label="Account status">
      {user.userType === "corporate" && (
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">Corporate</Badge>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {user.isApproved ? (
          <Badge tone="success">Verified member</Badge>
        ) : (
          <Badge tone="neutral">Pending verification</Badge>
        )}

        {showPaymentLine && (
          <Badge tone={user.paymentStatus === "paid" ? "success" : "neutral"}>
            {user.paymentStatus === "paid" ? "Payment complete" : "Payment pending"}
          </Badge>
        )}
      </div>
    </div>
  );
}
