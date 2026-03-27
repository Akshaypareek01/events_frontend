"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

type ClassRow = {
  id: string;
  title: string;
  timeLabel: string;
  zoomLink: string;
  type: "morning" | "evening";
  active: boolean;
};

function ClassEditorForm({
  c,
  onSaved,
  onDeleted,
}: {
  c: ClassRow;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [title, setTitle] = useState(c.title);
  const [timeLabel, setTimeLabel] = useState(c.timeLabel);
  const [zoomLink, setZoomLink] = useState(c.zoomLink);
  const [active, setActive] = useState(c.active);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setTitle(c.title);
    setTimeLabel(c.timeLabel);
    setZoomLink(c.zoomLink);
    setActive(c.active);
  }, [c.id, c.title, c.timeLabel, c.zoomLink, c.active]);

  async function save() {
    const token = getAdminToken();
    if (!token) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/classes/${c.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, timeLabel, zoomLink, active }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { message?: string };
        setErr(j.message ?? "Save failed");
        return;
      }
      setMsg("Saved.");
      onSaved();
    } catch {
      setErr("Network error");
    } finally {
      setSaving(false);
    }
  }

  async function removeClass() {
    const token = getAdminToken();
    if (!token) return;
    const ok = window.confirm(`Delete "${c.title}" class? This cannot be undone.`);
    if (!ok) return;
    setDeleting(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/classes/${c.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const j = (await res.json()) as { message?: string };
        setErr(j.message ?? "Delete failed");
        return;
      }
      onDeleted();
    } catch {
      setErr("Network error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className="space-y-3 p-4 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium">
          {c.type} · {c.title}
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          Active
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-[var(--color-muted)]">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--color-muted)]">Time label</label>
          <Input value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--color-muted)]">Zoom / join link</label>
        <Input
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          className="mt-1 font-mono text-xs"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" disabled={saving} onClick={() => void save()}>
          {saving ? <Spinner className="size-4" /> : "Save"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={deleting}
          onClick={() => void removeClass()}
        >
          {deleting ? <Spinner className="size-4" /> : "Delete"}
        </Button>
        {msg && <span className="text-xs text-[var(--color-success)]">{msg}</span>}
        {err && <span className="text-xs text-[var(--color-danger)]">{err}</span>}
      </div>
    </Card>
  );
}

function CreateClassForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [type, setType] = useState<"morning" | "evening">("morning");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function createClass() {
    const token = getAdminToken();
    if (!token) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/classes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, timeLabel, zoomLink, type, active }),
      });
      if (!res.ok) {
        const j = (await res.json()) as { message?: string };
        setErr(j.message ?? "Create failed");
        return;
      }
      setTitle("");
      setTimeLabel("");
      setZoomLink("");
      setType("morning");
      setActive(true);
      setMsg("Class created.");
      onCreated();
    } catch {
      setErr("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-3 p-4 text-sm">
      <p className="font-medium">Create class</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-[var(--color-muted)]">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-[var(--color-muted)]">Time label</label>
          <Input value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-[var(--color-muted)]">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "morning" | "evening")}
            className="mt-1 min-h-11 w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm text-[var(--color-text)]"
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-xs text-[var(--color-muted)]">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="accent-[var(--color-primary)]"
          />
          Active
        </label>
      </div>
      <div>
        <label className="text-xs font-medium text-[var(--color-muted)]">Zoom / join link</label>
        <Input
          value={zoomLink}
          onChange={(e) => setZoomLink(e.target.value)}
          className="mt-1 font-mono text-xs"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          disabled={saving || !title.trim() || !timeLabel.trim() || !zoomLink.trim()}
          onClick={() => void createClass()}
        >
          {saving ? <Spinner className="size-4" /> : "Create class"}
        </Button>
        {msg && <span className="text-xs text-[var(--color-success)]">{msg}</span>}
        {err && <span className="text-xs text-[var(--color-danger)]">{err}</span>}
      </div>
    </Card>
  );
}

/** Load and edit class session Zoom links. */
export function AdminClassLinksPanel() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const j = (await res.json()) as { classes?: ClassRow[]; message?: string };
      if (!res.ok) {
        setErr(j.message ?? "Failed to load classes");
        return;
      }
      setClasses(j.classes ?? []);
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (err) {
    return <p className="text-sm text-[var(--color-danger)]">{err}</p>;
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Update Zoom links and times for each session. Members see these links on the dashboard after
        they&apos;re approved and paid (or corporate).
      </p>
      <CreateClassForm onCreated={load} />
      {classes.map((c) => (
        <ClassEditorForm key={c.id} c={c} onSaved={load} onDeleted={load} />
      ))}
    </div>
  );
}
