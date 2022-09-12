import { GAME } from "../game";
import { Point } from "../types";
import { UNIT, worldSize } from "../utils";
import { IComponent, TransformComponent } from "./common";
import { COMPONENTS, getMapSize } from "./componentsMap";

export class Camera implements IComponent {
  offset: Point = { x: 0, y: 0 };
  playerTransform: TransformComponent | undefined;

  start() {
    this.playerTransform = COMPONENTS.player.transform;
  }

  update(deltaTime: number): void {
    const mapSize = getMapSize(GAME.level);

    const pt = this.playerTransform!;
    const screenMapWidth = mapSize.width * worldSize(UNIT);
    if (screenMapWidth > window.innerWidth) {
      //   const playerx = pt.x * worldSize(UNIT);
      const diffx = window.innerWidth / 2 - pt.x;
      if (diffx < 0) {
        this.offset.x = Math.min(-diffx, window.innerWidth - screenMapWidth);
      }
    }
  }

  static getInstance() {
    return COMPONENTS.camera.camera!;
  }
}
