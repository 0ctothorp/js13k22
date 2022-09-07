import { Entity } from "../entities";
import { GAME } from "../game";
import { INPUT, MOVEMENT } from "../input";
import { SpriteId, SPRITES, SPRITESHEET } from "../sprites";
import { range, worldSize } from "../utils";
import { Collider, ICollider } from "./collider";
import {
  BaseComponent,
  IComponent,
  Renderer,
  TransformComponent,
} from "./common";
import { COMPONENTS } from "./componentsMap";

export class DeathRenderComponent extends BaseComponent implements Renderer {
  spriteId: SpriteId;
  size: number;
  transform: TransformComponent | undefined;

  constructor(entity: Entity, spriteId: SpriteId, size?: number) {
    super(entity);
    this.spriteId = spriteId;
    this.size = size || 32;
  }

  start() {
    this.transform = COMPONENTS[this.entity]["transform"];
    if (!this.transform) {
      console.error(`no transform component on ${this.entity}`);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.transform) {
      this.transform = COMPONENTS[this.entity]["transform"];
      if (!this.transform) return;
    }

    const { x, y } = this.transform!;

    const size = worldSize(this.size);
    ctx.imageSmoothingEnabled = false;
    const cfg = SPRITES[this.spriteId];
    ctx.drawImage(
      SPRITESHEET,
      cfg.x,
      cfg.y,
      cfg.size,
      cfg.size,
      x,
      y,
      size,
      size
    );
  }
}

export class PlayerMovement extends BaseComponent implements IComponent {
  speed: number = 0.5;

  update(deltaTime: number) {
    const transform = COMPONENTS[this.entity].transform;
    if (!transform) {
      console.error("no transform component on player");
      return;
    }

    // const pressedKeys = Object.entries(INPUT)
    //   .filter(([_, v]) => v)
    //   .map(([k]) => k)
    //   .filter((k) => ["KeyW", "KeyA", "KeyD", "KeyS"].includes(k));

    if (!INPUT[MOVEMENT[0]]) return;
    switch (MOVEMENT[0]) {
      case "KeyW":
        transform.y -= this.speed * deltaTime;
        break;
      case "KeyA":
        transform.x -= this.speed * deltaTime;
        break;
      case "KeyS":
        transform.y += this.speed * deltaTime;
        break;
      case "KeyD":
        transform.x += this.speed * deltaTime;
        break;
      default:
        break;
    }
  }
}

export class PlayerHealth extends BaseComponent implements IComponent {
  hearts: number = 3;

  render(ctx: CanvasRenderingContext2D) {
    ctx.font = "40px sans-serif";
    ctx.fillText(
      range(this.hearts)
        .map(() => "💗")
        .join(""),
      window.innerWidth - 180,
      50
    );
  }
}

export class PlayerCollider extends Collider implements ICollider {
  playerHealth: PlayerHealth | undefined;
  disabledTime: number = -1;

  start() {
    this.playerHealth = COMPONENTS.player.ui as PlayerHealth;
    if (!this.playerHealth) {
      throw new Error("no health component on player");
    }
  }

  update(deltaTime: number) {
    if (
      !this.enabled &&
      this.disabledTime > -1 &&
      Date.now() >= this.disabledTime + 1000
    ) {
      this.enabled = true;
    }
  }

  onCollide(entities: Set<Entity>): void {
    for (const e of entities) {
      // usuwam entity ze zbioru collidingWith u playera, bo
      // gdy usuwam npc'a z COMPONENTS, to system kolizji
      // już przez niego nie przechodzi i nie aktualizuje zbioru
      // collidingWith.
      // Można by dodać jakąś funkcję dezaktywującą entity, która wyłącza wszystkie
      // komponenty i przesuwa entity gdzieś poza mapę.
      const components = COMPONENTS[e];
      const { npcLife } = components;
      if (npcLife) {
        if (
          npcLife.lifeProgress >= npcLife.shouldDieAt[0] &&
          npcLife.lifeProgress <= npcLife.shouldDieAt[1]
        ) {
          COMPONENTS.player.collider!.collidingWith.delete(e);
          delete COMPONENTS[e];
          if (!Object.keys(COMPONENTS).find((x) => x.startsWith("npc"))) {
            // spawn doors somewhere
          }
        }

        if (!npcLife.living) {
          this.playerHealth!.hearts -= 1;
          if (this.playerHealth!.hearts === 0) {
            this.enabled = false;
            GAME.screen = "uded";
            return;
          }
          this.enabled = false;
          this.disabledTime = Date.now();
        }
      }

      if (e === "door") {
        //next level
      }
    }
  }
}
