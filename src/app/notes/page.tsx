import Link from "next/link";
import Icon from "@/components/Icon";
import { noteItems, type NoteItem } from "@/data/notes";
import { formatNoteDate, noteMonthKey } from "@/lib/format-note-date";

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
      <div className="flex w-full items-start gap-3">
        <Link
          href="/"
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-tertiary"
        >
          <Icon name="arrow_back" aria-hidden size={36} />
        </Link>
        <h1 className="flex-1 font-display text-5xl font-normal text-text-primary">
          Notes
        </h1>
      </div>

      <div className="flex w-full flex-col items-start gap-4">
        {groups.map((group) => (
          <div
            key={group[0].slug}
            className="flex w-full flex-col items-start gap-0.5"
          >
            {group.map((item) => (
              <Link
                key={item.slug}
                href={`/notes/${item.slug}`}
                className="group flex w-full items-center gap-1.5 rounded-full px-4 py-1.5 text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                <span className="min-w-0 flex-1 truncate font-body text-lg">
                  {item.title}
                </span>
                <span className="shrink-0 font-body text-sm">
                  {formatNoteDate(item.date)}
                </span>
              </Link>
            ))}
            <div className="w-full px-4">
              <div className="h-px w-full rounded-full bg-border-primary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
