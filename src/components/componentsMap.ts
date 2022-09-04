import { worldSize } from "../utils";
import { IComponent, Renderer, TransformComponent } from "./common";
import {
  DeathRenderComponent,
  PlayerCollider,
  PlayerHealth,
  PlayerMovement,
} from "./death";
import { NPCLifeComponent, NPCMovement, NPCRenderComponent } from "./npc";
import { NpcCollider } from "./collider";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: IComponent;
  npcLife: NPCLifeComponent;
  collider: PlayerCollider | NpcCollider;
  ui: PlayerHealth | IComponent;
};

export const COMPONENTS: Record<string, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new DeathRenderComponent("player"),
    movement: new PlayerMovement("player"),
    ui: new PlayerHealth("player"),
    collider: new PlayerCollider("player", [worldSize(32), worldSize(32)]),
  },
  npc0: {
    transform: new TransformComponent("npc0", 200, 200),
    renderer: new NPCRenderComponent("npc0"),
    movement: new NPCMovement("npc0"),
    npcLife: new NPCLifeComponent("npc0"),
    collider: new NpcCollider("npc0", [32, 32]),
  },
  npc1: {
    transform: new TransformComponent("npc1", 300, 300),
    renderer: new NPCRenderComponent("npc1"),
    movement: new NPCMovement("npc1"),
    npcLife: new NPCLifeComponent("npc1"),
    collider: new NpcCollider("npc1", [32, 32]),
  },
  npc2: {
    transform: new TransformComponent("npc2", 300, 300),
    renderer: new NPCRenderComponent("npc2"),
    movement: new NPCMovement("npc2"),
    npcLife: new NPCLifeComponent("npc2"),
    collider: new NpcCollider("npc2", [32, 32]),
  },
};
