import { JSONPath } from 'jsonpath-plus'
import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import itemifyJSON, { pathArrayToJsonPath } from '~/utils/json'

const ic = mdiCodeJson
const is = mdiFormatListBulletedSquare
const ii = mdiInformationOutline

test('simple itemifyJSON', () => {
  const json = { n: 'root' }
  const correctItems = [
    {
      icon: ic,
      id: 2,
      path: [],
      name: '{attributes N}',
      children: [{ id: 2, path: ['n'], value: 'root', icon: ii, name: 'N' }]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))

  expect(items).toStrictEqual(correctItems)
})

test('itemifyJSON with empty array/object', () => {
  const json = { n: [], o: {} }
  const correctItems = [
    {
      icon: ic,
      id: 3,
      path: [],
      name: '{attributes N, O}',
      children: [
        {
          id: 2,
          path: ['n'],
          icon: is,
          name: 'N / [empty list]'
        },
        {
          id: 3,
          path: ['o'],
          icon: ic,
          name: 'O / {no attributes}'
        }
      ]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))

  expect(items).toStrictEqual(correctItems)
})
test('complex itemifyJSON', () => {
  const json = {
    n: 'root',
    a: { n: 'child', b: [{ c: 1, d: 'roro' }, { c: 2 }, 'meuh'] }
  }
  const correctItems = [
    {
      icon: ic,
      id: 11,
      name: '{attributes N, A}',
      path: [],
      children: [
        { id: 2, path: ['n'], value: 'root', icon: ii, name: 'N' },
        {
          icon: ic,
          id: 11,
          name: 'A / {attributes N, B}',
          path: ['a'],
          children: [
            {
              icon: ii,
              id: 4,
              path: ['a', 'n'],
              name: 'N',
              value: 'child'
            },
            {
              icon: is,
              id: 11,
              name: 'B / [list with 3 items]',
              path: ['a', 'b'],
              children: [
                {
                  children: [
                    {
                      icon: ii,
                      id: 7,
                      path: ['a', 'b', 0, 'c'],
                      name: 'C',
                      value: 1
                    },
                    {
                      icon: ii,
                      id: 8,
                      path: ['a', 'b', 0, 'd'],
                      name: 'D',
                      value: 'roro'
                    }
                  ],
                  icon: ic,
                  id: 8,
                  path: ['a', 'b', 0],
                  name: '{attributes C, D}'
                },
                {
                  children: [
                    {
                      icon: ii,
                      id: 10,
                      path: ['a', 'b', 1, 'c'],
                      name: 'C',
                      value: 2
                    }
                  ],
                  icon: ic,
                  id: 10,
                  path: ['a', 'b', 1],
                  name: '{attributes C}'
                },
                {
                  icon: ii,
                  id: 11,
                  path: ['a', 'b', 2],
                  value: 'meuh'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))
  expect(items).toStrictEqual(correctItems)
})

test('complex itemifyJSON with filter that matches', () => {
  const json = {
    n: 'root',
    a: { n: 'child', b: [{ c: 1, d: 'roro' }, { c: 2 }, 'meuh'] }
  }
  const correctItems = [
    {
      icon: ic,
      id: 11,
      name: '{attributes N, A}',
      jsonPath: '$',
      children: [
        {
          icon: ic,
          id: 11,
          name: 'A / {attributes N, B}',
          jsonPath: "$['a']",
          children: [
            {
              icon: is,
              id: 11,
              name: 'B / [list with 1 item]',
              jsonPath: "$['a']['b']",
              children: [
                {
                  children: [
                    {
                      icon: ii,
                      id: 8,
                      jsonPath: "$['a']['b'][0]['d']",
                      name: 'D',
                      value: 'roro'
                    }
                  ],
                  icon: ic,
                  id: 8,
                  jsonPath: "$['a']['b'][0]",
                  name: '{attributes C, D}'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
  let items = itemifyJSON(JSON.stringify(json), 'roro')
  expect(items).toStrictEqual(correctItems)
  items = itemifyJSON(JSON.stringify(json), 'ror')
  expect(items).toStrictEqual(correctItems)
  items = itemifyJSON(JSON.stringify(json), 'ROR')
  expect(items).toStrictEqual(correctItems)
})

test('complex itemifyJSON with filter that does not match', () => {
  const json = {
    n: 'root',
    a: { n: 'child', b: [{ c: 1, d: 'roro' }, { c: 2 }, 'meuh'] }
  }
  const correctItems = [[]]
  const items = itemifyJSON(JSON.stringify(json), 'XXX')
  expect(items).toStrictEqual(correctItems)
})

test('item JsonPath for object', () => {
  const json = { a: { b: 'roro' } }
  const correctItems = [
    {
      icon: ic,
      id: 3,
      name: '{attributes A}',
      path: [],
      children: [
        {
          icon: ic,
          id: 3,
          path: ['a'],
          name: 'A / {attributes B}',
          children: [
            {
              icon: ii,
              id: 3,
              name: 'B',
              path: ['a', 'b'],
              value: 'roro'
            }
          ]
        }
      ]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))
  expect(items).toStrictEqual(correctItems)

  const obj = items[0].children[0].children[0]

  expect(obj.path).toStrictEqual(['a', 'b'])
  const path = pathArrayToJsonPath(obj.path)
  expect(JSONPath({ path, json })).toStrictEqual([json.a.b])
})

test('item JsonPath for array element', () => {
  const json = { c: ['toto'] }
  const correctItems = [
    {
      icon: ic,
      id: 3,
      name: '{attributes C}',
      path: [],
      children: [
        {
          icon: is,
          id: 3,
          name: 'C / [list with 1 item]',
          path: ['c'],
          children: [
            {
              icon: ii,
              id: 3,
              path: ['c', 0],
              value: 'toto'
            }
          ]
        }
      ]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))
  expect(items).toStrictEqual(correctItems)

  const arrayEl = items[0].children[0].children[0]
  expect(arrayEl.path).toStrictEqual(['c', 0])
  const path = pathArrayToJsonPath(arrayEl.path)
  expect(JSONPath({ path, json })).toStrictEqual([json.c[0]])
})

test('item JsonPath for big array element', () => {
  const json = {
    c: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }
  const correctItems = [
    {
      icon: ic,
      id: 16,
      name: '{attributes C}',
      path: [],
      children: [
        {
          id: 14,
          icon: is,
          path: ['c'],
          name: 'C / [list with 12 items]',
          children: [
            {
              id: 15,
              icon: is,
              name: '[elements 1 - 10]',
              path: ['c'],
              children: [
                { id: 3, value: 1, icon: ii, path: ['c', 0] },
                { id: 4, value: 2, icon: ii, path: ['c', 1] },
                { id: 5, value: 3, icon: ii, path: ['c', 2] },
                { id: 6, value: 4, icon: ii, path: ['c', 3] },
                { id: 7, value: 5, icon: ii, path: ['c', 4] },
                { id: 8, value: 6, icon: ii, path: ['c', 5] },
                { id: 9, value: 7, icon: ii, path: ['c', 6] },
                { id: 10, value: 8, icon: ii, path: ['c', 7] },
                { id: 11, value: 9, icon: ii, path: ['c', 8] },
                { id: 12, value: 10, icon: ii, path: ['c', 9] }
              ]
            },
            {
              id: 16,
              icon: is,
              name: '[elements 11 - 12]',
              path: ['c'],
              children: [
                { id: 13, value: 11, icon: ii, path: ['c', 10] },
                { id: 14, value: 12, icon: ii, path: ['c', 11] }
              ]
            }
          ]
        }
      ]
    }
  ]
  const items = itemifyJSON(JSON.stringify(json))
  expect(items).toStrictEqual(correctItems)

  const array = items[0].children[0]
  const subArray0 = array.children[0]

  const arrayPath0 = subArray0.children[5].path
  expect(arrayPath0).toStrictEqual(['c', 5])
  const jsonPath0 = pathArrayToJsonPath(arrayPath0)
  expect(JSONPath({ path: jsonPath0, json })).toStrictEqual([json.c[5]])

  const subArray1 = array.children[1]

  const arrayPath1 = subArray1.children[1].path
  expect(arrayPath1).toStrictEqual(['c', 11])
  const jsonPath1 = pathArrayToJsonPath(arrayPath1)
  expect(JSONPath({ path: jsonPath1, json })).toStrictEqual([json.c[11]])
})
