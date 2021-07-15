import { parseFileLive } from 'rocketrml'

/**
 * Parses the input files to RDF using the provided RML
 * @param  {String} rml
 * @param  {Object} inputFiles
 * @param  {Boolean} toRDF=true
 * @param  {Object} functions={}
 * @returns a promise that when resolved, outputs the RDF contents
 */
export default async (rml, inputFiles, toRDF = true, functions = {}) => {
  const options = {
    toRDF,
    verbose: true,
    xmlPerformanceMode: false,
    replace: false,
    functions
  }
  const result = await parseFileLive(rml, inputFiles, options)
  return result
}
