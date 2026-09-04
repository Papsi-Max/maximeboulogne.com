export type NoteContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "imagePlaceholder"; label?: string }
  | { type: "gameLibraryExample" };
