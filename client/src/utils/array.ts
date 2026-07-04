export const uniqObjectArray = <T>(items: Array<T>) =>
  [...new Set(items.map(item => JSON.stringify(item)))].map(stringItem =>
    JSON.parse(stringItem),
  );

export function uniqBy<T extends object, K extends keyof T>(
  array: T[],
  key: K,
): T[] {
  return [...new Map(array.map(item => [item[key], item])).values()];
}
