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

    ctx.font = "30px sans-serif";
    ctx.fillStyle = "green";
    ctx.fillText(lastFrames.toFixed(2), 20, 40);
  };
}

const REFERENCE_SCREEN_WIDTH = 1280;

export function worldSize(size: number) {
  const multiplier = window.innerWidth / REFERENCE_SCREEN_WIDTH;
  return size * multiplier;
}
