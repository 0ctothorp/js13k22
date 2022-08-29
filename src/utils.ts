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
  return Array(count)
    .fill(null)
    .map((_, i) => i + 1);
}
