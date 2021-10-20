import RDFWorker from '@/utils/rdf.worker.js'
import { arrayBufferToObject, rdfToQuads } from '@/utils/utils'
import quadstore from '@/utils/sparql'

export function generateRDF(
  handleData,
  handleError,
  handleEnd,
  rml,
  inputFiles,
  toRDF = true
) {
  const start = new Date()
  const rocketRMLParams = { rml, inputFiles, toRDF }
  const worker = new RDFWorker()

  worker.postMessage(rocketRMLParams)

  worker.addEventListener('message', async ({ data }) => {
    if (data instanceof Error) {
      return handleError(data)
    }

    const { rdf, jsonld } = await arrayBufferToObject(data)

    if (!rdf && !jsonld) {
      return handleError(new Error('No data found'))
    }

    if (rdf) {
      const quads = rdfToQuads(rdf)
      await quadstore.replaceQuads(quads)
    } else {
      // json-ld
      await quadstore.replaceQuads([])
    }
    const elapsed = new Date() - start
    handleData({ rdf, jsonld, elapsed })

    handleEnd()
  })
}

export default {
  generateRDF
}
