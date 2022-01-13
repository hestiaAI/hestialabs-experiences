import { JSONPath } from 'jsonpath-plus'
import {
  mdiCodeJson,
  mdiFormatListBulletedSquare,
  mdiInformationOutline
} from '@mdi/js'
import itemifyJSON from '~/utils/json'

const ic = mdiCodeJson
const is = mdiFormatListBulletedSquare
const ii = mdiInformationOutline

test('simple itemifyJSON', () => {
  const json = { n: 'root' }
  const correctItems = [
    {
      icon: ic,
      id: 2,
      jsonPath: '$',
      name: '{attributes N}',
      children: [
        { id: 2, jsonPath: "$['n']", value: 'root', icon: ii, name: 'N' }
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
      jsonPath: '$',
      children: [
        { id: 2, jsonPath: "$['n']", value: 'root', icon: ii, name: 'N' },
        {
          icon: ic,
          id: 11,
          name: 'A / {attributes N, B}',
          jsonPath: "$['a']",
          children: [
            {
              icon: ii,
              id: 4,
              jsonPath: "$['a']['n']",
              name: 'N',
              value: 'child'
            },
            {
              icon: is,
              id: 11,
              name: 'B / [list with 3 items]',
              jsonPath: "$['a']['b']",
              children: [
                {
                  children: [
                    {
                      icon: ii,
                      id: 7,
                      jsonPath: "$['a']['b'][0]['c']",
                      name: 'C',
                      value: 1
                    },
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
                },
                {
                  children: [
                    {
                      icon: ii,
                      id: 10,
                      jsonPath: "$['a']['b'][1]['c']",
                      name: 'C',
                      value: 2
                    }
                  ],
                  icon: ic,
                  id: 10,
                  jsonPath: "$['a']['b'][1]",
                  name: '{attributes C}'
                },
                {
                  icon: ii,
                  id: 11,
                  jsonPath: "$['a']['b'][2]",
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
      jsonPath: '$',
      children: [
        {
          icon: ic,
          id: 3,
          jsonPath: "$['a']",
          name: 'A / {attributes B}',
          children: [
            {
              icon: ii,
              id: 3,
              name: 'B',
              jsonPath: "$['a']['b']",
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

  expect(obj.jsonPath).toStrictEqual("$['a']['b']")
  expect(JSONPath({ path: obj.jsonPath, json })).toStrictEqual([json.a.b])
})

test('item JsonPath for array element', () => {
  const json = { c: ['toto'] }
  const correctItems = [
    {
      icon: ic,
      id: 3,
      name: '{attributes C}',
      jsonPath: '$',
      children: [
        {
          icon: is,
          id: 3,
          name: 'C / [list with 1 item]',
          jsonPath: "$['c']",
          children: [
            {
              icon: ii,
              id: 3,
              jsonPath: "$['c'][0]",
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
  expect(arrayEl.jsonPath).toStrictEqual("$['c'][0]")
  expect(JSONPath({ path: arrayEl.jsonPath, json })).toStrictEqual([json.c[0]])
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
      jsonPath: '$',
      children: [
        {
          id: 14,
          icon: is,
          jsonPath: "$['c']",
          name: 'C / [list with 12 items]',
          children: [
            {
              id: 15,
              icon: is,
              name: '[elements 1 - 10]',
              jsonPath: "$['c']",
              children: [
                { id: 3, value: 1, icon: ii, jsonPath: "$['c'][0]" },
                { id: 4, value: 2, icon: ii, jsonPath: "$['c'][1]" },
                { id: 5, value: 3, icon: ii, jsonPath: "$['c'][2]" },
                { id: 6, value: 4, icon: ii, jsonPath: "$['c'][3]" },
                { id: 7, value: 5, icon: ii, jsonPath: "$['c'][4]" },
                { id: 8, value: 6, icon: ii, jsonPath: "$['c'][5]" },
                { id: 9, value: 7, icon: ii, jsonPath: "$['c'][6]" },
                { id: 10, value: 8, icon: ii, jsonPath: "$['c'][7]" },
                { id: 11, value: 9, icon: ii, jsonPath: "$['c'][8]" },
                { id: 12, value: 10, icon: ii, jsonPath: "$['c'][9]" }
              ]
            },
            {
              id: 16,
              icon: is,
              name: '[elements 11 - 12]',
              jsonPath: "$['c']",
              children: [
                { id: 13, value: 11, icon: ii, jsonPath: "$['c'][10]" },
                { id: 14, value: 12, icon: ii, jsonPath: "$['c'][11]" }
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

  const arrayPath0 = subArray0.children[5].jsonPath
  expect(arrayPath0).toStrictEqual("$['c'][5]")
  expect(JSONPath({ path: arrayPath0, json })).toStrictEqual([json.c[5]])

  const subArray1 = array.children[1]

  const arrayPath1 = subArray1.children[1].jsonPath
  expect(arrayPath1).toStrictEqual("$['c'][11]")
  expect(JSONPath({ path: arrayPath1, json })).toStrictEqual([json.c[11]])
})
