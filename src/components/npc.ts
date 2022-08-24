import { worldSize } from "../utils";
import { Component, Renderer } from "./common";
import { COMPONENTS } from "./componentsMap";

export class NPCMovement extends Component {
  speed: number = 0.2;
  direction = [0, 0];
  accumulatedTime: number = 0;
  // @ts-ignore
  transform: TransformComponent;

  start() {
    this.transform = COMPONENTS[this.entity].transform!;
    if (!this.transform) {
      throw `no transform component on ${this.entity}`;
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
      this.transform.x > window.innerWidth + distance ||
      this.transform.x < -distance ||
      this.transform.y < -distance ||
      this.transform.y > window.innerHeight + distance
    );
  }

  update(deltaTime: number) {
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

    const moveBy = this.speed * deltaTime;
    if (this.direction[1] === 1) {
      this.transform.y -= moveBy;
      return;
    }
    if (this.direction[1] === -1) {
      this.transform.y += moveBy;
      return;
    }
    if (this.direction[0] === -1) {
      this.transform.x -= moveBy;
      return;
    }
    if (this.direction[0] === 1) {
      this.transform.x += moveBy;
      return;
    }
  }
}

export class NPCRenderComponent extends Component implements Renderer {
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
    ctx.fillText("😐", x, y);

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

    ctx.strokeStyle = "red";
    ctx.beginPath();
    const lsx = sx + life.diesAtPercent * healthBarWidth - worldSize(5);
    ctx.moveTo(lsx, sy);
    ctx.lineTo(lsx + worldSize(10), sy);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    const cursorx = sx + healthBarWidth * life.lifeProgress;
    ctx.moveTo(cursorx, sy);
    ctx.lineTo(cursorx + 1, sy);
    ctx.closePath();
    ctx.stroke();
  }
}

export class NPCLifeComponent extends Component {
  diesAtPercent = -1;
  lifeProgress = 0;
  living = true;

  static LIFE_PROGRESS_RATE = 0.00005;

  start() {
    this.diesAtPercent = Math.min(Math.random() + 0.15, 1);
  }

  update(deltaTime: number) {
    if (!this.living) return;
    console.log(NPCLifeComponent.LIFE_PROGRESS_RATE);
    this.lifeProgress += NPCLifeComponent.LIFE_PROGRESS_RATE * deltaTime;
    if (this.lifeProgress > 1) {
      this.lifeProgress = 1;
      this.living = false;
    }
  }
}
