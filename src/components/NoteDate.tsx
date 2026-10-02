import { formatNoteDate } from "@/lib/format-note-date";

/** A note's publication date as a machine-readable <time>, so assistive
 * tech and crawlers get the ISO date while sighted users get "Oct 1, 2026". */
export default function NoteDate({
  date,
  className,
}: {
  date: string;
  className?: string;
}) {
  return (
    <time dateTime={date} className={className}>
      {formatNoteDate(date)}
    </time>
  );
}
