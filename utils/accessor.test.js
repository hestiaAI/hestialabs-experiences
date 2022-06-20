import { posix } from 'path'
import { JSONPath } from 'jsonpath-plus'
import micromatch from 'micromatch'
import Ajv from 'ajv'
import {
  matchNormalized,
  findMatches,
  filePathToGlob,
  createAccessor
} from './accessor'

const ajv = new Ajv()
const posixPath = posix

function findObjects (fileDict, accessor) {
  return Object.entries(fileDict)
    .flatMap(([name, content]) => findMatches(name, content, accessor))
    .filter(found => !!found)
}

function matchFiles (files, pattern) {
  return Object.entries(files).filter(([name]) =>
    matchNormalized(name, pattern)
  )
}

test('normalize and match', () => {
  expect(micromatch.isMatch('bar.foo', '*.foo')).toBe(true)
  expect(micromatch.isMatch('ba[r].foo', '*.foo')).toBe(true)
  expect(micromatch.isMatch('bar.foo', 'ba[r].foo')).toBe(true)
  expect(micromatch.isMatch('bar.foo', 'ba[ra].foo')).toBe(true)
  expect(micromatch.isMatch('baa.foo', 'ba[ra].foo')).toBe(true)
  expect(micromatch.isMatch('ba[r].foo', 'ba[r].foo')).toBe(true)
  expect(micromatch.isMatch('ba[r].foo', 'ba\\[r\\].foo')).toBe(true)
  expect(micromatch.isMatch('ba[r].foo', 'ba[ra].foo')).toBe(false)

  expect(posixPath.normalize('/a/b/../bar.foo')).toBe('/a/bar.foo')
  expect(posixPath.normalize('/foo//baz/asdf/quux/..')).toBe('/foo/baz/asdf')
  expect(posixPath.normalize('/foo//**/asdf/quux/..')).toBe('/foo/**/asdf')
  expect(posixPath.normalize('foo/**//asdf/quux/..')).toBe('foo/**/asdf')
  expect(posixPath.normalize('/foo//**/{a,s}f/quux/..')).toBe('/foo/**/{a,s}f')
  expect(posixPath.normalize('/foo//**/[:]}f/quux/..')).toBe('/foo/**/[:]}f')

  expect(matchNormalized('/a/bar.foo', '/a/b/../bar.foo')).toBe(true)
  expect(matchNormalized('bar.foo', '*.foo')).toBe(true)
  expect(matchNormalized('bar.foo', '*.fo{o,a}')).toBe(true)
  expect(matchNormalized('bar.fo{o,a}', '*.fo\\{o,a\\}')).toBe(true)
  expect(matchNormalized('/foo/asdf', '/foo//asdf/quux/..')).toBe(true)
  expect(matchNormalized('/foo/bar.foo', '/foo//asdf/../*.foo')).toBe(true)
})

test('filePathToGlob', () => {
  const testConversion = (path, glob, shouldNotMatch) => {
    expect(filePathToGlob(path)).toBe(glob)
    expect(micromatch.isMatch(path, glob)).toBe(true)
    expect(micromatch.isMatch(path, filePathToGlob(path))).toBe(true)
    expect(micromatch.isMatch(shouldNotMatch, glob)).toBe(false)
    expect(micromatch.isMatch(shouldNotMatch, path)).toBe(true)
  }
  testConversion('ba[r].foo', 'ba\\[r\\].foo', 'bar.foo')
  testConversion('ba[r-t].foo', 'ba\\[r-t\\].foo', 'bas.foo')
  testConversion('ba*.foo', 'ba\\*.foo', 'bar.foo')
  testConversion('!baa.foo', '\\!baa.foo', 'bar.foo')
  testConversion('*.!(a)', '\\*.\\!\\(a\\)', 'a.b')
  testConversion('foo/{a,b,c}/bar', 'foo/\\{a,b,c\\}/bar', 'foo/a/bar')
  testConversion('ba?(a).foo', 'ba?\\(a\\).foo', 'baa.foo')
  testConversion('ba*(a).foo', 'ba\\*\\(a\\).foo', 'baa.foo')
  testConversion('ba@(a).foo', 'ba@\\(a\\).foo', 'baa.foo')
  testConversion('ba+(a).foo', 'ba+\\(a\\).foo', 'baa.foo')
  testConversion('ba[[:alpha:]]', 'ba\\[\\[:alpha:\\]\\]', 'baa')
  testConversion(
    '{f,b}*/{1..3}/{b,q}*',
    '\\{f,b\\}\\*/\\{1..3\\}/\\{b,q\\}\\*',
    'foo/2/qux'
  )
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

const mkA = createAccessor

test('match objects', () => {
  const content = { fur: [{ s: 5 }, { s: 4 }] }

  const schema = {
    type: 'object',
    properties: { s: { type: 'integer' } },
    required: ['s']
  }

  let found = findMatches('/bo.c', content, mkA('**/bo.c'))
  expect(found[0]).toStrictEqual(content)

  found = findMatches('/bo.c', content, mkA('**/bo.c', '$.fur[0]'))
  expect(found[0]).toStrictEqual({ s: 5 })

  found = findMatches('/bo.c', content, mkA('**/bo.c', '$.fur[0]', schema))
  expect(found[0]).toStrictEqual({ s: 5 })

  const wrongSchema = {
    type: 'object',
    properties: { s: { type: 'string' } },
    required: ['s']
  }
  found = findMatches('/bo.c', content, mkA('**/bo.c', '$.fur[0]', wrongSchema))
  expect(found).toStrictEqual(null)

  found = findMatches('/ob.c', content, mkA('**/bo.c', '$.furn[0]'))
  expect(found).toStrictEqual(null)

  found = findMatches('/bo.c', content, mkA('**/bo.c', '$.furni[0]'))
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
  const schema1 = {
    type: 'object',
    properties: {
      foo: { type: 'integer' },
      bar: { type: 'string' }
    },
    required: ['foo']
    // additionalProperties: true
  }

  const validate1 = ajv.compile(schema1)
  expect(validate1({ foo: 1, bul: 'tt', bar: 'abc' })).toBe(true)
  expect(validate1({ foo: 1, bar: 'ABC' })).toBe(true)
  expect(validate1({ foo: 1 })).toBe(true)
  expect(validate1({ bar: 'ABC' })).toBe(false)

  const schema2 = {
    type: 'object',
    properties: {
      fur: {
        type: 'array',
        items: {
          type: 'object',
          properties: { s: { type: 'integer' } },
          required: ['s']
        }
      }
    },
    required: ['fur']
  }
  const validate2 = ajv.compile(schema2)
  expect(validate2({ fur: [{ s: 5 }, { s: 4 }] })).toBe(true)
})
