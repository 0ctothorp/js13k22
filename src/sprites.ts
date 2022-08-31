import { loadImage } from "./utils";

export const SPRITESHEET = loadImage("spritesheet.png");
export const SPRITES = {
  skull: { x: 0, y: 0, size: 16 },
  npcNormal: { x: 16, y: 0, size: 16 },
  npcEvil: { x: 32, y: 0, size: 16 },
} as const;
