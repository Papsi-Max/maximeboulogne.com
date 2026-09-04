export function formatNoteDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Key identifying the calendar month a note falls in, e.g. "2026-09" —
 * used to group consecutive notes from the same month together. */
export function noteMonthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}`;
}
