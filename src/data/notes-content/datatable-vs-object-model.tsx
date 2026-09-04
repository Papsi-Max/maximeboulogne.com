import type { NoteContentBlock } from "./types";

export const datatableVsObjectModelContent: NoteContentBlock[] = [
  {
    type: "paragraph",
    text: "In most B2B teams I've worked with, the default answer to a list of data is a datatable: columns, sorting, filters. It works, and it's fast to build. But it shows the attributes of an object and never lets the user recognize the object itself. They scan rows of data. Nothing concrete.",
  },
  {
    type: "paragraph",
    text: "On a recent project, the first request was exactly that: one more table to display products. It felt natural, since the request moves fast and users are used to it. Habit is not a design argument on its own. The real question is what the user should remember about the object, not how quickly it can be displayed.",
  },
  { type: "gameLibraryExample" },
  {
    type: "paragraph",
    text: "Starting from an object instead of a table changes the lens entirely. What is this object? What attributes actually define it, rather than which columns fit on screen? The table still earns its place afterward, for comparing items or acting on volume, but as a secondary view rather than the entry point. Once the object view exists, most users end up preferring it to the old table.",
  },
];
