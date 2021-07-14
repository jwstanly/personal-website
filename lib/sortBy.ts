export default function sortBy<T extends object>(
  list: T[],
  property: string,
): T[] {
  return list.sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return 0;
  });
}
