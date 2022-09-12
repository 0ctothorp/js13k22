import { Entity } from "../entities";
import { GAME } from "../game";
import { clamp } from "../math";
import { UNIT, worldSize } from "../utils";
import { Collider, ICollider } from "./collider";
import { BaseComponent, IComponent, TransformComponent } from "./common";
import { COMPONENTS, getMapSize } from "./componentsMap";

export class DoorCollider extends Collider implements ICollider {
  onCollide(entities: Set<Entity>) {
    for (const e of entities) {
      if (e === "player") {
        GAME.level += 1;
        (document.querySelector("#powerup-audio") as HTMLAudioElement).play();
      }
    }
  }
}

export class DoorSpawner extends BaseComponent implements IComponent {
  playerTransform: TransformComponent | undefined;

  start() {
    this.playerTransform = COMPONENTS.player.transform;
  }

  // Spawns the door at least half of the screen away from player
  spawn() {
    const pTransform = this.playerTransform!;

    const mapSize = getMapSize(GAME.level);

    // FIXME: use of window.innerWidth will become a problem when maps grow larger than
    // the screen and cmaera movement will be introduced.
    const xsign = pTransform.x > window.innerWidth / 2 ? -1 : 1;
    const screenMapWidth = mapSize.width * worldSize(UNIT);
    const x = clamp(
      mapSize.x + worldSize(64),
      pTransform.x +
        (xsign * screenMapWidth) / 2 +
        (Math.random() * xsign * screenMapWidth) / 2,
      mapSize.x + screenMapWidth - worldSize(64)
    );

    // FIXME: use of window.innerWidth will become a problem when maps grow larger than
    // the screen and cmaera movement will be introduced.
    const ysign = pTransform.y > window.innerHeight / 2 ? -1 : 1;
    const screenMapHeight = mapSize.height * worldSize(UNIT);
    const y = clamp(
      mapSize.y + worldSize(64),
      pTransform.y +
        (ysign * screenMapHeight) / 2 +
        (Math.random() * ysign * screenMapHeight) / 2,
      mapSize.y + screenMapHeight - worldSize(64)
    );

    COMPONENTS.door.transform = new TransformComponent("door", x, y);
  }
}
