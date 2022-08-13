export function debounce(fn: () => void, time: number) {
  let t: number;

  return () => {
    clearTimeout(t);
    t = setTimeout(fn, time);
  };
}
