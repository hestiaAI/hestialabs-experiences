import { posix } from 'path'
import { JSONPath } from 'jsonpath-plus'
import minimatch from 'minimatch'
import Ajv from 'ajv'
const ajv = new Ajv()
const path = posix

function findObjects(fileDict, accessor) {
  return Object.entries(fileDict)
    .flatMap(([name, content]) => matchObjects(name, content, accessor))
    .filter(found => !!found)
}

function matchObjects(fileName, fileContent, accessor) {
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
  const found = JSONPath({ path: jsonPath, json: fileContent })
  if (found.length === 0) {
    return null
  }
  // TODO test jsonSchema validation
  if (jsonSchema) {
    const validate = ajv.compile(jsonSchema)
    return found.filter(f => validate(f))
  }
  return found
}

function matchFiles(files, pattern) {
  return Object.entries(files).filter(([name]) =>
    matchNormalized(name, pattern)
  )
}

function matchNormalized(name, pattern) {
  const normalizedPattern = path.normalize(pattern)
  return minimatch(name, normalizedPattern)
}

test('normalize and match', () => {
  expect(minimatch('bar.foo', '*.foo')).toBe(true)
  expect(path.normalize('/foo//baz/asdf/quux/..')).toBe('/foo/baz/asdf')
  expect(path.normalize('/foo//**/asdf/quux/..')).toBe('/foo/**/asdf')
  expect(path.normalize('foo/**//asdf/quux/..')).toBe('foo/**/asdf')

  expect(matchNormalized('bar.foo', '*.foo')).toBe(true)
  expect(matchNormalized('/foo/asdf', '/foo//asdf/quux/..')).toBe(true)
  expect(matchNormalized('/foo/bar.foo', '/foo//asdf/../*.foo')).toBe(true)
})

test('find files', () => {
  const files = {
    '/bambalam/rototo/woo.png': { furniture: [{ s: 4 }, { s: 1 }] },
    '/bomba.csv': { furniture: [{ s: 4 }, { s: 2 }] },
    '/bambalam/rototo/woo.csv': { furniture: [{ s: 4 }, { s: 2 }, { s: 1 }] }
  }
  const found = matchFiles(files, '**/*.csv')
  expect(found.length).toBe(2)
  expect(found[0][0]).toBe('/bomba.csv')
  expect(found[1][0]).toBe('/bambalam/rototo/woo.csv')
})

const mkA = (filePath, jsonPath) => ({ filePath, jsonPath })

test('match objects', () => {
  const content = { fur: [{ s: 5 }, { s: 4 }] }

  let found = matchObjects('/bo.c', content, mkA('**/bo.c'))
  expect(found[0]).toStrictEqual(content)

  found = matchObjects('/bo.c', content, mkA('**/bo.c', '$.fur[0]'))
  expect(found[0]).toStrictEqual({ s: 5 })

  found = matchObjects('/ob.c', content, mkA('**/bo.c', '$.furn[0]'))
  expect(found).toStrictEqual(null)

  found = matchObjects('/bo.c', content, mkA('**/bo.c', '$.furni[0]'))
  expect(found).toStrictEqual(null)
})

test('find objects', () => {
  const files = {
    '/bambalam/rototo/woo.png': { furniture: [{ s: 4 }, { s: 1 }] },
    '/bomba.csv': { furniture: [{ s: 5 }, { s: 4 }, { s: 2 }] },
    '/bambalam/rototo/woo.csv': { furniture: [{ s: 4 }, { s: 2 }, { s: 1 }] }
  }

  const found = findObjects(files, {
    filePath: '/bomba.csv',
    jsonPath: '$.furniture[0]'
  })
  expect(found[0]).toStrictEqual({ s: 5 })
})

test('jsonpath examples', () => {
  const json = { furniture: [{ s: 4 }, { s: 1 }] }
  expect(JSONPath({ path: '$.foo', json })).toStrictEqual([])
  expect(JSONPath({ path: '$.furniture', json })).toStrictEqual([
    json.furniture
  ])
  expect(JSONPath({ path: '$..furniture[?(@.s==1)]', json })).toStrictEqual([
    { s: 1 }
  ])
})

test('ajv examples', () => {
  const schema = {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'string' }
    },
    required: ['foo']
    // additionalProperties: true
  }

  const validate = ajv.compile(schema)

  expect(validate({ foo: 1, bul: 'tt', bar: 'abc' })).toBe(true)
  expect(validate({ foo: 1, bar: 'ABC' })).toBe(true)
  expect(validate({ foo: 1 })).toBe(true)
  expect(validate({ bar: 'ABC' })).toBe(false)
})
