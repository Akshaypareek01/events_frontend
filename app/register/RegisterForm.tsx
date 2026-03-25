"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { FieldError } from "@/components/ui/FieldError";
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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

  const inputClass =
    "w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100";

  const labelClass = "block mb-1.5 text-sm font-semibold text-gray-700";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* User Type */}
      <div>
        <label htmlFor="userType" className={labelClass}>
          User Type <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className={`${inputClass} appearance-none cursor-pointer pr-10`}
          >
            <option value="normal">Individual</option>
            <option value="corporate">Corporate</option>
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Full Name <span className="text-orange-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          minLength={2}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
        <FieldError>{fieldErrors.name}</FieldError>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          {userType === "corporate" ? "Work Email" : "Email Address"}{" "}
          <span className="text-orange-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={userType === "corporate" ? "you@company.com" : "john.doe@example.com"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
        <FieldError>{fieldErrors.email}</FieldError>
      </div>

      {/* Mobile Number */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Mobile Number <span className="text-orange-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className={inputClass}
        />
        <FieldError>{fieldErrors.phone}</FieldError>
      </div>

      {/* City */}
      <div>
        <label htmlFor="city" className={labelClass}>
          City <span className="text-orange-500">*</span>
        </label>
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          minLength={2}
          placeholder="Bangalore"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={inputClass}
        />
        <FieldError>{fieldErrors.city}</FieldError>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className={labelClass}>
          Country <span className="text-orange-500">*</span>
        </label>
        <div className="relative">
          <select
            id="country"
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`${inputClass} appearance-none cursor-pointer pr-10`}
          >
            <option value="" disabled>
              Select country
            </option>
            {countrySelectOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        <FieldError>{fieldErrors.country}</FieldError>
      </div>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 accent-orange-500"
        />
        <label htmlFor="terms" className="cursor-pointer text-sm text-gray-600">
          I agree to the{" "}
          <a href="#" className="text-orange-500 underline hover:text-orange-600">
            Terms and Conditions
          </a>{" "}
          &amp;{" "}
          <a href="#" className="text-orange-500 underline hover:text-orange-600">
            Privacy Policy
          </a>
        </label>
      </div>

      {formError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {formError}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-orange-500 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:bg-orange-700 disabled:opacity-60"
      >
        {submitting ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner className="size-4 border-t-white" />
            Submitting…
          </span>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}