"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { FIGMA_FALLBACK_PILLS as FALLBACK_PILLS } from "@/lib/work-search-pills";

export type WorkSearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; slugs: string[] }
  | { status: "unavailable" };

export default function WorkSearchBar({
  onStateChange,
}: {
  onStateChange: (state: WorkSearchState) => void;
}) {
  const [query, setQuery] = useState("");
  const [pills, setPills] = useState<string[]>(FALLBACK_PILLS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    fetch("/api/work-search")
      .then((res) => res.json())
      .then((data: { pills?: string[] }) => {
        if (data.pills && data.pills.length > 0) setPills(data.pills);
      })
      .catch(() => {});
  }, []);

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      onStateChange({ status: "idle" });
      return;
    }
    onStateChange({ status: "loading" });
    const requestId = ++requestIdRef.current;
    fetch(`/api/work-search?q=${encodeURIComponent(trimmed)}`)
      .then(async (res) => {
        if (requestIdRef.current !== requestId) return;
        if (!res.ok) {
          onStateChange({ status: "unavailable" });
          return;
        }
        const data: { slugs: string[] | null } = await res.json();
        if (requestIdRef.current !== requestId) return;
        if (data.slugs === null) {
          onStateChange({ status: "unavailable" });
        } else {
          onStateChange({ status: "success", slugs: data.slugs });
        }
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        onStateChange({ status: "unavailable" });
      });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(value), 500);
  };

  const handlePillClick = (label: string) => {
    setQuery(label);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runSearch(label);
  };

  const handleClear = () => {
    setQuery("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    requestIdRef.current += 1;
    onStateChange({ status: "idle" });
  };

  return (
    <div role="search" className="flex w-full flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {pills.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handlePillClick(label)}
            className="rounded-full bg-bg-tertiary px-4 py-3 font-body text-base text-text-secondary transition-colors hover:bg-[#525252]"
          >
            <span className="inline-block first-letter:uppercase">{label}</span>
          </button>
        ))}
      </div>
      <label className="relative w-full max-w-[205px]">
        <Icon
          name="ai_search"
          aria-hidden
          size={24}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-tertiary"
        />
        <input
          type="text"
          aria-label="Search by skill"
          data-cursor="hover"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Or any other skill"
          className="w-full rounded-full border border-border-primary bg-transparent py-3 pr-11 pl-11 font-body text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            data-cursor="clear"
            className="absolute top-1/2 right-0 z-[999] flex h-12 w-12 -translate-y-1/2 items-center justify-center text-text-tertiary transition-colors hover:text-text-primary"
          >
            <Icon name="cancel" aria-hidden size={24} />
          </button>
        )}
      </label>
    </div>
  );
}
