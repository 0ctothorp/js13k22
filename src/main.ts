import { COMPONENTS } from "./components/componentsMap";
import {
  areSquaresColliding,
  debounce,
  getDebugDrawFPS,
  worldSize,
} from "./utils";

window.DEBUG = true;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const canvas = document.querySelector("canvas")!;
resizeCanvas();
window.addEventListener("resize", debounce(resizeCanvas, 100));

const ctx = canvas.getContext("2d")!;

const debugDrawFPS = getDebugDrawFPS(ctx);

const components = Object.values(COMPONENTS);

function renderingSystem() {
  for (const c of components) {
    c.renderer?.render(ctx);
  }
}

function movementSystem(deltaTime: number) {
  for (const c of components) {
    // @ts-ignore
    c.movement?.update?.(deltaTime);
  }
}

function npcLifeSystem(deltaTime: number) {
  for (const c of components) {
    c.npcLife?.update?.(deltaTime);
  }
}

function uiSystem() {
  for (const c of components) {
    c.ui?.render?.(ctx);
  }
}

function collisionSystem() {
  for (const c of components) {
    // check for collisions between colliders
    // maybe do it in a fixed time step?
    for (const other of components) {
      if (
        c.collider &&
        other.collider &&
        c.collider.entity !== other.collider.entity &&
        areSquaresColliding(
          {
            x: c.transform?.x!,
            y: c.transform?.y!,
            size: worldSize(32),
          },
          {
            x: other.transform?.x!,
            y: other.transform?.y!,
            size: worldSize(32),
          }
        )
      ) {
        c.collider!.collidingWith.add(other.collider!.entity);
        other.collider!.collidingWith.add(c.collider!.entity);
      } else {
        c.collider!.collidingWith.delete(other.collider!.entity);
        other.collider!.collidingWith.delete(c.collider!.entity);
      }
    }

    if (import.meta.env.DEV) {
      c.collider?.DEBUG_render(ctx);
    }
  }
}

// initialize all components
for (const cs of Object.values(COMPONENTS)) {
  for (const c of Object.values(cs)) {
    // @ts-ignore
    c?.start?.();
  }
}

let prevTime = 0;
function loop(time: number) {
  const deltaTime = time - prevTime;
  prevTime = time;

  movementSystem(deltaTime);
  npcLifeSystem(deltaTime);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  collisionSystem();

  renderingSystem();
  uiSystem();

  if (import.meta.env.DEV) {
    debugDrawFPS(time);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
