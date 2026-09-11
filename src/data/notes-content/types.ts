export type NoteContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "imagePlaceholder"; label?: string }
  | { type: "gameLibraryExample" }
  | { type: "mechanicsCarousel" }
  | { type: "link"; text: string; href: string }
  | { type: "code"; text: string };
