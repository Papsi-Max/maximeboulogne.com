import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { workItems } from "@/data/work";
import { workContent } from "@/data/work-content";
import WorkContentBlocks from "@/components/WorkContentBlocks";

export function generateStaticParams() {
  return workItems.map((item) => ({ slug: item.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = workItems.find((i) => i.slug === slug);
  const blocks = workContent[slug];

  if (!item || !blocks) {
    notFound();
  }

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <Link
          href="/work"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <ArrowLeft aria-hidden className="h-9 w-9" strokeWidth={1.75} />
        </Link>
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          {item.title}
        </h1>
      </div>

      <WorkContentBlocks blocks={blocks} />
    </div>
  );
}
