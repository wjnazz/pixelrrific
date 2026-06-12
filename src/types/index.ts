import type { Modality } from "../lib/palettes";

export interface ProjectConfig {
  modality: Modality;
  canvasWidthInches: number;
  canvasHeightInches: number;
  unitsPerInch: number;
  maxColors: number; // 0 means unlimited
}
