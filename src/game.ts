import {
  initializeComponents,
  setComponents,
} from "./components/componentsMap";

type Screen = "game" | "uded" | "mainmenu";

class Game {
  private _screen: Screen = "game";
  private _paused = false;

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
}

export const GAME = new Game();
