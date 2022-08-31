export const ENTITIES = ["player", "npc0", "npc1", "npc2"] as const;

export type Entity = typeof ENTITIES[number];
