import { COMPONENTS } from "./components/componentsMap";
import {
  areSquaresColliding,
  debounce,
  getDebugDrawFPS,
  worldSize,
} from "./utils";

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
    if (import.meta.env.DEV) {
      c.collider?.DEBUG_render(ctx);
    }
    // check for collisions between colliders
    // maybe do it in a fixed time step?
    for (const other of components) {
      if (
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
        c.collider!.collidingWith = other.collider!.entity;
        other.collider!.collidingWith = c.collider!.entity;
      } else {
        c.collider!.collidingWith = null;
        other.collider!.collidingWith = null;
      }
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
