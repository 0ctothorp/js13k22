export function debounce(fn: () => void, time: number) {
  let t: number;

  return () => {
    clearTimeout(t);
    t = setTimeout(fn, time);
  };
}

export function getDebugDrawFPS(ctx: CanvasRenderingContext2D) {
  let lastFrames = 0;
  let frames = 0;
  let framesLastTime = 0;

  return (time: number) => {
    if (time - framesLastTime >= 1000) {
      framesLastTime = time;
      lastFrames = frames;
      frames = 0;
    } else {
      frames += 1;
    }

    ctx.font = "20px sans-serif";
    ctx.fillStyle = "green";
    ctx.fillText(
      lastFrames.toFixed(2),
      window.innerWidth - 70,
      window.innerHeight - 15
    );
  };
}

const REFERENCE_SCREEN_WIDTH = 1280;

export function worldSize(size: number) {
  const multiplier = window.innerWidth / REFERENCE_SCREEN_WIDTH;
  return size * multiplier;
}

export function range(count: number) {
  if (count < 1) {
    return [];
  }
  return [...Array(count).keys()];
}

export type Square = {
  x: number;
  y: number;
  size: number;
};
export function areSquaresColliding(s1: Square, s2: Square) {
  return !(
    s1.x > s2.x + s2.size ||
    s2.x > s1.x + s1.size ||
    s1.y > s2.y + s2.size ||
    s2.y > s1.y + s1.size
  );
}

export function loadImage(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}

export function noop() {}
