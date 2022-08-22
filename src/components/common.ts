import { Entity } from "../entities";
import { COMPONENTS } from "./componentsMap";

export interface Renderer {
  render(ctx: CanvasRenderingContext2D): void;
}

export class Component {
  protected entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  update?(deltaTime: number): void;
  start?(): void;
}

export class RenderComponent extends Component {
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

export class TransformComponent extends Component {
  x: number;
  y: number;

  constructor(entity: Entity, x = 0, y = 0) {
    super(entity);
    this.x = x;
    this.y = y;
  }
}
