"use client";

import { useEffect, useRef, useState } from "react";

export type WorkSearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; slugs: string[] }
  | { status: "unavailable" };

const FALLBACK_PILLS = [
  "AI UX",
  "User Research",
  "Design Leadership",
  "Accessibility",
  "Mentoring",
];

export default function WorkSearchBar({
  onStateChange,
}: {
  onStateChange: (state: WorkSearchState) => void;
}) {
  const [query, setQuery] = useState("");
  const [pills, setPills] = useState<string[]>(FALLBACK_PILLS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    fetch(`/api/work-search?q=${encodeURIComponent(trimmed)}`)
      .then((res) => res.json())
      .then((data: { slugs: string[] | null }) => {
        if (data.slugs === null) {
          onStateChange({ status: "unavailable" });
        } else {
          onStateChange({ status: "success", slugs: data.slugs });
        }
      })
      .catch(() => onStateChange({ status: "unavailable" }));
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

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {pills.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handlePillClick(label)}
            className="rounded-full bg-bg-tertiary px-4 py-3 font-body text-sm text-text-secondary transition-colors hover:bg-[#525252]"
          >
            {label}
          </button>
        ))}
      </div>
      <label className="w-full max-w-[205px]">
        <span className="sr-only">Search by skill</span>
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Or any other skill"
          className="w-full rounded-full border border-border-primary bg-transparent px-3 py-2 font-body text-base text-text-primary placeholder:text-text-tertiary focus:outline-none"
        />
      </label>
    </div>
  );
}
