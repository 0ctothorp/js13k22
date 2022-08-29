import { worldSize } from "../utils";
import { BaseComponent, Renderer, TransformComponent } from "./common";
import { COMPONENTS } from "./componentsMap";

export class NPCMovement extends BaseComponent {
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
  }

  private isOutOfBoundsBy(distance: number) {
    return (
      this.transform!.x > window.innerWidth + distance ||
      this.transform!.x < -distance ||
      this.transform!.y < -distance ||
      this.transform!.y > window.innerHeight + distance
    );
  }

  update(deltaTime: number) {
    const moveBy = this.speed * deltaTime;

    if (this.life!.living) {
      if (this.isOutOfBoundsBy(20) && this.accumulatedTime > 0) {
        this.direction[0] = -this.direction[0];
        this.direction[1] = -this.direction[1];
        this.accumulatedTime = 0;
        return;
      }

      if (this.accumulatedTime >= 2000) {
        this.recomputeDirection();
        this.accumulatedTime = 0;
        return;
      }

      this.accumulatedTime += deltaTime;

      if (this.direction[1] === 1) {
        this.transform!.y -= moveBy;
        return;
      }
      if (this.direction[1] === -1) {
        this.transform!.y += moveBy;
        return;
      }
      if (this.direction[0] === -1) {
        this.transform!.x -= moveBy;
        return;
      }
      if (this.direction[0] === 1) {
        this.transform!.x += moveBy;
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
    const npcSize = worldSize(40);
    ctx.font = `${npcSize}px sans-serif`;
    if (life.living) {
      ctx.fillText("😐", x, y);
    } else {
      ctx.fillText("😈", x, y);
    }

    if (life.living) {
      // health bar
      const healthBarWidth = worldSize(60);
      ctx.strokeStyle = "green";
      ctx.lineWidth = worldSize(10);
      ctx.beginPath();
      const sx = x - healthBarWidth / 2 + npcSize / 2;
      const sy = y - npcSize - worldSize(10);
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + healthBarWidth, sy);
      ctx.closePath();
      ctx.stroke();

      // health bar kill area
      ctx.strokeStyle = "red";
      ctx.beginPath();
      const lsx = sx + life.diesAtPercent * healthBarWidth - worldSize(5);
      ctx.moveTo(lsx, sy);
      ctx.lineTo(lsx + worldSize(10), sy);
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
  }
}

export class NPCLifeComponent extends BaseComponent {
  diesAtPercent = -1;
  lifeProgress = 0;
  living = true;

  static LIFE_PROGRESS_RATE = 0.00005;

  start() {
    this.diesAtPercent = Math.min(Math.random() + 0.15, 1);
  }

  update(deltaTime: number) {
    if (this.living) {
      this.lifeProgress += NPCLifeComponent.LIFE_PROGRESS_RATE * deltaTime;
      if (this.lifeProgress > 1) {
        this.lifeProgress = 1;
        this.living = false;
      }
    }
  }
}
