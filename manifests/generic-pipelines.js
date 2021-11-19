/* eslint-disable no-unused-vars */
import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
import * as d3 from 'd3'

// Define all accepted date formats
const timeParsers = [
  d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ'),
  d3.timeParse('%Y-%m-%d'),
  d3.timeParse('%s'), // Unix seconds
  d3.timeParse('%Q') // Unix milliseconds
]

// Define range of valid year, in case of timestamp date format
// the will accept any number so need to filter.
const validYearMin = 1990
const validYearMax = new Date().getFullYear() + 1

// Try to transform {{ value }} into a Date object,
// return the date or null if not a valid date
function getValidDate(value) {
  let date = null
  const findDate = timeParsers.some(parser => {
    date = parser(value)
    if (
      date !== null &&
      date.getFullYear() > validYearMin &&
      date.getFullYear() < validYearMax
    ) {
      return true
    }
    return false
  })
  return findDate ? date : null
}

/*
function isNumber(str) {
  if (typeof str !== 'string') return false
  return !isNaN(str) && !isNaN(parseFloat(str))
}
*/
// Traverse all the json tree and keep tracks of each path from root to leaf
function traverseAllTree(node) {
  function traverse(n, acc) {
    if (n && typeof n === 'object') {
      Object.keys(n).forEach(function (k) {
        traverse(n[k], acc.concat(k))
      })
      return
    }
    console.log(acc)
    path[acc.join(' -> ')] = n
  }
  const path = {}
  traverse(node, [])
  return path
}

// Try to extract a valid date from a list of values,
// starting from end of list
function extractLastDate(list) {
  const description = list.reverse()
  let date = null
  const idx = description.findIndex(p => {
    date = getValidDate(p)
    return date !== null
  })
  description.splice(idx, 1)
  return [date, description.reverse()]
}

// Transform a json object to a list of dated events
function extractJsonEntries(node) {
  const allPath = traverseAllTree(node)
  console.log(allPath)
  const result = []
  Object.entries(allPath).forEach(([path, value]) => {
    const leafDate = getValidDate(value)
    if (leafDate !== null) {
      result.push({ date: leafDate, description: path })
    } else {
      const pathDate = extractLastDate(path.split(' -> '))
      if (pathDate[0] !== null) {
        pathDate[1].push(value)
        result.push({
          date: pathDate[0],
          description: pathDate[1].join(' -> ')
        })
      }
    }
  })
  return result
}

function extractCsvEntries({ items }) {
  console.log(items) // TODO
  return { items }
}

async function genericDateViewer(fileManager) {
  const filenames = fileManager.getFilenames()

  const csvFilenames = filenames.filter(name => name.endsWith('.csv'))
  const csvItems = await Promise.all(
    csvFilenames.map(async name => await fileManager.getCsvItems(name))
  )

  const jsonFilenames = filenames.filter(name => name.endsWith('.json'))
  const jsonTexts = await fileManager.preprocessFiles(jsonFilenames)

  const items = [
    ...Object.entries(jsonTexts).flatMap(([name, json]) => {
      try {
        return extractJsonEntries(JSON.parse(json)).map(o => ({
          ...o,
          description: `${name} -> ${o.description}`
        }))
      } catch (e) {
        console.error(e)
        // TODO
        return []
      }
    }),
    ...csvItems.map(csv => extractCsvEntries(csv))
  ]
  console.log(items)
  const headers = ['date', 'description']
  return { headers, items }
}

async function timedObservationViewer(fileManager, manifest) {
  const params = manifest.timedObservationsViewer
  const matchingFilenames = fileManager
    .getFilenames()
    .filter(name => params.fileMatchers.some(_ => _.regex.test(name)))
  const files = await fileManager.preprocessFiles(matchingFilenames)

  const headers = params.fields
  const items = Object.entries(files).flatMap(([name, text]) => {
    const matcher = _.find(params.fileMatchers, m => m.regex.test(name))
    let events
    try {
      const entries = JSONPath({
        path: matcher.entryPath,
        json: JSON.parse(text)
      })
      events = entries.map(entry =>
        Object.fromEntries(
          Object.entries(matcher.fields).map(([field, { source, path }]) => {
            if (source === 'entry') {
              return [field, JSONPath({ path, json: entry, wrap: false })]
            } else if (source === 'regex') {
              return [field, name.match(matcher.regex)[path]]
            } else {
              return []
            }
          })
        )
      )
    } catch (error) {
      events = []
    }
    return params.parser(events, params, name.match(matcher.regex))
  })
  return { headers, items }
}

export { genericDateViewer, timedObservationViewer }
