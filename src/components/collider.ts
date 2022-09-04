import { Entity } from "../entities";
import { worldSize } from "../utils";
import { BaseComponent, IComponent, TransformComponent } from "./common";
import { COMPONENTS } from "./componentsMap";

export interface ICollider extends IComponent {
  size: [number, number];
  collidingWith: Set<Entity>;
  transform: TransformComponent;

  DEBUG_render(ctx: CanvasRenderingContext2D): void;
  onCollide(entities: Set<Entity>): void;
}

export class Collider extends BaseComponent implements IComponent {
  size: [number, number];
  collidingWith: Set<Entity> = new Set();
  enabled: boolean = true;

  // @ts-ignore it's initialized in start()
  transform: TransformComponent;

  constructor(entity: Entity, size: [number, number]) {
    super(entity);
    this.size = size;
  }

  start() {
    this.transform = COMPONENTS[this.entity].transform!;
    if (!this.transform) {
      throw new Error(`no transform on ${this.entity}`);
    }
  }

  DEBUG_render(ctx: CanvasRenderingContext2D) {
    if (this.collidingWith.size > 0) {
      ctx.strokeStyle = "rgb(255,0,0)";
    } else {
      ctx.strokeStyle = "rgb(0,255,0)";
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(
      this.transform?.x!,
      this.transform?.y!,
      worldSize(this.size[0]),
      worldSize(this.size[1])
    );
    ctx.closePath();
    ctx.stroke();
  }
}

export class NpcCollider extends Collider implements ICollider {
  onCollide(entities: Set<Entity>): void {}
}
