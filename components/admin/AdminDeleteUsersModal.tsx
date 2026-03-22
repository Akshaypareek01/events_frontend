"use client";

import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

const CONFIRM_PHRASE = "DELETE";

export type DeleteModalUser = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  open: boolean;
  users: DeleteModalUser[];
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  busy: boolean;
};

/**
 * Centered destructive confirmation: type DELETE (GitHub-style) before enabling confirm.
 */
export function AdminDeleteUsersModal({ open, users, onCancel, onConfirm, busy }: Props) {
  const titleId = useId();
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const count = users.length;
  const single = count === 1;
  const canSubmit = typed === CONFIRM_PHRASE && !busy;
  const preview = users.slice(0, 8);
  const rest = count - preview.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onCancel()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="font-[family-name:var(--font-display)] text-xl text-[var(--color-danger)]"
        >
          {single ? "Delete this user?" : `Delete ${count} users?`}
        </h2>

        <div
          className={cn(
            "mt-4 rounded-xl border px-4 py-3 text-sm",
            "border-[var(--color-danger)]/40 bg-[var(--color-danger)]/8 text-[var(--color-text)]",
          )}
        >
          <p className="font-semibold text-[var(--color-danger)]">This cannot be undone.</p>
          <p className="mt-2 text-[var(--color-muted)]">
            Accounts will be removed permanently. Email and phone can be used again for new registrations
            only after deletion.
          </p>
        </div>

        <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]/40 p-3 text-sm">
          <ul className="space-y-1.5">
            {preview.map((u) => (
              <li key={u.id} className="break-all">
                <span className="font-medium text-[var(--color-text)]">{u.name}</span>
                <span className="text-[var(--color-muted)]"> — {u.email}</span>
              </li>
            ))}
            {rest > 0 && (
              <li className="text-[var(--color-muted)]">…and {rest} more</li>
            )}
          </ul>
        </div>

        <label htmlFor="admin-delete-confirm" className="mt-5 block text-sm font-medium text-[var(--color-text)]">
          Type <span className="font-mono font-semibold text-[var(--color-danger)]">{CONFIRM_PHRASE}</span> to
          confirm
        </label>
        <Input
          id="admin-delete-confirm"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          disabled={busy}
          className="mt-2 border-[var(--color-danger)]/30 focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/30"
        />

        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" disabled={busy} onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!canSubmit}
            onClick={() => void onConfirm()}
          >
            {busy ? (
              "Deleting…"
            ) : single ? (
              "Delete user"
            ) : (
              `Delete ${count} users`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
