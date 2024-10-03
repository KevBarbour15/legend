export function getItemName(item: any): string {
  let arr = item.split(" - ");

  return arr[0].trim();
}

export function getItemBrand(item: any): string {
  let arr = item.split(" - ");

  return arr[arr.length - 1].trim();
}
