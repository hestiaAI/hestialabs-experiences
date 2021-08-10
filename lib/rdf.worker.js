import mapToRDF from '@/lib/map-to-rdf'

onmessage = async function({ data: [rml, inputFiles, toRDF] }) {
  try {
    const result = await mapToRDF(rml, inputFiles, toRDF)
    postMessage(result)
  } catch (error) {
    postMessage(error)
  }
}
