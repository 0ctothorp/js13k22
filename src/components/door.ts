import { Entity } from "../entities";
import { GAME } from "../game";
import { Collider, ICollider } from "./collider";

export class DoorCollider extends Collider implements ICollider {
  onCollide(entities: Set<Entity>) {
    for (const e of entities) {
      if (e === "player") {
        GAME.level += 1;
      }
    }
  }
}
