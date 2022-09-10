import { range, worldSize } from "../utils";
import { IComponent, Renderer, TransformComponent } from "./common";
import {
  DeathRenderComponent,
  PlayerCollider,
  PlayerHealth,
  PlayerMovement,
} from "./death";
import {
  NpcCollider,
  NPCLifeComponent,
  NPCMovement,
  NPCRenderComponent,
} from "./npc";
import { Collider } from "./collider";
import { DoorCollider, DoorSpawner } from "./door";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: IComponent | NPCMovement;
  npcLife: NPCLifeComponent;
  collider: PlayerCollider | NpcCollider | Collider;
  ui: PlayerHealth | IComponent;
};

const baseMapX = 15;
const baseMapY = 15;

export function getMapSize(level: number) {
  let width = baseMapX,
    height = baseMapY;

  if (level % 2 === 0) {
    width = baseMapX + level;
    height = baseMapY + level - 1;
  } else {
    width = baseMapX + level - 1;
    height = baseMapY + level;
  }

  return {
    width,
    height,
    x: window.innerWidth / 2 - (width / 2) * worldSize(32),
    y: window.innerHeight / 2 - (height / 2) * worldSize(32),
  };
}

function generateNpcs(level: number) {
  const map = getMapSize(level);

  return Object.fromEntries(
    range(level + 1).map((i) => {
      const id = `npc${i}`;

      return [
        id,
        {
          transform: new TransformComponent(
            id,
            Math.random() * (map.width - 1) * worldSize(32) + map.x,
            Math.random() * (map.height - 1) * worldSize(32) + map.y
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

function createMap(level: number) {
  const { width, height } = getMapSize(level);

  const ec: typeof COMPONENTS = {};
  const h = height + 2;
  const topy = worldSize(window.innerHeight / 2 - (h / 2) * worldSize(32));
  const bottomy = worldSize(
    window.innerHeight / 2 + (height / 2) * worldSize(32)
  );

  const w = width + 2;
  range(w).forEach((i) => {
    // create top and bottom walls
    const topEntity = `maptop${i}` as const;
    const x =
      window.innerWidth / 2 - (w * worldSize(32)) / 2 + i * worldSize(32);
    ec[topEntity] = {
      transform: new TransformComponent(topEntity, x, topy),
      renderer: new DeathRenderComponent(topEntity, "wall"),
      collider: new Collider(topEntity, [32, 32]),
    };
    const bottomEntity = `mapbottom${i}`;
    ec[bottomEntity] = {
      transform: new TransformComponent(bottomEntity, x, bottomy),
      renderer: new DeathRenderComponent(bottomEntity, "wall"),
      collider: new Collider(bottomEntity, [32, 32]),
    };
  });

  const leftx = worldSize(window.innerWidth / 2 - (width / 2) * worldSize(32));
  const rightx = worldSize(window.innerWidth / 2 + (width / 2) * worldSize(32));

  range(height).forEach((i) => {
    // create left and right walls
    const leftEntity = `mapleft${i}` as const;
    const y =
      window.innerHeight / 2 - (height * worldSize(32)) / 2 + i * worldSize(32);
    ec[leftEntity] = {
      transform: new TransformComponent(leftEntity, leftx - worldSize(32), y),
      renderer: new DeathRenderComponent(leftEntity, "wall"),
      collider: new Collider(leftEntity, [32, 32]),
    };
    const rightEntity = `mapright${i}`;
    ec[rightEntity] = {
      transform: new TransformComponent(rightEntity, rightx, y),
      renderer: new DeathRenderComponent(rightEntity, "wall"),
      collider: new Collider(rightEntity, [32, 32]),
    };
  });

  return ec;
}

export function setComponents(level: number) {
  const npcs = generateNpcs(level);

  const door = {
    transform: undefined,
    renderer: new DeathRenderComponent("door", "door", 64),
    collider: new DoorCollider("door", [64, 64]),
    spawner: new DoorSpawner("door"),
  };

  const map = createMap(level);

  COMPONENTS = {
    door,
    player: {
      transform: new TransformComponent("player", 100, 100),
      renderer: new DeathRenderComponent("player", "skull"),
      movement: new PlayerMovement("player"),
      ui: new PlayerHealth("player"),
      collider: new PlayerCollider("player", [32, 32]),
    },
    ...map,
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
