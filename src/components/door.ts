import { Entity } from "../entities";
import { Collider, ICollider } from "./collider";
import { COMPONENTS } from "./componentsMap";

export class DoorCollider extends Collider implements ICollider {
  onCollide() {}
}
