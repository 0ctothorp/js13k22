import { range, worldSize } from "../utils";
import { IComponent, Renderer, TransformComponent } from "./common";
import {
  DeathRenderComponent,
  PlayerCollider,
  PlayerHealth,
  PlayerMovement,
} from "./death";
import { NPCLifeComponent, NPCMovement, NPCRenderComponent } from "./npc";
import { NpcCollider } from "./collider";
import { DoorCollider } from "./door";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: IComponent;
  npcLife: NPCLifeComponent;
  collider: PlayerCollider | NpcCollider;
  ui: PlayerHealth | IComponent;
};

function generateNpcs(level: number) {
  return Object.fromEntries(
    range(level + 2).map((i) => {
      const id = `npc${i}`;

      return [
        id,
        {
          transform: new TransformComponent(
            id,
            Math.random() * window.innerWidth - 32,
            Math.random() * window.innerHeight - 32
          ),
          renderer: new NPCRenderComponent(id),
          movement: new NPCMovement(id),
          npcLife: new NPCLifeComponent(id),
          collider: new NpcCollider(id, [32, 32]),
        },
      ];
    })
  );
}

export function setComponents(level: number) {
  const npcs = generateNpcs(level);

  const door = {
    transform: undefined,
    renderer: new DeathRenderComponent("door", "door", 64),
    collider: new DoorCollider("door", [64, 64]),
  };

  COMPONENTS = {
    door,
    player: {
      transform: new TransformComponent("player", 100, 100),
      renderer: new DeathRenderComponent("player", "skull"),
      movement: new PlayerMovement("player"),
      ui: new PlayerHealth("player"),
      collider: new PlayerCollider("player", [32, 32]),
    },
    ...npcs,
  };
}

export let COMPONENTS: Record<string, Partial<Components>> = {};

setComponents(0);

export function initializeComponents() {
  for (const cs of Object.values(COMPONENTS)) {
    for (const c of Object.values(cs)) {
      // @ts-ignore
      c?.start?.();
    }
  }
}
