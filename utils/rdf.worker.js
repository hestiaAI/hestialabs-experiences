import mapToRDF from '@/utils/map-to-rdf'
import { objectToArrayBuffer } from '@/utils/utils'

self.onmessage = async function ({ data: { toRDF = true, ...rest } }) {
  try {
    // rdf is either in triples or JSON-LD
    const result = await mapToRDF({ toRDF, ...rest })
    // Need to stringify JSON-LD
    const data = toRDF ? { rdf: result } : { jsonld: JSON.stringify(result) }
    const buffer = await objectToArrayBuffer(data)
    self.postMessage(buffer, [buffer])
  } catch (error) {
    // RocketRML sometimes throws strings instead of Error objects.
    // We want to enforce an Error object here to properly handle it
    // in the main thread.
    const data = typeof error === 'string' ? new Error(error) : error
    self.postMessage(data)
  }
}
