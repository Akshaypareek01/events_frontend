"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/FieldError";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { getApiBaseUrl } from "@/lib/api";
import { COUNTRY_OPTIONS } from "@/lib/countries";

type UserType = "normal" | "corporate";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [userType, setUserType] = useState<UserType>("normal");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const countrySelectOptions = useMemo(
    () => COUNTRY_OPTIONS.map((c) => ({ value: c, label: c })),
    [],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const n = name.trim();
      const em = email.trim();
      const ph = phone.trim();
      const ci = city.trim();
      if (!n || !em || !ph || !ci || !country) {
        setFormError("Please complete all required fields.");
        return;
      }
      const body = {
        name: n,
        email: em,
        phone: ph,
        city: ci,
        country,
        userType,
      };
      const res = await fetch(`${getApiBaseUrl()}/api/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        userId?: string;
        payToken?: string;
        message?: string;
        code?: string;
        details?: { fieldErrors?: Record<string, string[]> };
      };
      if (!res.ok) {
        if (data.details?.fieldErrors) {
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.details.fieldErrors)) {
            if (v?.[0]) next[k] = v[0];
          }
          setFieldErrors(next);
        }
        if (res.status === 403 && data.code === "CORPORATE_NOT_AUTHORIZED") {
          setFormError(
            `${data.message ?? "Your work email is not on our authorized list."} You can switch to Individual below to pay and join.`,
          );
        } else {
          setFormError(data.message ?? "Could not register");
        }
        return;
      }
      if (userType === "corporate") {
        router.push("/register/success?kind=corporate");
      } else if (data.userId && data.payToken) {
        router.push(
          `/pay?userId=${encodeURIComponent(data.userId)}&token=${encodeURIComponent(data.payToken)}`,
        );
      } else if (data.userId) {
        router.push(`/pay?userId=${encodeURIComponent(data.userId)}`);
      } else {
        router.push("/register/success?kind=normal");
      }
    } catch {
      setFormError("Network error — is the API running?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-[var(--color-text)]">
          User type <span className="text-[var(--color-danger)]">*</span>
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="userType"
              value="normal"
              checked={userType === "normal"}
              onChange={() => setUserType("normal")}
              className="accent-[var(--color-primary)]"
            />
            Individual
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="userType"
              value="corporate"
              checked={userType === "corporate"}
              onChange={() => setUserType("corporate")}
              className="accent-[var(--color-primary)]"
            />
            Corporate
          </label>
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-text)]">
          Full name <span className="text-[var(--color-danger)]">*</span>
        </label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FieldError>{fieldErrors.name}</FieldError>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-text)]">
          {userType === "corporate" ? "Work email" : "Email"}{" "}
          <span className="text-[var(--color-danger)]">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={userType === "corporate" ? "you@company.com" : undefined}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FieldError>{fieldErrors.email}</FieldError>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-[var(--color-text)]">
          Mobile number <span className="text-[var(--color-danger)]">*</span>
        </label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit mobile"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <FieldError>{fieldErrors.phone}</FieldError>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium text-[var(--color-text)]">
            City <span className="text-[var(--color-danger)]">*</span>
          </label>
        <Input
          id="city"
          name="city"
          autoComplete="address-level2"
          minLength={2}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
          <FieldError>{fieldErrors.city}</FieldError>
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium text-[var(--color-text)]">
            Country <span className="text-[var(--color-danger)]">*</span>
          </label>
          <Select
            id="country"
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            options={countrySelectOptions}
            placeholder="Select country"
          />
          <FieldError>{fieldErrors.country}</FieldError>
        </div>
      </div>

      {formError && (
        <p className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-3 py-2 text-sm text-[var(--color-danger)]">
          {formError}
        </p>
      )}

      <Button type="submit" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="size-4 border-t-[var(--color-primary-fg)]" />
            Submitting…
          </span>
        ) : (
          "Submit registration"
        )}
      </Button>
    </form>
  );
}
