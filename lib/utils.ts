export function error(message: string): void {
  throw new Error(message)
}

export const enforceArray = (value: string | string[]): string[] =>
  typeof value === 'string' ? [value] : value
