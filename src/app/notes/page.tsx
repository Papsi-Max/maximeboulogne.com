import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import NoteDate from "@/components/NoteDate";
import { noteItems, type NoteItem } from "@/data/notes";
import { noteMonthKey } from "@/lib/format-note-date";

export const metadata: Metadata = {
  title: "Notes",
  description:
    "Notes on UX, AI, and design practice, written by Maxime Boulogne.",
  alternates: {
    canonical: "/notes",
  },
};

/** Consecutive notes sharing the same calendar month, so a divider only
 * appears between groups instead of after every row. */
function groupByMonth(items: NoteItem[]) {
  const groups: NoteItem[][] = [];

  for (const item of items) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && noteMonthKey(lastGroup[0].date) === noteMonthKey(item.date)) {
      lastGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  return groups;
}

export default function NotesPage() {
  const groups = groupByMonth(noteItems);

  return (
    <div className="flex flex-col items-start gap-4 px-4">
      <PageHeader title="Notes" backHref="/" backLabel="Back to home" />

      <ul className="flex w-full flex-col items-start gap-4">
        {groups.map((group) => (
          <li
            key={group[0].slug}
            className="flex w-full flex-col items-start gap-0.5"
          >
            <ul className="flex w-full flex-col items-start gap-0.5">
              {group.map((item) => (
                <li key={item.slug} className="w-full">
                  <Link
                    href={`/notes/${item.slug}`}
                    className="group flex w-full items-center gap-1.5 rounded-full px-4 py-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                  >
                    <span className="min-w-0 flex-1 truncate font-body text-lg">
                      {item.title}
                    </span>
                    <NoteDate
                      date={item.date}
                      className="shrink-0 font-body text-sm"
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="w-full px-4">
              <div className="h-px w-full rounded-full bg-border-primary" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
