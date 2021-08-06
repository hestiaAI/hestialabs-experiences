import { parseFileLive } from 'rocketrml'

// Note by Valentin (dated 02.08.2021)
// I attempted to pass the functions to the web worker directly as data.
// However, that is not possible since they are not serializable
// by the structured clone algorithm.
// Therefore, we define all functions globally and import them here.
// https://stackoverflow.com/a/7705809/8238129
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
// See here for possible solutions if we want to later define the functions locally per definition:
// https://dev.to/localazy/how-to-pass-function-to-web-workers-4ee1
// https://github.com/vkiryukhin/jsonfn
import functions from '@/manifests/functions'

/**
 * Parses the input files to RDF using the provided RML
 * @param  {String} rml
 * @param  {Object} inputFiles
 * @param  {Boolean} toRDF=true
 * @param  {Object} functions={}
 * @returns a promise that when resolved, outputs the RDF contents
 */
export default async (rml, inputFiles) => {
  const rocketrmlOptions = {
    verbose: true,
    xmlPerformanceMode: false,
    replace: false,
    toRDF: true,
    ignoreEmptyStrings: false,
    functions
  }

  return await parseFileLive(rml, inputFiles, rocketrmlOptions)
}
