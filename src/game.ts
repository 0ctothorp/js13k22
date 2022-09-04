type Game = {
  screen: "game" | "uded" | "mainmenu";
  paused: boolean;
};

export const GAME: Game = {
  screen: "game",
  paused: false,
};
