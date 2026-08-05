import type { WorkContentBlock } from "./livinfrance-accommodation-process";
import { livinfranceAccommodationProcessContent } from "./livinfrance-accommodation-process";

export type { WorkContentBlock };

export const workContent: Record<string, WorkContentBlock[]> = {
  "livinfrance-accommodation-process": livinfranceAccommodationProcessContent,
};
