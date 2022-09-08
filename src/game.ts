import { ctx } from "./canvas";
import {
  initializeComponents,
  setComponents,
} from "./components/componentsMap";

type Screen = "game" | "uded" | "mainmenu";

class Game {
  private _screen: Screen = "game";
  private _paused = false;
  #_level = 1;
  waitingForStart = 0;

  constructor() {
    document.querySelector("#uded button")?.addEventListener("click", () => {
      setComponents(0);
      initializeComponents();
      this._screen = "game";
      document.getElementById("uded")!.style.display = "";
    });
  }

  set screen(value) {
    this._screen = value;
    switch (value) {
      case "uded":
        document.getElementById("uded")!.style.display = "block";
        break;
      // case "uwon":
      //   document.getElementById("uwon")!.style.display = "block";
      //   break;
      default:
        break;
    }
  }

  get screen() {
    return this._screen;
  }

  set level(value: number) {
    this.#_level = value;

    setComponents(this.#_level);
    initializeComponents();
    this.waitingForStart = 3000;
  }

  get level() {
    return this.#_level;
  }

  canRunSystems() {
    return this.screen === "game" && !this.waitingForStart;
  }

  countdown(deltaTime: number) {
    if (this.waitingForStart === 0) return;

    ctx.fillText(
      parseInt((this.waitingForStart / 1000).toString()).toString(),
      window.innerWidth / 2 - 10,
      window.innerHeight / 2 - 10
    );

    this.waitingForStart = Math.max(this.waitingForStart - deltaTime, 0);
  }
}

export const GAME = new Game();
