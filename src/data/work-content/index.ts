import type { WorkContentBlock, WorkContentColumn, WorkContentLeaf } from "./types";
import { livinfranceAccommodationProcessContent } from "./livinfrance-accommodation-process";
import { ragEditoContent } from "./rag-edito";
import { leroyMerlinContent } from "./leroy-merlin";
import { xpAwardsContent } from "./xp-awards";
import { atelierJuneContent } from "./atelier-june";
import { teampifyContent } from "./teampify";

export type { WorkContentBlock, WorkContentColumn, WorkContentLeaf };

export const workContent: Record<string, WorkContentBlock[]> = {
  "livinfrance-accommodation-process": livinfranceAccommodationProcessContent,
  "rag-edito": ragEditoContent,
  "leroy-merlin": leroyMerlinContent,
  "xp-awards": xpAwardsContent,
  "atelier-june": atelierJuneContent,
  "teampify": teampifyContent,
};
