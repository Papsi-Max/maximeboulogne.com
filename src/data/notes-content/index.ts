import type { NoteContentBlock } from "./types";
import { datatableVsObjectModelContent } from "./datatable-vs-object-model";
import { aWorkshopOnVideoGameMechanicsContent } from "./a-workshop-on-video-game-mechanics";

export type { NoteContentBlock };

export const noteContent: Record<string, NoteContentBlock[]> = {
  "datatable-vs-object-model": datatableVsObjectModelContent,
  "a-workshop-on-video-game-mechanics": aWorkshopOnVideoGameMechanicsContent,
};
