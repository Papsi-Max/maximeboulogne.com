import type { NoteContentBlock } from "./types";
import { datatableVsObjectModelContent } from "./datatable-vs-object-model";
import { aWorkshopOnVideoGameMechanicsContent } from "./a-workshop-on-video-game-mechanics";
import { skillsContent } from "./skills";
import { desirabilityViabilityFeasibilityContent } from "./desirability-viability-feasibility";
import { invisibleIsNotInaccessibleContent } from "./invisible-is-not-inaccessible";

export type { NoteContentBlock };

export const noteContent: Record<string, NoteContentBlock[]> = {
  "datatable-vs-object-model": datatableVsObjectModelContent,
  "a-workshop-on-video-game-mechanics": aWorkshopOnVideoGameMechanicsContent,
  skills: skillsContent,
  "desirability-viability-feasibility":
    desirabilityViabilityFeasibilityContent,
  "invisible-is-not-inaccessible": invisibleIsNotInaccessibleContent,
};
