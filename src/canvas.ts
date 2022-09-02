import { debounce } from "./utils";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const canvas = document.querySelector("canvas")!;
resizeCanvas();
window.addEventListener("resize", debounce(resizeCanvas, 100));

export const ctx = canvas.getContext("2d")!;

export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
