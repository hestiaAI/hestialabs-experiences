import { Parser } from 'n3'

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
  png: 'image/png',
  jpeg: 'image/jpeg',
  zip: 'application/zip',
  [defaultExtension]: 'text/plain;charset=UTF-8'
}

export function createObjectURL(data, type = 'text/plain') {
  if (data instanceof Blob) {
    return window.URL.createObjectURL(data)
  }
  return window.URL.createObjectURL(new Blob([data], { type }))
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

export async function objectToArrayBuffer(obj) {
  // Create ArrayBuffer (Transferable object)
  // https://stackoverflow.com/a/55204517/8238129
  // Transfer ArrayBuffer to main thread as transferable object
  // --> zero-copy, much faster
  const data = JSON.stringify(obj)
  return await new Response(new Blob([data])).arrayBuffer()
}

export async function arrayBufferToObject(arrayBuffer) {
  // Worker returns ArrayBuffer
  // We create a Blob from it
  // and then use Blob.text() that resolves with a string
  const blob = new Blob([arrayBuffer])
  const text = await blob.text()
  return JSON.parse(text)
}

/**
 * Converts an rdf string to N3 quads
 * @param {String} rdf the input RDF data
 * @param {String} format
 * @returns {Array} N3 quads
 */
export function rdfToQuads(rdf, format = 'N3') {
  const parser = new Parser({ format })
  const quads = parser.parse(rdf)
  return quads
}

/* Transform integer x to a string of length n, left-padded with zeros. */
export function padNumber(x, n) {
  return x.toString().padStart(n, '0')
}

/**
 * Run a worker without callbacks
 * <pre>
 *   const workResult = await runWorker(new UnionizedWorker(), args)
 * </pre>
 */
export function runWorker(worker, args) {
  worker.postMessage(args)
  return new Promise((resolve, reject) => {
    worker.addEventListener('message', message => {
      resolve(message.data)
    })
    worker.addEventListener('error', error => {
      console.error('worker error', error)
      reject(error)
    })
    worker.addEventListener('messageerror', error => {
      console.error('worker error', error)
      reject(error)
    })
  })
}

export const setTimeoutPromise = (delay, value) =>
  new Promise(resolve => setTimeout(resolve, delay, value))

/* Shallow equality test on sets */
export function setsEqual(s1, s2) {
  return s1.size === s2.size && [...s1].every(value => s2.has(value))
}

export function humanReadableFileSize(sizeInBytes) {
  const i = Math.floor(Math.log(sizeInBytes || 1) / Math.log(1024))
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  return `${(sizeInBytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`
}

export function plurify(word, n) {
  return n === 1 ? word : `${word}s`
}
