import { ctx } from "./canvas";
import { COMPONENTS } from "./components/componentsMap";
import { Entity } from "./entities";
import { areSquaresColliding, worldSize } from "./utils";

function everyEntity(fn: (components: typeof COMPONENTS[Entity]) => void) {
  for (const k in COMPONENTS) {
    const components = COMPONENTS[k as keyof typeof COMPONENTS];
    fn(components);
  }
}

export function renderingSystem() {
  everyEntity((components) => components.renderer?.render(ctx));
}

export function movementSystem(deltaTime: number) {
  everyEntity((components) => components.movement?.update?.(deltaTime));
}

export function npcLifeSystem(deltaTime: number) {
  everyEntity((components) => components.npcLife?.update?.(deltaTime));
}

export function uiSystem() {
  everyEntity((components) => components.ui?.render?.(ctx));
}

export function collisionSystem() {
  everyEntity((cs1) => {
    everyEntity((cs2) => {
      if (
        cs1.collider?.entity !== cs2.collider?.entity &&
        areSquaresColliding(
          {
            x: cs1.transform?.x!,
            y: cs1.transform?.y!,
            size: worldSize(32),
          },
          {
            x: cs2.transform?.x!,
            y: cs2.transform?.y!,
            size: worldSize(32),
          }
        )
      ) {
        cs1.collider!.collidingWith.add(cs2.collider!.entity);
        cs2.collider!.collidingWith.add(cs1.collider!.entity);
        cs1.collider!.onCollide(cs1.collider!.collidingWith);
        cs2.collider!.onCollide(cs2.collider!.collidingWith);
      } else if (cs1.collider?.entity !== cs2.collider?.entity) {
        cs1.collider!.collidingWith.delete(cs2.collider!.entity);
        cs2.collider!.collidingWith.delete(cs1.collider!.entity);
      }
    });

    if (import.meta.env.DEV) {
      cs1.collider?.DEBUG_render(ctx);
    }
  });
}
