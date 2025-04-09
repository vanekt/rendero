export const getKeysValues = (
  obj: Record<string, unknown> = {},
): [string[], unknown[]] => [Object.keys(obj), Object.values(obj)];
