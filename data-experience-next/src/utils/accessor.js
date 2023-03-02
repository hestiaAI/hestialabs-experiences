import normalize from 'normalize-path'
import { JSONPath } from 'jsonpath-plus'
import micromatch from 'micromatch'
import Ajv from 'ajv'
const ajv = new Ajv()

export function createAccessor(filePath, jsonPath, jsonSchema) {
  const accessor = {}
  if (filePath) {
    accessor.filePath = filePath
  }
  if (jsonPath) {
    accessor.jsonPath = jsonPath
  }
  if (jsonSchema) {
    accessor.jsonSchema = jsonSchema
  }
  return accessor
}

export function matchNormalized(name, pattern) {
  const normalizedPattern = normalize(pattern)
  return micromatch.isMatch(name, normalizedPattern)
}

// https://github.com/micromatch/micromatch/issues/227
export function filePathToGlob(filePath) {
  if (!filePath) {
    throw new Error(`cannot create glob for file path "${filePath}"`)
  }
  return filePath.replace(/([[\]{}*!()])/g, '\\$1')
}

/**
 * Find objects in a file that match an accessor
 * Returns an array containing all of the matches,
 * or null if no match is found (similar behavior to RegExp.match).
 * @param {String} fileName the name of the file that should match
 * @param {Object} fileContent the content of the file (parsed json)
 * @param {Object} accessor the accessor being matched against the file.
 *
 * The type of the accessor is:
 * { filePath: String, jsonPath: String, jsonSchema: Object }
 *
 * filePath can contain globs like **\/*.cs
 * and normalizes paths like foo/../bar to foo/
 * see https://github.com/isaacs/minimatch
 *
 * jsonPath uses the normal jsonPath syntax.
 * see https://github.com/JSONPath-Plus/JSONPath
 *
 * jsonSchema is a parsed json object in the JsonSchema syntax.
 * We're using the default syntax of https://ajv.js.org/
 *
 */
export function findMatches(fileName, fileContent, accessor) {
  const { filePath } = accessor
  if (!filePath) {
    throw new Error('filePath missing')
  }
  const fileMatches = matchNormalized(fileName, filePath)
  if (!fileMatches) {
    return null
  }
  return findMatchesInContent(fileContent, accessor)
}

/**
 * Find objects in a fileContent that match an accessor
 * Returns an array containing all of the matches,
 * or null if no match is found (similar behavior to RegExp.match).
 * @param {Object} fileContent the content of the file (parsed json)
 * @param {Object} accessor the accessor being matched against the file.
 *
 * The type of the accessor is:
 * { filePath: String, jsonPath: String, jsonSchema: Object }
 *
 * jsonPath uses the normal jsonPath syntax.
 * see https://github.com/JSONPath-Plus/JSONPath
 *
 * jsonSchema is a parsed json object in the JsonSchema syntax.
 * We're using the default syntax of https://ajv.js.org/
 *
 */
export function findMatchesInContent(fileContent, accessor) {
  const { jsonPath, jsonSchema } = accessor
  if (!jsonPath && jsonSchema) {
    throw new Error('jsonPath missing')
  }
  if (jsonPath && typeof fileContent !== 'object') {
    throw new Error('jsonPath requires fileContent of type object')
  }
  if (!jsonPath) {
    return [fileContent]
  }
  let found = JSONPath({ path: jsonPath, json: fileContent })
  if (jsonSchema) {
    const validate = ajv.compile(jsonSchema)
    found = found.filter(f => validate(f))
  }
  if (found.length === 0) {
    return null
  }
  return found
}
