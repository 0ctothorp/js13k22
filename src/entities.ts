export const ENTITIES = ["player", "npc"] as const;

export type Entity = typeof ENTITIES[number];
