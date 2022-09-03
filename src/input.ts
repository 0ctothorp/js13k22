export const INPUT: Record<string, boolean | undefined> = {};

export let LAST_MOVEMENT_KEY = "";
export const MOVEMENT: string[] = [];

const movementKeys = ["KeyW", "KeyA", "KeyS", "KeyD"];

window.addEventListener("keydown", (e) => {
  if (movementKeys.includes(e.code) && MOVEMENT[0] !== e.code) {
    LAST_MOVEMENT_KEY = e.code;
    MOVEMENT.unshift(e.code);
  }
  INPUT[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  if (movementKeys.includes(e.code)) {
    if (MOVEMENT[0] === e.code) {
      MOVEMENT.shift();
    }
    const i = MOVEMENT.findIndex((x) => x === e.code);
    if (i > -1) {
      MOVEMENT.splice(i, i);
    }
  }
  INPUT[e.code] = false;
});
