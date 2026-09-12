export type NoteItem = {
  slug: string;
  title: string;
  date: string;
  /** One-line summary used as the page's meta description and OG image
   * subtitle. Kept separate from the body copy so it can stay short. */
  description: string;
};

export const noteItems: NoteItem[] = [
  {
    slug: "skills",
    title: "Claude skills ready to be used",
    date: "2026-09-11",
    description:
      "Claude skills that turn UX frameworks like the Laws of UX and debunked UX myths into references ready to use during design review.",
  },
  {
    slug: "a-workshop-on-video-game-mechanics",
    title: "A workshop on video game mechanics",
    date: "2026-09-06",
    description:
      "Running a gamification workshop where designers found Octalysis on their own, starting from a game mechanic instead of theory.",
  },
  {
    slug: "datatable-vs-object-model",
    title: "Datatable vs. object model",
    date: "2026-09-04",
    description:
      "Why starting from the object instead of the table changes how users recognize and remember what they're looking at.",
  },
];
