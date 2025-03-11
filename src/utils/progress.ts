let previousProgress = 0;

export function generateProgress(min: number, max: number) {
  // Generate a random number but ensure it's higher than the previous progress
  const newProgress = Math.max(
    previousProgress,
    Math.random() * (max - min) + min,
  );

  previousProgress = newProgress;
  return newProgress;
}
