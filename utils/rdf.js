import RDFWorker from '@/utils/rdf.worker.js'
import { arrayBufferToObject, rdfToQuads } from '@/utils/utils'
import quadstore from '@/utils/sparql'

export function generateRDF(rml, inputFiles, toRDF = true) {
  const rocketRMLParams = { rml, inputFiles, toRDF }
  const worker = new RDFWorker()

  worker.postMessage(rocketRMLParams)

  worker.addEventListener('message', async ({ data }) => {
    if (data instanceof Error) {
      throw data
    }

    const { rdf, jsonld } = await arrayBufferToObject(data)

    if (!rdf && !jsonld) {
      throw new Error(
        'No data found. Check that the file hierarchy has not been modified after downloading it from the data portal.'
      )
    }

    if (rdf) {
      const quads = rdfToQuads(rdf)
      await quadstore.replaceQuads(quads)
    } else {
      // json-ld
      await quadstore.replaceQuads([])
    }
  })
}

export default {
  generateRDF
}
