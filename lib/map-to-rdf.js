import { parseFileLive } from 'rocketrml'

/**
 * Parses the input files to RDF using the provided RML
 * @param  {String} rml
 * @param  {Object} inputFiles
 * @param  {Boolean} toRDF=true
 * @param  {Object} functions={}
 * @returns a promise that when resolved, outputs the RDF contents
 */
export default async (rml, inputFiles, functions) => {
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
