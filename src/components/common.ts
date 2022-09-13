import { Entity } from "../entities";
import { GAME } from "../game";
import { debounce, UNIT, worldSize } from "../utils";
import { COMPONENTS, getMapSize } from "./componentsMap";

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

  getAllComponents() {
    return COMPONENTS[this.entity];
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

type MapSegment = "top" | "left" | "bottom" | "right";

export class MapTransform extends BaseComponent {
  x = 0;
  y = 0;
  segment: MapSegment;
  index: number;

  constructor(entity: Entity, segment: MapSegment, index: number) {
    super(entity);
    this.segment = segment;
    this.index = index;
    this.calcPosition();

    window.addEventListener(
      "resize",
      debounce(() => this.calcPosition(), 200)
    );
  }

  calcPosition() {
    const mapSize = getMapSize(GAME.level);

    if (this.segment === "top" || this.segment === "bottom") {
      this.x =
        window.innerWidth / 2 -
        ((mapSize.width + 2) * worldSize(UNIT)) / 2 +
        this.index * worldSize(UNIT);
    }

    if (this.segment === "top") {
      this.y =
        window.innerHeight / 2 - ((mapSize.height + 2) / 2) * worldSize(UNIT);
    }

    if (this.segment === "bottom") {
      this.y = window.innerHeight / 2 + (mapSize.height / 2) * worldSize(UNIT);
    }

    if (this.segment === "left" || this.segment === "right") {
      this.y =
        window.innerHeight / 2 -
        (mapSize.height * worldSize(UNIT)) / 2 +
        this.index * worldSize(UNIT);
    }

    if (this.segment === "left") {
      this.x =
        window.innerWidth / 2 - (mapSize.width / 2 + 1) * worldSize(UNIT);
    }

    if (this.segment === "right") {
      this.x = window.innerWidth / 2 + (mapSize.width / 2) * worldSize(UNIT);
    }
  }
}

export class Movement extends BaseComponent implements IComponent {
  transform: TransformComponent | undefined;

  start() {
    this.transform = this.getAllComponents().transform;
  }

  tryMoveY(by: number, onStuck?: () => void) {
    const map = getMapSize(GAME.level);
    const result = this.transform!.y + by;
    if (by < 0) {
      if (result < map.y) {
        this.transform!.y = map.y;
        onStuck?.();
      } else {
        this.transform!.y = result;
      }
    } else {
      if (result > map.y + (map.height - 1) * worldSize(UNIT)) {
        this.transform!.y = map.y + (map.height - 1) * worldSize(UNIT);
        onStuck?.();
      } else {
        this.transform!.y = result;
      }
    }
  }

  tryMoveX(by: number, onStuck?: () => void) {
    const map = getMapSize(GAME.level);
    const result = this.transform!.x + by;
    if (by < 0) {
      if (result < map.x) {
        this.transform!.x = map.x;
        onStuck?.();
      } else {
        this.transform!.x = result;
      }
    } else {
      if (result > map.x + (map.width - 1) * worldSize(UNIT)) {
        this.transform!.x = map.x + (map.width - 1) * worldSize(UNIT);
        onStuck?.();
      } else {
        this.transform!.x = result;
      }
    }
  }
}
