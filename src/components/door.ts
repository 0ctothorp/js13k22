import { Entity } from "../entities";
import { GAME } from "../game";
import { clamp } from "../math";
import { worldSize } from "../utils";
import { Collider, ICollider } from "./collider";
import { BaseComponent, IComponent, TransformComponent } from "./common";
import { COMPONENTS } from "./componentsMap";

export class DoorCollider extends Collider implements ICollider {
  onCollide(entities: Set<Entity>) {
    for (const e of entities) {
      if (e === "player") {
        GAME.level += 1;
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

    const xsign = pTransform.x > window.innerWidth / 2 ? -1 : 1;
    const x = clamp(
      worldSize(64),
      pTransform.x +
        (xsign * window.innerWidth) / 2 +
        (Math.random() * xsign * window.innerWidth) / 2,
      window.innerWidth - worldSize(64)
    );

    const ysign = pTransform.y > window.innerHeight / 2 ? -1 : 1;
    const y = clamp(
      worldSize(64),
      pTransform.y +
        (ysign * window.innerHeight) / 2 +
        (Math.random() * ysign * window.innerHeight) / 2,
      window.innerHeight - worldSize(64)
    );
    console.log({ x, y });

    COMPONENTS.door.transform = new TransformComponent("door", x, y);
  }
}
