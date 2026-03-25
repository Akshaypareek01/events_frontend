"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoginSplitLayout } from "@/components/auth/LoginSplitLayout";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { setTeacherToken } from "@/lib/auth";

/** Username + password — same split layout & styling as participant `/login`. */
export function TeacherLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const inputClass =
    "w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const res = await fetch(`${getApiBaseUrl()}/api/v1/teacher/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json()) as { token?: string; message?: string };
      if (!res.ok || !data.token) {
        setErr(data.message ?? "Login failed");
        return;
      }
      setTeacherToken(data.token);
      router.push("/teacher/dashboard");
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <LoginSplitLayout>
      <h1 className="mb-1 text-center text-3xl font-bold text-gray-900">Teacher login</h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        Sign in with the username and password from your admin
      </p>

      <form onSubmit={onSubmit}>
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Username <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                id="t-user"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Your teacher username"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              Password <span className="text-orange-500">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                id="t-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {err && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">{err}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {busy ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner className="size-4 border-t-white" />
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Participant (email OTP)?{" "}
        <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-600">
          Participant login
        </Link>
      </p>
    </LoginSplitLayout>
  );
}
