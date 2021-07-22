export const isError = obj => obj instanceof Error
export function createObjectURL(text, type = 'text/plain') {
  return window.URL.createObjectURL(new Blob([text]), { type })
}
