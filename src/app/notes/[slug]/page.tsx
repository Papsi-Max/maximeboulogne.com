import Link from "next/link";
import Icon from "@/components/Icon";
import { notFound } from "next/navigation";
import { noteItems } from "@/data/notes";
import { noteContent } from "@/data/notes-content";
import NoteContentBlocks from "@/components/NoteContentBlocks";
import { formatNoteDate } from "@/lib/format-note-date";

export function generateStaticParams() {
  return noteItems.map((item) => ({ slug: item.slug }));
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = noteItems.find((i) => i.slug === slug);
  const blocks = noteContent[slug];

  if (!item || !blocks) {
    notFound();
  }

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <div className="flex w-full items-start gap-3">
        <Link
          href="/notes"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <Icon name="arrow_back" aria-hidden size={36} />
        </Link>
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          {item.title}
        </h1>
      </div>

      <div className="flex w-full items-center justify-between gap-4 font-body text-base text-text-secondary">
        <span>
          by{" "}
          <Link
            href="/about"
            className="text-text-secondary underline decoration-from-font transition-colors hover:text-text-primary"
          >
            Maxime Boulogne
          </Link>
        </span>
        <span>{formatNoteDate(item.date)}</span>
      </div>

      <div className="mt-6 w-full sm:mt-10">
        <NoteContentBlocks blocks={blocks} />
      </div>
    </div>
  );
}
