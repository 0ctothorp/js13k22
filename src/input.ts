export const INPUT: Record<string, boolean | undefined> = {};

window.addEventListener("keydown", (e) => {
  INPUT[e.code] = true;
});

window.addEventListener("keyup", (e) => {
  INPUT[e.code] = false;
});
