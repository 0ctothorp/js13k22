import { getMapSize } from "./components/componentsMap";
import { GAME } from "./game";
import { worldSize } from "./utils";

export function tilePositionToScreenPosition(x: number, y: number) {
  const map = getMapSize(GAME.level);
  return {
    x:
      window.innerWidth / 2 -
      (map.width * worldSize(32)) / 2 +
      x * worldSize(32),
    y:
      window.innerHeight / 2 -
      (map.height / 2) * worldSize(32) +
      y * worldSize(32),
  };
}
