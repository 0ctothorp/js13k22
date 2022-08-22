import { Entity } from "../entities";
import { Component, Renderer, TransformComponent } from "./common";
import { DeathRenderComponent, PlayerMovement } from "./death";
import { NPCLifeComponent, NPCMovement, NPCRenderComponent } from "./npc";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: Component;
  npcLife: NPCLifeComponent;
};

export const COMPONENTS: Record<Entity, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new DeathRenderComponent("player"),
    movement: new PlayerMovement("player"),
  },
  npc0: {
    transform: new TransformComponent("npc0", 200, 200),
    renderer: new NPCRenderComponent("npc0"),
    movement: new NPCMovement("npc0"),
    npcLife: new NPCLifeComponent("npc0"),
  },
  npc1: {
    transform: new TransformComponent("npc1", 300, 300),
    renderer: new NPCRenderComponent("npc1"),
    movement: new NPCMovement("npc1"),
    npcLife: new NPCLifeComponent("npc1"),
  },
};
