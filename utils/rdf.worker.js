import mapToRDF from '@/utils/map-to-rdf'

onmessage = async function({ data: { toRDF = true, ...rest } }) {
  try {
    const result = await mapToRDF({ toRDF, ...rest })
    // We need to stringify JSON-LD before
    const data = toRDF ? result : JSON.stringify(result)
    // Create ArrayBuffer (Transferable object)
    // https://stackoverflow.com/a/55204517/8238129
    const buffer = await new Response(new Blob([data])).arrayBuffer()
    // Transfer ArrayBuffer to main thread as transferable object
    // --> zero-copy, much faster
    postMessage(buffer, [buffer])
  } catch (error) {
    // RocketRML sometimes throws strings instead of Error objects.
    // We want to enforce an Error object here to properly handle it
    // in the main thread.
    const data = typeof error === 'string' ? new Error(error) : error
    postMessage(data)
  }
}
