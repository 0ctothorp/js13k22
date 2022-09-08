import { clearCanvas, ctx } from "./canvas";
import { initializeComponents } from "./components/componentsMap";
import { GAME } from "./game";
import {
  collisionSystem,
  movementSystem,
  npcLifeSystem,
  renderingSystem,
  uiSystem,
} from "./systems";
import { getDebugDrawFPS, isDebug } from "./utils";

window.DEBUG = false;

const debugDrawFPS = getDebugDrawFPS(ctx);

// initialize all components
initializeComponents();

let prevTime = 0;
function loop(time: number) {
  const deltaTime = time - prevTime;
  prevTime = time;

  // game logic systems that don't render anything come before clearCanvas()
  if (GAME.canRunSystems()) {
    movementSystem(deltaTime);
    npcLifeSystem(deltaTime);
  }

  clearCanvas();

  // systems that draw something come after clearCanvas()
  if (GAME.canRunSystems()) {
    collisionSystem(deltaTime);
  }
  renderingSystem();
  uiSystem();
  GAME.countdown(deltaTime);
  if (isDebug()) {
    debugDrawFPS(time);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
