import mapToRDF from '@/lib/map-to-rdf'
import RDFWorker from '@/lib/rdf.worker.js'

const noDataError = new Error('No data found')

export async function generateRDF(
  handleData,
  handleError,
  handleEnd,
  rml,
  inputFiles,
  toRDF = true
) {
  const rocketRMLParams = { rml, inputFiles, toRDF }
  if (window.Worker) {
    const worker = new RDFWorker()

    worker.postMessage(rocketRMLParams)

    worker.addEventListener('message', async ({ data }) => {
      if (data instanceof Error) {
        handleError(data)
      } else {
        // Worker returns ArrayBuffer
        // We create a Blob from it
        // and then use Blob.text() that resolves with a string
        const blob = new Blob([data])
        const text = await blob.text()
        if (!text) {
          handleError(noDataError)
        } else {
          handleData(text)
        }
      }

      handleEnd()
    })
  } else {
    console.warn('Your browser does not support web workers.')
    try {
      const data = await mapToRDF(rocketRMLParams)
      if (!data) {
        handleError(noDataError)
      } else {
        handleData(data)
      }
    } catch (error) {
      handleError(error)
    } finally {
      handleEnd()
    }
  }
}

export default {
  generateRDF
}
