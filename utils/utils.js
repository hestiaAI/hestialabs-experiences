export function createObjectURL(text, type = 'text/plain') {
  return window.URL.createObjectURL(new Blob([text], { type }))
}

export function revokeObjectURL(objectURL) {
  window.URL.revokeObjectURL(objectURL)
}

export function objectIsEmpty(obj) {
  // https://stackoverflow.com/a/32108184/8238129
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object
}

export function processError(v) {
  if (v.stack) {
    return v.stack
  }

  if (typeof v === 'object') {
    return Object.entries(v)
      .reduce((acc, [k, v]) => `${acc}${k}: ${v}\n`, 'ERROR\n')
      .trimRight()
  }

  return v
}
