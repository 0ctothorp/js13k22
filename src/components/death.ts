import { INPUT } from "../input";
import { worldSize } from "../utils";
import { BaseComponent, Renderer } from "./common";
import { COMPONENTS } from "./componentsMap";

export class DeathRenderComponent extends BaseComponent implements Renderer {
  render(ctx: CanvasRenderingContext2D) {
    const transformComponent = COMPONENTS[this.entity]["transform"];
    if (!transformComponent) {
      console.error(`no transform component on ${this.entity}`);
      return;
    }

    const { x, y } = transformComponent;
    ctx.font = `${worldSize(40)}px sans-serif`;
    ctx.fillText("💀", x, y);
  }
}

export class PlayerMovement extends BaseComponent {
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
