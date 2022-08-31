import { Entity } from "../entities";
import { BaseComponent, IComponent, TransformComponent } from "./common";
import { COMPONENTS } from "./componentsMap";

export class Collider extends BaseComponent implements IComponent {
  size: [number, number];
  collidingWith: Set<Entity> = new Set();

  transform: TransformComponent | undefined;

  constructor(entity: Entity, size: [number, number]) {
    super(entity);
    this.size = size;
  }

  start() {
    this.transform = COMPONENTS[this.entity].transform;
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
      this.size[0],
      this.size[1]
    );
    ctx.closePath();
    ctx.stroke();
  }
}
