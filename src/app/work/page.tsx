"use client";

import { useMemo, useState } from "react";
import BackButton from "@/components/BackButton";
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
      <div className="flex w-full items-start gap-3">
        <BackButton href="/" />
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          Work
        </h1>
      </div>

      <WorkSearchBar onStateChange={setSearchState} />

      {searchState.status === "unavailable" && (
        <p className="font-body text-sm text-text-tertiary">
          Search is unavailable right now — showing every project.
        </p>
      )}

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
