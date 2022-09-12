import { ctx } from "./canvas";
import {
  initializeComponents,
  setComponents,
} from "./components/componentsMap";
import { worldSize } from "./utils";

const LS_PREFIX = "__0ctothorp/grim-reaper-dies-too__";
const LS_KEYS = {
  playedAlready: LS_PREFIX + ";playedAlready",
  highscore: LS_PREFIX + ";highscore",
};

type Screen = "game" | "uded" | "mainmenu";

class Game {
  private _screen: Screen = "mainmenu";
  #_level = 0;
  waitingForStart = 3000;
  score = 0;

  mainmenu: HTMLElement;
  howtoplay: HTMLElement;
  uded: HTMLElement;

  constructor() {
    const howtoplayBtn = document.getElementById("howtoplay-btn")!;
    this.howtoplay = document.getElementById("howtoplay")!;
    this.mainmenu = document.getElementById("mainmenu")!;
    this.uded = document.getElementById("uded")!;

    if (localStorage.getItem(LS_KEYS.playedAlready)) {
      howtoplayBtn.style.display = "initial";
    }

    howtoplayBtn.addEventListener("click", () => {
      this.mainmenu.style.display = "none";
      this.howtoplay.style.display = "block";
    });

    document.querySelector("#restart-btn")?.addEventListener("click", () => {
      this.level = 0;
      this.screen = "game";
      this.uded.style.display = "";
    });

    document.querySelector("#back-to-menu")?.addEventListener("click", () => {
      this.uded.style.display = "none";
      this.level = 0;
      this.screen = "mainmenu";
    });

    document
      .querySelectorAll(".start")
      .forEach((x) => x.addEventListener("click", () => this.handleStart()));
  }

  handleStart() {
    if (localStorage.getItem(LS_KEYS.playedAlready)) {
      this.howtoplay.style.display = "none";
      this.mainmenu.style.display = "none";
      this.screen = "game";
    } else {
      localStorage.setItem(LS_KEYS.playedAlready, "true");
      this.mainmenu.style.display = "none";
      this.howtoplay.style.display = "block";
    }
  }

  set screen(value) {
    this._screen = value;
    switch (value) {
      case "uded":
        this.handleUDed();
        break;
      case "mainmenu":
        this.mainmenu.style.display = "flex";
        this.waitingForStart = 3000;
        break;
      default:
        break;
    }
  }

  get screen() {
    return this._screen;
  }

  handleUDed() {
    this.uded.style.display = "block";
    const highscore = Number(localStorage.getItem(LS_KEYS.highscore)) || 0;
    const scoreEl = this.uded.querySelector(".score")!;
    if (this.score > highscore) {
      scoreEl.innerHTML = "🎉 " + this.score.toFixed() + " 🎉";
      localStorage.setItem(LS_KEYS.highscore, this.score.toFixed());
    } else {
      scoreEl.innerHTML = this.score.toFixed();
    }
    this.uded.querySelector(".highscore")!.innerHTML = highscore.toFixed();
  }

  set level(value: number) {
    this.#_level = value;

    setComponents(this.#_level);
    initializeComponents();
    this.waitingForStart = 3000;

    if (value === 0) {
      this.score = 0;
    } else {
      this.score += 1;
    }
  }

  get level() {
    return this.#_level;
  }

  canRunSystems() {
    return this.screen === "game" && !this.waitingForStart;
  }

  countdown(deltaTime: number) {
    if (this.screen !== "game") return;
    if (this.waitingForStart === 0) return;

    ctx.fillStyle = "white";
    ctx.font = `${worldSize(128)}px sans-serif`;
    ctx.fillText(
      parseInt((this.waitingForStart / 1000 + 1).toString()).toString(),
      window.innerWidth / 2 - 10,
      window.innerHeight / 2 - 10
    );

    this.waitingForStart = Math.max(this.waitingForStart - deltaTime, 0);
  }
}

export const GAME = new Game();
