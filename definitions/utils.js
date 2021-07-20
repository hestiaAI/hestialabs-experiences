export const sourceArraysToObjects = sources =>
  sources.map(([key, file, iterator]) => ({ key, file, iterator }))
