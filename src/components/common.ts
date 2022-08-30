import { Entity } from "../entities";
import { COMPONENTS } from "./componentsMap";

export interface Renderer {
  render(ctx: CanvasRenderingContext2D): void;
}

export interface IComponent {
  start?(): void;
  update?(deltaTime: number): void;
  render?(ctx: CanvasRenderingContext2D): void;
  DEBUG_render?(ctx: CanvasRenderingContext2D): void;
}

export class BaseComponent {
  entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
}

export class RenderComponent extends BaseComponent implements IComponent {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    ctx.fillStyle = "green";
    ctx.fillRect(transformComponent.x, transformComponent.y, 20, 20);
  }
}

export class TransformComponent extends BaseComponent {
  x: number;
  y: number;

  constructor(entity: Entity, x = 0, y = 0) {
    super(entity);
    this.x = x;
    this.y = y;
  }
}
