import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { WorkItem } from "@/data/work";

export default function WorkCard({ item }: { item: WorkItem }) {
  return (
    <Link
      href={`/work/${item.slug}`}
      className="work-card group flex h-full flex-1 flex-col items-start gap-1.5 rounded-3xl bg-bg-secondary p-1.5 transition-colors hover:bg-[#333333]"
    >
      <div
        className="relative aspect-7/5 w-full shrink-0 overflow-hidden rounded-[20px]"
        style={item.imageBg ? { backgroundColor: item.imageBg } : undefined}
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex w-full flex-1 flex-col items-start gap-8 p-2.5">
        <div className="flex w-full flex-col items-start gap-1.5">
          <Image
            src={item.icon}
            alt={item.iconAlt}
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain"
          />
          <p className="w-full font-body text-lg font-semibold text-text-secondary">
            {item.title}
          </p>
        </div>

        <div className="mt-auto flex w-full items-center justify-between">
          <span className="rounded-lg bg-bg-tertiary px-3 py-2 font-body text-base text-text-secondary">
            {item.readTime}
          </span>
          <ArrowRight
            aria-hidden
            className="h-8 w-8 text-text-secondary transition-transform duration-200 group-hover:translate-x-1"
            strokeWidth={1.75}
          />
        </div>
      </div>
    </Link>
  );
}
