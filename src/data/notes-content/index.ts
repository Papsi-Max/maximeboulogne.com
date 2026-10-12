import type { NoteContentBlock } from "./types";
import { datatableVsObjectModelContent } from "./datatable-vs-object-model";
import { aWorkshopOnVideoGameMechanicsContent } from "./a-workshop-on-video-game-mechanics";
import { skillsContent } from "./skills";
import { desirabilityViabilityFeasibilityContent } from "./desirability-viability-feasibility";
import { invisibleIsNotInaccessibleContent } from "./invisible-is-not-inaccessible";
import { aGamificationWorkshopOnARealBusinessCaseContent } from "./a-gamification-workshop-on-a-real-business-case";

export type { NoteContentBlock };

export const noteContent: Record<string, NoteContentBlock[]> = {
  "datatable-vs-object-model": datatableVsObjectModelContent,
  "a-workshop-on-video-game-mechanics": aWorkshopOnVideoGameMechanicsContent,
  skills: skillsContent,
  "desirability-viability-feasibility":
    desirabilityViabilityFeasibilityContent,
  "invisible-is-not-inaccessible": invisibleIsNotInaccessibleContent,
  "a-gamification-workshop-on-a-real-business-case":
    aGamificationWorkshopOnARealBusinessCaseContent,
};
