import { GAME } from "../game";
import { Point } from "../commonTypes";
import { UNIT, worldSize } from "../utils";
import { IComponent, TransformComponent } from "./common";
import { COMPONENTS, getMapSize } from "./componentsMap";

export class Camera implements IComponent {
  offset: Point = { x: 0, y: 0 };
  playerTransform: TransformComponent | undefined;

  start() {
    this.playerTransform = COMPONENTS.player.transform;
  }

  update() {
    const mapSize = getMapSize(GAME.level);

    const pt = this.playerTransform!;
    const screenMapWidth = mapSize.width * worldSize(UNIT);
    if (screenMapWidth > window.innerWidth) {
      const diffx = pt.x - window.innerWidth / 2;
      if (diffx > 0) {
        this.offset.x = Math.max(
          -diffx,
          (window.innerWidth - screenMapWidth) / 2 - worldSize(UNIT)
        );
      } else if (diffx < 0) {
        this.offset.x = Math.min(
          -diffx,
          (screenMapWidth - window.innerWidth) / 2 + worldSize(UNIT)
        );
      }
    }

    const screenMapHeight = mapSize.height * worldSize(UNIT);
    if (screenMapHeight > window.innerHeight) {
      const diffy = pt.y - window.innerHeight / 2;
      if (diffy > 0) {
        this.offset.y = Math.max(
          -diffy,
          (window.innerHeight - screenMapHeight) / 2 - worldSize(UNIT)
        );
      } else if (diffy < 0) {
        this.offset.y = Math.min(
          -diffy,
          (screenMapHeight - window.innerHeight) / 2 + worldSize(UNIT)
        );
      }
    }
  }

  static getInstance() {
    return COMPONENTS.camera.camera!;
  }
}
