import mapToRDF from '@/lib/map-to-rdf'

onmessage = async function({ data: [rml, inputFiles] }) {
  try {
    const result = await mapToRDF(rml, inputFiles)
    postMessage(result)
  } catch (error) {
    postMessage(error)
  }
}
