import { getMapSize } from "./components/componentsMap";
import { GAME } from "./game";
import { Point } from "./types";
import { UNIT, worldSize } from "./utils";

export function tilePositionToScreenPosition({ x, y }: Point) {
  const map = getMapSize(GAME.level);
  return {
    x:
      window.innerWidth / 2 -
      (map.width * worldSize(UNIT)) / 2 +
      x * worldSize(UNIT),
    y:
      window.innerHeight / 2 -
      (map.height / 2) * worldSize(UNIT) +
      y * worldSize(UNIT),
  };
}
