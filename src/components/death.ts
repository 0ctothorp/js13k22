import { Entity } from "../entities";
import { GAME } from "../game";
import { INPUT, MOVEMENT } from "../input";
import { SpriteId, SPRITES, SPRITESHEET } from "../sprites";
import { range, UNIT, worldSize } from "../utils";
import { Camera } from "./camera";
import { Collider, ICollider } from "./collider";
import {
  BaseComponent,
  IComponent,
  Movement,
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
    this.size = size || UNIT;
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
      x + Camera.getInstance().offset.x,
      y + Camera.getInstance().offset.y,
      size,
      size
    );
  }
}

export class PlayerMovement extends Movement implements IComponent {
  speed: number = 0.5;

  update(deltaTime: number) {
    if (!INPUT[MOVEMENT[0]]) return;

    const moveBy = worldSize(this.speed * deltaTime);

    switch (MOVEMENT[0]) {
      case "KeyW":
        this.tryMoveY(-moveBy);
        break;
      case "KeyA":
        this.tryMoveX(-moveBy);
        break;
      case "KeyS":
        this.tryMoveY(moveBy);
        break;
      case "KeyD":
        this.tryMoveX(moveBy);
        break;
      default:
        break;
    }
  }
}

// TODO: just use HTML for UI
// TODO: pomysł - zaczynasz z jednym życiem, a kolejne zyskujesz poprzez uśmiercenie NPC.
export class PlayerHealth extends BaseComponent implements IComponent {
  hearts: number = 3;

  render(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
    const cfg = SPRITES.heart;
    range(this.hearts).forEach((i) => {
      ctx.drawImage(
        SPRITESHEET,
        cfg.x,
        cfg.y,
        cfg.size,
        cfg.size,
        window.innerWidth - (i + 1) * worldSize(64),
        worldSize(16),
        worldSize(48),
        worldSize(48)
      );
    });
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

  update() {
    if (
      !this.enabled &&
      this.disabledTime > -1 &&
      Date.now() >= this.disabledTime + 1000
    ) {
      this.enabled = true;
    }
  }

  onCollide(entities: Set<Entity>) {
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
          GAME.score += 1;

          if (
            Object.keys(COMPONENTS).filter((x) => x.startsWith("npc"))
              .length === 0
          ) {
            COMPONENTS.door.spawner!.spawn();
          }
        }

        if (!npcLife.living && this.enabled) {
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
    }
  }
}
