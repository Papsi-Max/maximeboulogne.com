"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import WorkCard from "@/components/WorkCard";
import WorkCardSkeleton from "@/components/WorkCardSkeleton";
import WorkSearchBar, { type WorkSearchState } from "@/components/WorkSearchBar";
import { workItems } from "@/data/work";

export default function WorkPage() {
  const [searchState, setSearchState] = useState<WorkSearchState>({ status: "idle" });

  const visibleItems = useMemo(() => {
    if (searchState.status === "success") {
      const slugSet = new Set(searchState.slugs);
      return workItems.filter((item) => slugSet.has(item.slug));
    }
    return workItems;
  }, [searchState]);

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <PageHeader title="Work" backHref="/" backLabel="Back to home" />

      <WorkSearchBar onStateChange={setSearchState} />

      <p aria-live="polite" className="font-body text-sm text-text-tertiary empty:hidden">
        {searchState.status === "unavailable" &&
          "Search is unavailable right now — showing every project."}
      </p>

      <ul className="grid w-full grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-1.5">
        {searchState.status === "loading"
          ? Array.from({ length: workItems.length }).map((_, index) => (
              <li key={index} className="flex h-full">
                <WorkCardSkeleton />
              </li>
            ))
          : visibleItems.map((item, index) => (
              <li key={item.slug} className="flex h-full">
                <WorkCard item={item} priority={index < 2} />
              </li>
            ))}
      </ul>
    </div>
  );
}
