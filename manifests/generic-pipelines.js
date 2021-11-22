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
const validYearMin = 1980
const validYearMax = 2038

// Try to transform {{ value }} into a Date object,
// return the date or null if not a valid date
function getValidDate(value) {
  let date = null
  const findDate = timeParsers.some((parser, idx) => {
    date = parser(value)
    if (
      date !== null &&
      date.getFullYear() > validYearMin &&
      date.getFullYear() < validYearMax
    ) {
      // Reorder timeParsers array to save complexity
      if (!idx !== 0) {
        timeParsers.splice(idx, 1)
        timeParsers.splice(0, 0, parser)
      }
      return true
    }
    return false
  })
  return findDate ? date : null
}

// Traverse all the json tree and keep tracks of each path from root to leaf
function traverseAllTree(node) {
  function traverse(n, acc) {
    if (n && typeof n === 'object') {
      Object.keys(n).forEach(function (k) {
        traverse(n[k], acc.concat(k))
      })
      return
    }
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

function prettyfyPath(pathList) {
  return pathList
    .map(e => {
      const ep = e.replaceAll('_', ' ')
      return ep.charAt(0).toUpperCase() + ep.slice(1)
    })
    .join(' -> ')
}
// Transform a json object to a list of dated events
function extractJsonEntries(node) {
  const allPath = traverseAllTree(node)
  const result = []
  Object.entries(allPath).forEach(([path, value]) => {
    const pathList = path.split(' -> ')
    const leafDate = getValidDate(value)
    if (leafDate !== null) {
      result.push({ date: leafDate, description: prettyfyPath(pathList) })
    } else {
      const pathDate = extractLastDate(pathList)
      if (pathDate[0] !== null) {
        pathDate[1].push(value)
        result.push({
          date: pathDate[0],
          description: prettyfyPath(pathDate[1])
        })
      }
    }
  })
  return result
}

function extractCsvEntries({ items }) {
  // TODO
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
