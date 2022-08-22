import { COMPONENTS } from "./components";
import { debounce, getDebugDrawFPS } from "./utils";

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

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  renderingSystem();

  if (import.meta.env.DEV) {
    debugDrawFPS(time);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
