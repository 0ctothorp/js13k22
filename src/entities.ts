export const ENTITIES = ["player", "npc0", "npc1"] as const;

export type Entity = typeof ENTITIES[number];
