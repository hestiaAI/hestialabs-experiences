import mapToRDF from '@/lib/map-to-rdf'

onmessage = async function({ data: [rml, inputFiles, toRDF] }) {
  try {
    const result = await mapToRDF(rml, inputFiles, toRDF)
    // Create ArrayBuffer (Transferable object)
    // https://stackoverflow.com/a/55204517/8238129
    const buffer = await new Response(new Blob([result])).arrayBuffer()
    // Transfer ArrayBuffer to main thread as transferable object
    // --> zero-copy, much faster
    postMessage(buffer, [buffer])
  } catch (error) {
    postMessage(error)
  }
}
