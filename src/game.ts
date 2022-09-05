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
      // reconstruct entities and components
      console.log("restarting");
      setComponents(0);
      initializeComponents();
      this._screen = "game";
      document.getElementById("uded")!.style.display = "";
    });
  }

  set screen(value) {
    this._screen = value;
    document.getElementById("uded")!.style.display = "block";
  }

  get screen() {
    return this._screen;
  }
}

export const GAME = new Game();
