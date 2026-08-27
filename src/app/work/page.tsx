"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import WorkCard from "@/components/WorkCard";
import { workItems } from "@/data/work";

export default function WorkPage() {
  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <Icon name="arrow_back" aria-hidden size={36} />
        </Link>
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          Work
        </h1>
      </div>

      <div className="grid w-full grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-1.5">
        {workItems.map((item, index) => (
          <WorkCard key={item.slug} item={item} priority={index < 2} />
        ))}
      </div>
    </div>
  );
}
