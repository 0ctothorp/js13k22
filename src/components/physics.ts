import { Entity } from "../entities";
import { BaseComponent, IComponent, TransformComponent } from "./common";
import { COMPONENTS } from "./componentsMap";

export class Collider extends BaseComponent implements IComponent {
  size: [number, number];
  collidingWith: Entity | null = null;

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

  update() {}

  DEBUG_render(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "green";
    ctx.lineWidth = "1";
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
