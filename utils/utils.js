export const defaultExtension = 'txt'

export const mimeTypes = {
  csv: 'text/csv',
  json: 'application/json',
  jsonld: 'application/ld+json',
  nq: 'application/n-quads',
  rq: 'application/sparql-query',
  ttl: 'text/turtle',
  yaml: 'application/x-yaml',
  yml: 'application/x-yaml',
  [defaultExtension]: 'text/plain;charset=UTF-8'
}

export function createObjectURL(text, type = 'text/plain') {
  return window.URL.createObjectURL(new Blob([text], { type }))
}

export function revokeObjectURL(objectURL) {
  window.URL.revokeObjectURL(objectURL)
}

export function sendDownload(content, mimeType, extension) {
  // https://stackoverflow.com/questions/53772331/vue-html-js-how-to-download-a-file-to-browser-using-the-download-tag
  const link = document.createElement('a')
  link.href = createObjectURL(content, mimeType)
  link.download = 'results.' + extension
  link.click()
  revokeObjectURL(link.href)
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
