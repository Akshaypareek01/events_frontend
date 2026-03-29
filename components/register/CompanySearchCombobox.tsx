"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { Spinner } from "@/components/ui/Spinner";

export type CompanyOption = { id: string; name: string };

type Props = {
  id: string;
  labelClass: string;
  inputClass: string;
  /** Current input text (controlled). */
  query: string;
  onQueryChange: (q: string) => void;
  companies: CompanyOption[];
  valueId: string;
  onValueChange: (id: string) => void;
  loading?: boolean;
  /** True while a debounced remote fetch is in flight (shows input spinner). */
  fetching?: boolean;
  error?: string;
  label: ReactNode;
  /**
   * When true, `companies` is already filtered server-side — do not filter again locally.
   */
  remote?: boolean;
  /** More rows exist server-side than returned; show hint under the scroll area. */
  hasMore?: boolean;
};

/**
 * Searchable company picker. With `remote`, parent loads capped pages via API; list stays a fixed max height and scrolls.
 */
export function CompanySearchCombobox({
  id,
  labelClass,
  inputClass,
  query,
  onQueryChange,
  companies,
  valueId,
  onValueChange,
  loading = false,
  fetching = false,
  error,
  label,
  remote = false,
  hasMore = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = `${id}-listbox`;

  const normalized = query.trim().toLowerCase();
  const filtered =
    remote || !normalized
      ? companies
      : companies.filter((c) => c.name.toLowerCase().includes(normalized));

  useEffect(() => {
    setHighlight((h) => (filtered.length ? Math.min(h, filtered.length - 1) : 0));
  }, [filtered.length]);

  /** Keep highlighted option visible inside the scrollable list. */
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-option-index="${highlight}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [highlight, open, filtered.length]);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close();
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [close]);

  function pick(c: CompanyOption) {
    onValueChange(c.id);
    onQueryChange(c.name);
    close();
  }

  function onInputChange(v: string) {
    onQueryChange(v);
    setOpen(true);
    if (valueId) {
      const current = companies.find((c) => c.id === valueId);
      if (!current || v.trim() !== current.name.trim()) {
        onValueChange("");
      }
    }
    setHighlight(0);
  }

  function onBlurInput() {
    window.setTimeout(() => {
      close();
      const t = query.trim();
      if (!t) {
        onValueChange("");
        return;
      }
      const exact = companies.find((c) => c.name.toLowerCase() === t.toLowerCase());
      if (exact) pick(exact);
    }, 150);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && filtered.length) {
      e.preventDefault();
      pick(filtered[highlight]!);
    }
  }

  const showList = open && !loading && (remote ? true : companies.length > 0);

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={loading}
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={onBlurInput}
          onKeyDown={onKeyDown}
          placeholder={loading ? "Loading companies…" : "Type to search companies…"}
          className={`${inputClass} ${fetching ? "pr-11" : ""}`}
        />
        {fetching && !loading && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <Spinner className="size-4 border-gray-200 border-t-orange-500" />
          </span>
        )}
      </div>
      {showList && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-[min(20rem,55vh)] w-full overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white py-1 shadow-lg [scrollbar-gutter:stable]"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-gray-500">
              {remote && query.trim() === ""
                ? "No companies available yet."
                : remote
                  ? "No matching company — try a different search."
                  : "No matching company."}
            </li>
          ) : (
            filtered.map((c, i) => (
              <li key={c.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  data-option-index={i}
                  aria-selected={c.id === valueId}
                  className={`flex w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-800 ${
                    i === highlight ? "bg-orange-50 text-orange-900" : "hover:bg-gray-50"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pick(c)}
                >
                  {c.name}
                </button>
              </li>
            ))
          )}
          {hasMore && filtered.length > 0 && (
            <li className="border-t border-gray-100 px-4 py-2 text-xs text-gray-500" role="note">
              Showing top matches — keep typing to narrow results.
            </li>
          )}
        </ul>
      )}
      <FieldError>{error}</FieldError>
    </div>
  );
}
