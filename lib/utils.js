export const isError = obj => obj instanceof Error
export function createObjectURL(text, type = 'text/plain') {
  return window.URL.createObjectURL(new Blob([text]), { type })
}
export function objectIsEmpty(obj) {
  // https://stackoverflow.com/a/32108184/8238129
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}
