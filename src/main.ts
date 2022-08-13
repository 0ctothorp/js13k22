import { debounce } from "./utils";

const canvas = document.querySelector("canvas")!;
resizeCanvas();
window.addEventListener("resize", debounce(resizeCanvas, 100));

const ctx = canvas.getContext("2d")!;

let prevTime = 0;

const debugDrawFPS = (() => {
  let lastFrames = 0;
  let frames = 0;
  let framesLastTime = 0;

  return (time: number) => {
    if (time - framesLastTime >= 1000) {
      framesLastTime = time;
      lastFrames = frames;
      frames = 0;
    } else {
      frames += 1;
    }

    ctx.font = "30px sans-serif";
    ctx.fillStyle = "green";
    ctx.fillText(lastFrames.toFixed(2), 20, 40);
  };
})();

const ENTITIES = ["player"] as const;
type Entity = typeof ENTITIES[number];

type Components = {
  transform: TransformComponent;
  renderer: RenderComponent;
};

class Component {
  protected entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
}

class RenderComponent extends Component {
  render() {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    ctx.fillStyle = "green";
    ctx.fillRect(transformComponent.x, transformComponent.y, 20, 20);
  }
}

class TransformComponent extends Component {
  x: number;
  y: number;

  constructor(entity: Entity, x = 0, y = 0) {
    super(entity);
    this.x = x;
    this.y = y;
  }
}

const COMPONENTS: Record<Entity, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new RenderComponent("player"),
  },
};

function renderingSystem() {
  for (const c of Object.values(COMPONENTS)) {
    c.renderer?.render();
  }
}

function loop(time: number) {
  const deltaTime = time - prevTime;
  prevTime = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  renderingSystem();

  if (import.meta.env.DEV) {
    debugDrawFPS(time);
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
