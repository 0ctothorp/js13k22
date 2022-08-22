import { Entity } from "./entities";
import { INPUT } from "./input";

interface Renderer {
  render(ctx: CanvasRenderingContext2D): void;
}

export type Components = {
  transform: TransformComponent;
  renderer: Renderer;
  movement: Component;
};

class Component {
  protected entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  update?(deltaTime: number): void;
  start?(): void;
}

class DeathRenderComponent extends Component implements Renderer {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    const { x, y } = transformComponent;
    ctx.font = "40px sans-serif";
    ctx.fillText("💀", x, y);
  }
}

class NPCRenderComponent extends Component implements Renderer {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    const { x, y } = transformComponent;
    ctx.font = "40px sans-serif";
    ctx.fillText("😐", x, y);
  }
}

export class RenderComponent extends Component {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    ctx.fillStyle = "green";
    ctx.fillRect(transformComponent.x, transformComponent.y, 20, 20);
  }
}

export class TransformComponent extends Component {
  x: number;
  y: number;

  constructor(entity: Entity, x = 0, y = 0) {
    super(entity);
    this.x = x;
    this.y = y;
  }
}

class PlayerMovement extends Component {
  speed: number = 0.5;

  update(deltaTime: number) {
    const transform = COMPONENTS[this.entity].transform;
    if (!transform) {
      console.error("no transform component on player");
      return;
    }

    const pressedKeys = Object.entries(INPUT)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .filter((k) => ["KeyW", "KeyA", "KeyD", "KeyS"].includes(k));

    // poprawić to, żeby dało się chodzić po skosie?
    // denerwujące jest to, że w niektórych przypadkach. gdy już naciskam
    // jakiś klawisz i dokładam kolejny, żeby zmienić kierunek ruchu, to
    // dopóki nie puszczę poprzedniego, to idę cały czas w tę samą stronę.
    // Jeśli dodam poruszanie się po skosie, to problem rozwiązany, jeśli nie
    // to musiałbym znać czas naciśnięcia klawisza, żeby ten ostatnio wciśnięty
    // miał większy priorytet.
    switch (pressedKeys[0]) {
      case "KeyW":
        transform.y -= this.speed * deltaTime;
        break;
      case "KeyA":
        transform.x -= this.speed * deltaTime;
        break;
      case "KeyS":
        transform.y += this.speed * deltaTime;
        break;
      case "KeyD":
        transform.x += this.speed * deltaTime;
        break;
      default:
        break;
    }
  }
}

class NPCMovement extends Component {
  speed: number = 0.2;
  direction = [0, 0];
  accumulatedTime: number = 0;
  // @ts-ignore
  transform: TransformComponent;

  start() {
    this.transform = COMPONENTS[this.entity].transform!;
    if (!this.transform) {
      throw `no transform component on ${this.entity}`;
    }
  }

  private recomputeDirection() {
    const axis = Math.floor(Math.random() * 2);
    this.direction[axis] = Math.random() > 0.5 ? -1 : 1;
    this.direction[Math.abs(axis - 1)] = 0;
  }

  private isOutOfBoundsBy(distance: number) {
    return (
      this.transform.x > window.innerWidth + distance ||
      this.transform.x < -distance ||
      this.transform.y < -distance ||
      this.transform.y > window.innerHeight + distance
    );
  }

  update(deltaTime: number) {
    if (this.isOutOfBoundsBy(20) && this.accumulatedTime > 0) {
      this.direction[0] = -this.direction[0];
      this.direction[1] = -this.direction[1];
      this.accumulatedTime = 0;
      return;
    }

    if (this.accumulatedTime >= 2000) {
      this.recomputeDirection();
      this.accumulatedTime = 0;
      return;
    }

    this.accumulatedTime += deltaTime;

    const moveBy = this.speed * deltaTime;
    if (this.direction[1] === 1) {
      this.transform.y -= moveBy;
      return;
    }
    if (this.direction[1] === -1) {
      this.transform.y += moveBy;
      return;
    }
    if (this.direction[0] === -1) {
      this.transform.x -= moveBy;
      return;
    }
    if (this.direction[0] === 1) {
      this.transform.x += moveBy;
      return;
    }
  }
}

export const COMPONENTS: Record<Entity, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new DeathRenderComponent("player"),
    movement: new PlayerMovement("player"),
  },
  npc: {
    transform: new TransformComponent("npc", 200, 200),
    renderer: new NPCRenderComponent("npc"),
    movement: new NPCMovement("npc"),
  },
};

// const ENTITIES = {
//   player: 0,
//   npc1: 1,
//   npc2: 2,
//   npc3: 3,
// };
// const COMPONENTS_MATRIX = [
//   [
//     new TransformComponent(ENTITIES.player, 100, 100),
//     new DeathRenderComponent(ENTITIES.player),
//     new PlayerMovement(ENTITIES.player),
//   ],
// ];
