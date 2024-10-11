export function compareCategories(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2);
}
