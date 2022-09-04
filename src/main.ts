import { clearCanvas, ctx } from "./canvas";
import { COMPONENTS } from "./components/componentsMap";
import {
  collisionSystem,
  movementSystem,
  npcLifeSystem,
  renderingSystem,
  uiSystem,
} from "./systems";
import { getDebugDrawFPS } from "./utils";

window.DEBUG = true;

const debugDrawFPS = getDebugDrawFPS(ctx);

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

  // game logic systems that don't render anything come before clearCanvas()
  movementSystem(deltaTime);
  npcLifeSystem(deltaTime);

  clearCanvas();

  // systems that draw something come after clearCanvas()
  collisionSystem(deltaTime);
  renderingSystem();
  uiSystem();

  if (import.meta.env.DEV) {
    debugDrawFPS(time);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
