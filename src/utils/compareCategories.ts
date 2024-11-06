export function compareCategories(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const sortedArr1 = [...arr1].sort();
  const sortedArr2 = [...arr2].sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    console.log(sortedArr1[i] + " ------ " + sortedArr2[i]);
    if (
      sortedArr1[i].toLowerCase().trim() !== sortedArr2[i].toLowerCase().trim()
    ) {
      console.log("**** FALSE ****");
      return false;
    }
  }

  return true;
}
