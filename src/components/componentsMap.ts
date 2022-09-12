import { range, UNIT, worldSize } from "../utils";
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
import { tilePositionToScreenPosition } from "../tiles";
import { Camera } from "./camera";

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: IComponent | NPCMovement;
  npcLife: NPCLifeComponent;
  collider: PlayerCollider | NpcCollider | Collider;
  ui: PlayerHealth | IComponent;
  spawner: DoorSpawner;
  camera: Camera;
};

const baseMapX = 55;
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
    x: window.innerWidth / 2 - (width / 2) * worldSize(UNIT),
    y: window.innerHeight / 2 - (height / 2) * worldSize(UNIT),
  };
}

type Map = ReturnType<typeof getMapSize>;

function getRandomMapTile(map: Map) {
  return {
    x: Math.floor(Math.random() * map.width),
    y: Math.floor(Math.random() * map.height),
  };
}

function getRandomFreeMapTile(map: Map, tiles: boolean[][]) {
  let tile;
  do {
    tile = getRandomMapTile(map);
  } while (tiles[parseInt(tile.x.toFixed())][parseInt(tile.y.toFixed())]);
  return tile;
}

function generateNpcs(level: number, tiles: boolean[][]) {
  const map = getMapSize(level);

  return Object.fromEntries(
    range(level + 1).map((i) => {
      const id = `npc${i}`;

      const tile = getRandomFreeMapTile(map, tiles);

      // TODO: właściwie, to to powinien sobie renderer wołać, a transform powinien przechowywać pozycję kafelka
      const screen = tilePositionToScreenPosition(tile);

      return [
        id,
        {
          transform: new TransformComponent(id, screen.x, screen.y),
          renderer: new NPCRenderComponent(id),
          movement: new NPCMovement(id),
          npcLife: new NPCLifeComponent(id),
          collider: new NpcCollider(id, [UNIT, UNIT]),
        },
      ];
    })
  );
}

function createMap(level: number) {
  const { width, height } = getMapSize(level);

  const ec: typeof COMPONENTS = {};
  const h = height + 2;
  const topy = window.innerHeight / 2 - (h / 2) * worldSize(UNIT);
  const bottomy = window.innerHeight / 2 + (height / 2) * worldSize(UNIT);
  const w = width + 2;

  range(w).forEach((i) => {
    // create top and bottom walls
    const topEntity = `maptop${i}` as const;
    const x =
      window.innerWidth / 2 - (w * worldSize(UNIT)) / 2 + i * worldSize(UNIT);
    ec[topEntity] = {
      transform: new TransformComponent(topEntity, x, topy),
      renderer: new DeathRenderComponent(topEntity, "wall"),
      collider: new Collider(topEntity, [UNIT, UNIT]),
    };
    const bottomEntity = `mapbottom${i}`;
    ec[bottomEntity] = {
      transform: new TransformComponent(bottomEntity, x, bottomy),
      renderer: new DeathRenderComponent(bottomEntity, "wall"),
      collider: new Collider(bottomEntity, [UNIT, UNIT]),
    };
  });

  const leftx = window.innerWidth / 2 - (width / 2) * worldSize(UNIT);
  const rightx = window.innerWidth / 2 + (width / 2) * worldSize(UNIT);

  range(height).forEach((i) => {
    // create left and right walls
    const leftEntity = `mapleft${i}` as const;
    const y =
      window.innerHeight / 2 -
      (height * worldSize(UNIT)) / 2 +
      i * worldSize(UNIT);
    ec[leftEntity] = {
      transform: new TransformComponent(leftEntity, leftx - worldSize(UNIT), y),
      renderer: new DeathRenderComponent(leftEntity, "wall"),
      collider: new Collider(leftEntity, [UNIT, UNIT]),
    };
    const rightEntity = `mapright${i}`;
    ec[rightEntity] = {
      transform: new TransformComponent(rightEntity, rightx, y),
      renderer: new DeathRenderComponent(rightEntity, "wall"),
      collider: new Collider(rightEntity, [UNIT, UNIT]),
    };
  });

  return ec;
}

export function setComponents(level: number) {
  const mapSize = getMapSize(level);
  const tiles = Array(mapSize.width).fill(Array(mapSize.height).fill(false));
  const npcs = generateNpcs(level, tiles);

  const door = {
    transform: undefined,
    renderer: new DeathRenderComponent("door", "door", 64),
    collider: new DoorCollider("door", [64, 64]),
    spawner: new DoorSpawner("door"),
  };

  const map = createMap(level);
  const playerPosition = tilePositionToScreenPosition(
    getRandomFreeMapTile(mapSize, tiles)
  );

  COMPONENTS = {
    door,
    player: {
      transform: new TransformComponent(
        "player",
        playerPosition.x,
        playerPosition.y
      ),
      renderer: new DeathRenderComponent("player", "skull"),
      movement: new PlayerMovement("player"),
      ui: new PlayerHealth("player"),
      collider: new PlayerCollider("player", [UNIT, UNIT]),
    },
    ...map,
    ...npcs,
    camera: {
      camera: new Camera(),
    },
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
