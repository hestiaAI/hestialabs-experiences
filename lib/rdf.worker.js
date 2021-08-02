import mapToRDF from '@/lib/map-to-rdf'

// Note by Valentin (dated 02.08.2021)
// I attempted to pass the functions to the worker directly as data.
// However, that is not posible since they are not serializable
// by the structured clone algorithm.
// Therefore, we define all functions globally and import them here.
// https://stackoverflow.com/a/7705809/8238129
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
// See here for possible solutions if we want to later define the functions locally per definition:
// https://dev.to/localazy/how-to-pass-function-to-web-workers-4ee1
// https://github.com/vkiryukhin/jsonfn
import functions from '@/definitions/functions'

onmessage = async function({ data: [rml, inputFiles] }) {
  try {
    const result = await mapToRDF(rml, inputFiles, functions)
    postMessage(result)
  } catch (error) {
    postMessage(error)
  }
}
