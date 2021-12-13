import { posix } from 'path'
import { JSONPath } from 'jsonpath-plus'
import minimatch from 'minimatch'
import Ajv from 'ajv'
const ajv = new Ajv()
const path = posix

export function matchNormalized(name, pattern) {
  const normalizedPattern = path.normalize(pattern)
  return minimatch(name, normalizedPattern)
}

export function findMatches(fileName, fileContent, accessor) {
  const { filePath, jsonPath, jsonSchema } = accessor
  if (!filePath) {
    throw new Error('filePath missing')
  }
  if (!jsonPath && jsonSchema) {
    throw new Error('jsonPath missing')
  }
  if (jsonPath && typeof fileContent !== 'object') {
    throw new Error('jsonPath requires fileContent of type object')
  }
  const fileMatches = matchNormalized(fileName, filePath)
  if (!fileMatches) {
    return null
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
