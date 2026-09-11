export type NoteContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "imagePlaceholder"; label?: string }
  | { type: "gameLibraryExample" }
  | { type: "mechanicsCarousel" }
  | { type: "commandBlock"; linkText: string; href: string; command: string };
