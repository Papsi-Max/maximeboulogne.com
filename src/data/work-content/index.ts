import type { WorkContentBlock, WorkContentColumn, WorkContentLeaf } from "./types";
import { livinfranceAccommodationProcessContent } from "./livinfrance-accommodation-process";
import { ragEditoContent } from "./rag-edito";
import { storeXpContent } from "./store-xp";
import { competitorXpContent } from "./competitor-xp";
import { atelierJuneContent } from "./atelier-june-murals-showcase";
import { teampifyContent } from "./teampify-team-builder";

export type { WorkContentBlock, WorkContentColumn, WorkContentLeaf };

export const workContent: Record<string, WorkContentBlock[]> = {
  "livinfrance-accommodation-process": livinfranceAccommodationProcessContent,
  "rag-edito": ragEditoContent,
  "store-xp": storeXpContent,
  "competitor-xp": competitorXpContent,
  "atelier-june-murals-showcase": atelierJuneContent,
  "teampify-team-builder": teampifyContent,
};
