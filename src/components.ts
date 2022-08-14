import { Entity } from "./entities";
import { INPUT } from "./input";

export type Components = {
  transform: TransformComponent;
  renderer: RenderComponent;
  movement: Movement;
};

class Component {
  protected entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
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

interface Movement {
  move(deltaTime: number): void;
}

class PlayerMovement extends Component implements Movement {
  speed: number = 0.5;

  move(deltaTime: number) {
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

export const COMPONENTS: Record<Entity, Partial<Components>> = {
  player: {
    transform: new TransformComponent("player", 100, 100),
    renderer: new RenderComponent("player"),
    movement: new PlayerMovement("player"),
  },
};
