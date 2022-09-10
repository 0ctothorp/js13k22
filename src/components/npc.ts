import { Entity } from "../entities";
import { GAME } from "../game";
import { SPRITES, SPRITESHEET } from "../sprites";
import { isDebug, worldSize } from "../utils";
import { Collider, ICollider } from "./collider";
import {
  BaseComponent,
  IComponent,
  Renderer,
  TransformComponent,
} from "./common";
import { COMPONENTS, getMapSize } from "./componentsMap";

export class NPCMovement extends BaseComponent implements IComponent {
  speed: number = 0.2;
  direction = [0, 0];
  accumulatedTime: number = 0;
  transform?: TransformComponent;
  life?: NPCLifeComponent;
  playerTransform?: TransformComponent;

  start() {
    this.transform = COMPONENTS[this.entity].transform!;
    if (!this.transform) {
      throw `no transform component on ${this.entity}`;
    }

    this.life = COMPONENTS[this.entity].npcLife;
    if (!this.life) {
      throw `no life component on ${this.entity}`;
    }

    this.playerTransform = COMPONENTS.player.transform;
    if (!this.playerTransform) {
      throw "no transform component on player";
    }

    this.recomputeDirection();
  }

  private recomputeDirection() {
    const axis = Math.floor(Math.random() * 2);
    this.direction[axis] = Math.random() > 0.5 ? -1 : 1;
    this.direction[Math.abs(axis - 1)] = 0;
    this.accumulatedTime = 0;
  }

  update(deltaTime: number) {
    const moveBy = this.speed * deltaTime;

    if (this.life!.living) {
      if (this.accumulatedTime >= 2000) {
        this.recomputeDirection();
        return;
      }

      this.accumulatedTime += deltaTime;

      if (this.direction[1] === 1) {
        this.#tryMoveY(-moveBy);
        return;
      }
      if (this.direction[1] === -1) {
        this.#tryMoveY(moveBy);
        return;
      }
      if (this.direction[0] === -1) {
        // this.transform!.x -= moveBy;
        this.recomputeDirection();
        return;
      }
      if (this.direction[0] === 1) {
        // this.transform!.x += moveBy;
        this.recomputeDirection();
        return;
      }
    } else {
      // chase the player
      const pt = this.playerTransform!;
      const tt = this.transform!;
      const xdiff = tt.x - pt.x;
      const ydiff = tt.y - pt.y;
      if (Math.abs(xdiff) > Math.abs(ydiff)) {
        tt.x += moveBy * -Math.sign(xdiff);
      } else {
        tt.y += moveBy * -Math.sign(ydiff);
      }
    }
  }

  #tryMoveY(by: number) {
    const map = getMapSize(GAME.level);
    const result = this.transform!.y + by;
    if (by < 0) {
      if (result < map.y) {
        this.transform!.y = map.y;
        this.recomputeDirection();
      } else {
        this.transform!.y = result;
      }
    } else {
      if (result > map.y + (map.height - 1) * worldSize(32)) {
        this.transform!.y = map.y + (map.height - 1) * worldSize(32);
        this.recomputeDirection();
      } else {
        this.transform!.y = result;
      }
    }
  }
}

export class NPCRenderComponent extends BaseComponent implements Renderer {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    const life = COMPONENTS[this.entity]["npcLife"];
    if (!life) {
      console.error(`no life component on ${this.entity}`);
      return;
    }

    const { x, y } = transformComponent;
    const npcSize = worldSize(32);
    ctx.imageSmoothingEnabled = false;

    if (life.living) {
      const spritecfg = SPRITES.npcNormal;
      ctx.drawImage(
        SPRITESHEET,
        spritecfg.x,
        spritecfg.y,
        spritecfg.size,
        spritecfg.size,
        x,
        y,
        npcSize,
        npcSize
      );
    } else {
      const spritecfg = SPRITES.npcEvil;
      ctx.drawImage(
        SPRITESHEET,
        spritecfg.x,
        spritecfg.y,
        spritecfg.size,
        spritecfg.size,
        x,
        y,
        npcSize,
        npcSize
      );
    }

    if (life.living) {
      // health bar
      const healthBarWidth = worldSize(75);
      ctx.strokeStyle = "green";
      ctx.lineWidth = worldSize(11);
      ctx.beginPath();
      const sx = x + npcSize / 2 - healthBarWidth / 2;
      const sy = y - worldSize(10);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + healthBarWidth, sy);
      ctx.closePath();
      ctx.stroke();

      // health bar kill area
      ctx.strokeStyle = "red";
      ctx.beginPath();
      const lsx = sx + life.shouldDieAt[0] * healthBarWidth;
      ctx.moveTo(lsx, sy);
      ctx.lineTo(sx + life.shouldDieAt[1] * healthBarWidth, sy);
      ctx.closePath();
      ctx.stroke();

      // health bar life progress indicator
      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      const cursorx = sx + healthBarWidth * life.lifeProgress;
      ctx.moveTo(cursorx, sy);
      ctx.lineTo(cursorx + 1, sy);
      ctx.closePath();
      ctx.stroke();
    }

    if (isDebug()) {
      ctx.font = "16px sans-serif";
      ctx.fillStyle = "rgb(0, 255, 0)";
      ctx.fillText(this.entity, x, y - worldSize(20));
    }
  }
}

export class NPCLifeComponent extends BaseComponent {
  shouldDieAt = [0, 1];
  lifeProgress = 0;
  _living = true;
  lifeLength = Math.random() * 2000 - 2000 + 12000;

  static LIFE_PROGRESS_RATE = 0.0005;

  start() {
    const dieAt = Math.min(Math.random() + 0.25, 0.75);
    this.shouldDieAt = [dieAt - 0.1, dieAt + 0.1];
  }

  update(deltaTime: number) {
    if (this.living) {
      this.lifeProgress += deltaTime / this.lifeLength;
      if (this.lifeProgress > 1) {
        this.lifeProgress = 1;
        this.living = false;
      }
    }
  }

  set living(value: boolean) {
    this._living = value;

    if (value) return;

    const npcs = Object.entries(COMPONENTS)
      .filter(([k]) => k.startsWith("npc"))
      .map(([, v]) => v);

    if (npcs.every((x) => !x.npcLife?.living)) {
      this.#spawnDoor();
    }
  }

  #spawnDoor() {
    COMPONENTS.door.spawner.spawn();
  }

  get living() {
    return this._living;
  }
}

export class NpcCollider extends Collider implements ICollider {
  onCollide() {}
}
