export function error(message: string) {
  throw new Error(message)
}

export const enforceArray = (value: string | string[]) =>
  typeof value === 'string' ? [value] : value
