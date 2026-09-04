import type { NoteContentBlock } from "./types";
import { datatableVsObjectModelContent } from "./datatable-vs-object-model";

export type { NoteContentBlock };

export const noteContent: Record<string, NoteContentBlock[]> = {
  "datatable-vs-object-model": datatableVsObjectModelContent,
};
