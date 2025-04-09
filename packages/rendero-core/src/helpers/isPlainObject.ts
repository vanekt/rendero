export function isPlainObject(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;

  const proto = Object.getPrototypeOf(value);

  if (proto !== Object.prototype && proto !== null) return false;

  return Object.prototype.toString.call(value) === "[object Object]";
}
