"use client";

import BackButton from "@/components/BackButton";
import WorkCard from "@/components/WorkCard";
import { workItems } from "@/data/work";

export default function WorkPage() {
  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <BackButton href="/" />
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          Work
        </h1>
      </div>

      <ul className="grid w-full grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-1.5">
        {workItems.map((item, index) => (
          <li key={item.slug} className="flex h-full">
            <WorkCard item={item} priority={index < 2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
