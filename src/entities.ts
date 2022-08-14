export const ENTITIES = ["player"] as const;

export type Entity = typeof ENTITIES[number];
