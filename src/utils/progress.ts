export function generateProgress(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
