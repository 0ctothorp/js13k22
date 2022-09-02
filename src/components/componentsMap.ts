import { Entity } from "../entities";
import { noop, worldSize } from "../utils";
import { IComponent, Renderer, TransformComponent } from "./common";
import { DeathRenderComponent, PlayerMovement } from "./death";
import { NPCLifeComponent, NPCMovement, NPCRenderComponent } from "./npc";
import { Collider } from "./physics";
import { PlayerHealth } from "./uiComponents";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: IComponent;
  npcLife: NPCLifeComponent;
  ui: IComponent;
  collider: Collider;
};

export const COMPONENTS: Record<Entity, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new DeathRenderComponent("player"),
    movement: new PlayerMovement("player"),
    ui: new PlayerHealth("player"),
    collider: new Collider(
      "player",
      [worldSize(32), worldSize(32)],
      (entities) => {
        console.log(entities);
        for (const e of entities) {
          delete COMPONENTS[e];
        }
      }
    ),
  },
  npc0: {
    transform: new TransformComponent("npc0", 200, 200),
    renderer: new NPCRenderComponent("npc0"),
    movement: new NPCMovement("npc0"),
    npcLife: new NPCLifeComponent("npc0"),
    collider: new Collider("npc0", [worldSize(32), worldSize(32)], noop),
  },
  npc1: {
    transform: new TransformComponent("npc1", 300, 300),
    renderer: new NPCRenderComponent("npc1"),
    movement: new NPCMovement("npc1"),
    npcLife: new NPCLifeComponent("npc1"),
    collider: new Collider("npc1", [worldSize(32), worldSize(32)], noop),
  },
  npc2: {
    transform: new TransformComponent("npc2", 300, 300),
    renderer: new NPCRenderComponent("npc2"),
    movement: new NPCMovement("npc2"),
    npcLife: new NPCLifeComponent("npc2"),
    collider: new Collider("npc2", [worldSize(32), worldSize(32)], noop),
  },
};
