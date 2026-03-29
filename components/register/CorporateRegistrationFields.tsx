"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { FieldError } from "@/components/ui/FieldError";
import { getApiBaseUrl } from "@/lib/api";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { CompanySearchCombobox, type CompanyOption } from "./CompanySearchCombobox";

type Props = {
  inputClass: string;
  labelClass: string;
  corporateCompanyId: string;
  onCorporateCompanyIdChange: (id: string) => void;
  couponCode: string;
  onCouponCodeChange: (v: string) => void;
  fieldErrors: Record<string, string>;
};

type CompaniesResponse = { companies?: CompanyOption[]; hasMore?: boolean; message?: string };

/** Company search (server-paginated) + coupon for corporate registration. */
export function CorporateRegistrationFields({
  inputClass,
  labelClass,
  corporateCompanyId,
  onCorporateCompanyIdChange,
  couponCode,
  onCouponCodeChange,
  fieldErrors,
}: Props) {
  const [query, setQuery] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const prevCompanyId = useRef<string>("");
  /** After the first request finishes, later requests use the inline spinner only. */
  const fetchPassDone = useRef(false);

  const debouncedQuery = useDebouncedValue(query, 280);

  /** While the user types ahead of debounce, narrow the last server page locally so the list stays relevant. */
  const displayCompanies = useMemo(() => {
    const t = query.trim().toLowerCase();
    const d = debouncedQuery.trim().toLowerCase();
    if (t === d || !t) return companies;
    return companies.filter((c) => c.name.toLowerCase().includes(t));
  }, [companies, query, debouncedQuery]);

  const displayHasMore = hasMore && query.trim().toLowerCase() === debouncedQuery.trim().toLowerCase();

  /** When selection is cleared from parent (e.g. user type = Individual), reset search text. */
  useEffect(() => {
    const previous = prevCompanyId.current;
    prevCompanyId.current = corporateCompanyId;
    if (!corporateCompanyId && previous) {
      setQuery("");
    }
  }, [corporateCompanyId]);

  useEffect(() => {
    const ac = new AbortController();
    let cancelled = false;

    (async () => {
      if (!fetchPassDone.current) {
        setLoading(true);
      } else {
        setFetching(true);
      }
      setLoadErr(null);
      try {
        const u = new URL(`${getApiBaseUrl()}/api/v1/register/corporate-companies`);
        u.searchParams.set("q", debouncedQuery);
        u.searchParams.set("limit", "50");
        if (corporateCompanyId) {
          u.searchParams.set("include", corporateCompanyId);
        }
        const res = await fetch(u.toString(), { signal: ac.signal });
        const data = (await res.json()) as CompaniesResponse;
        if (!res.ok) {
          if (!cancelled) {
            setLoadErr(data.message ?? "Could not load companies");
            setCompanies([]);
            setHasMore(false);
          }
          return;
        }
        if (!cancelled) {
          setCompanies(data.companies ?? []);
          setHasMore(Boolean(data.hasMore));
        }
      } catch (e: unknown) {
        if ((e as Error).name === "AbortError") return;
        if (!cancelled) {
          setLoadErr("Network error loading companies");
          setCompanies([]);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setFetching(false);
          fetchPassDone.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [debouncedQuery, corporateCompanyId]);

  return (
    <div className="space-y-5 border-t border-gray-100 pt-5">
      <p className="text-sm text-gray-600">
        Search for your organisation and enter the <strong>coupon code</strong> your employer shared. You may use any
        email (including Gmail).
      </p>

      {loadErr && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {loadErr}
        </p>
      )}

      {loading && companies.length === 0 ? (
        <div>
          <span className={labelClass}>
            Company <span className="text-orange-500">*</span>
          </span>
          <div className={`${inputClass} mt-1.5 flex items-center justify-center gap-2 py-3`}>
            <Spinner className="size-4 border-orange-200 border-t-orange-500" />
            <span className="text-sm text-gray-500">Loading companies…</span>
          </div>
        </div>
      ) : (
        <CompanySearchCombobox
          id="corporateCompanyId"
          labelClass={labelClass}
          inputClass={inputClass}
          query={query}
          onQueryChange={setQuery}
          companies={displayCompanies}
          valueId={corporateCompanyId}
          onValueChange={onCorporateCompanyIdChange}
          loading={false}
          fetching={fetching}
          error={fieldErrors.corporateCompanyId}
          remote
          hasMore={displayHasMore}
          label={
            <>
              Company <span className="text-orange-500">*</span>
            </>
          }
        />
      )}

      <div>
        <label htmlFor="corporateCouponCode" className={labelClass}>
          Company coupon code <span className="text-orange-500">*</span>
        </label>
        <input
          id="corporateCouponCode"
          name="corporateCouponCode"
          autoComplete="off"
          placeholder="Provided by your organisation"
          value={couponCode}
          onChange={(e) => onCouponCodeChange(e.target.value)}
          required
          className={inputClass}
        />
        <FieldError>{fieldErrors.corporateCouponCode}</FieldError>
      </div>
    </div>
  );
}
