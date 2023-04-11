export function encodeObject(obj) {
  return Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, encodeURIComponent(val)]))
}
