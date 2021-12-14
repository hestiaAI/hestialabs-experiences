import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
import * as d3 from 'd3'

// Define all accepted date formats
const timeParsers = [
  d3.timeParse('%Y-%m-%dT%H:%M:%SZ'),
  d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ'),
  d3.timeParse('%Y-%m-%d %H:%M:%S %Z UTC'),
  d3.timeParse('%Y-%m-%d %H:%M:%S.%L%Z'),
  d3.timeParse('%Y-%m-%d %H:%M:%S UTC'),
  d3.timeParse('%Y-%m-%d %H:%M:%S'),
  d3.timeParse('%Y-%m-%d %H:%M'),
  d3.timeParse('%Y-%m-%d %H:%M'),
  d3.timeParse('%Y-%m-%d'),
  d3.timeParse('%Y/%m/%d %H:%M:%S'),
  d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ[UTC]'),
  d3.timeParse('%Y-%m-%d %H:%M'),
  d3.timeParse('%s'), // Unix seconds
  d3.timeParse('%Q') // Unix milliseconds
]

// Define range of valid year, in case of timestamp date format
// the will accept any number so need to filter.
const validYearMin = 2000
const validYearMax = 2038

// Try to transform {{ value }} into a Date object,
// return the date or null if not a valid date
function getValidDate(value) {
  // Check if it is a phone number
  if (value.length === 0 || value[0] === '0' || value[0] === '+') return null

  let date = null
  const findDate = timeParsers.some((parser, idx) => {
    date = parser(value)
    if (
      date !== null &&
      date.getFullYear() > validYearMin &&
      date.getFullYear() < validYearMax
    ) {
      // Reorder timeParsers array to save complexity
      if (idx !== 0) {
        timeParsers.splice(idx, 1)
        timeParsers.splice(0, 0, parser)
      }
      return true
    }
    return false
  })
  return findDate ? date : null
}
function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
// Transform a json object to a list of dated events
function extractJsonEntries(json) {
  // small trick to avoid recognizing coodinates as date (issue need to be addressed later)
  const unallowedNames = ['lat', 'lon', 'lng']
  const validDateName = name =>
    unallowedNames.every(
      unallowedName => !name.toLowerCase().includes(unallowedName)
    )
  function recurse(node) {
    if (isObject(node)) {
      const entries = Object.entries(node).flatMap(([k, v]) => {
        const kDate = getValidDate(k)
        const kPretty = _.startCase(k)
        // The value is not a leaf node
        if (typeof v === 'object') {
          const inner = recurse(v)
          if (!kDate) {
            return inner.map(o => ({
              ...o,
              description: `${kPretty}${
                o.description ? ` > ${o.description}` : ''
              }`
            }))
          } else {
            return inner.map(o => (o.date ? o : { ...o, date: kDate }))
          }
        } else {
          const vDate = getValidDate(v)
          // If both key and value contain dates, use key date as description
          if (kDate && vDate) return [{ date: vDate, description: `${k}` }]
          if (!kDate && vDate && validDateName(k))
            return [{ date: vDate, description: '' }]
          if (kDate && !vDate) return [{ date: kDate, description: `${v}` }]
          return [{ description: `${kPretty} : ${v}` }]
        }
      })
      const [dates, rest] = _.partition(entries, o => _.has(o, 'date'))
      const [describedDates, undescribedDates] = _.partition(
        dates,
        ({ description }) => description
      )
      const levelDescription = `[${rest
        .map(({ description }) => description)
        .join(', ')}]`
      const possiblyDescribedDates =
        rest.length > 0
          ? undescribedDates.map(o => ({ ...o, description: levelDescription }))
          : undescribedDates
      return [...describedDates, ...possiblyDescribedDates]
    } else if (Array.isArray(node)) {
      // Array
      return node.flatMap(el =>
        typeof el === 'object' ? recurse(el) : { description: `${el}` }
      )
    } else {
      // We might find something like { key: null }
      return []
    }
  }
  return recurse(json).filter(o => _.has(o, 'date'))
}

function extractCsvEntries({ items }) {
  return items.flatMap(item => {
    const entries = Object.entries(item).map(([k, v]) => {
      const date = getValidDate(v)
      return date
        ? { date, description: `${_.startCase(k)}` }
        : { description: `${_.startCase(k)} : ${v}` }
    })
    const [dates, rest] = _.partition(entries, o => _.has(o, 'date'))
    return dates.map((obj, i) => {
      const otherDates = dates.filter((_, j) => j !== i)
      const description = `${obj.description} : [${[...rest, ...otherDates]
        .map(({ description }) => description)
        .join(', ')}]`
      return { ...obj, description }
    })
  })
}

async function genericDateViewer(fileManager) {
  const filenames = fileManager.getFilenames()

  const csvFilenames = filenames.filter(name => name.endsWith('.csv'))
  const csvItems = await Promise.all(
    csvFilenames.map(async name => [name, await fileManager.getCsvItems(name)])
  )

  const jsonFilenames = filenames.filter(name => /\.js(:?on)?$/.test(name))
  const jsonTexts = await fileManager.preprocessFiles(jsonFilenames)

  const csvEntries = csvItems.flatMap(([name, csv]) =>
    extractCsvEntries(csv).map(o => ({ ...o, filename: name }))
  )
  const jsonEntries = Object.entries(jsonTexts).flatMap(([name, json]) => {
    try {
      return extractJsonEntries(JSON.parse(json)).map(o => ({
        ...o,
        filename: name
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  })
  const items = [...jsonEntries, ...csvEntries]
  const headers = ['date', 'description', 'filename']
  return { headers, items }
}

async function timedObservationViewer(fileManager, manifest) {
  const params = manifest.timedObservationsViewer
  const matchingFilenames = fileManager
    .getFilenames()
    .filter(name => params.fileMatchers.some(_ => _.regex.test(name)))
  const files = await fileManager.preprocessFiles(matchingFilenames)

  const headers = ['date', 'eventSource', 'eventType', 'eventValue']
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

const isValidLat = num => isFinite(num) && Math.abs(num) <= 90
const isValidLon = num => isFinite(num) && Math.abs(num) <= 180
const namesLat = ['lat']
const namesLon = ['lon', 'lng']

function extractJsonLocations(items) {
  function recurse(node, path) {
    if (isObject(node)) {
      // Object

      // First check if there is possible lat and lon at this level
      let latHeader = null
      let lonHeader = null
      Object.entries(node).forEach(([k, v]) => {
        const kLw = k.toLowerCase()
        // Specific to Google format, lat and lon are multiplied by 1e7
        if (kLw.includes('e7')) node[k] = v = v * 1e-7
        if (namesLat.some(name => kLw.includes(name)) && isValidLat(v))
          latHeader = k
        else if (namesLon.some(name => kLw.includes(name)) && isValidLon(v))
          lonHeader = k
      })

      // If there is not a lat and lon at this level
      // continue to recurse and add current leaf to description
      if (latHeader === null || lonHeader === null) {
        return Object.entries(node).flatMap(([k, v]) => {
          return recurse(v, path.concat(k))
        })
      }
      // If there is a lat and lon at this level
      // return current object with lat lon and description
      // We do not search for lat lon further down as in most case
      // the highest level location is the most important one
      return [
        {
          latitude: +node[latHeader],
          longitude: +node[lonHeader],
          path: path.join('/'),
          description: _.omit(node, [latHeader, lonHeader])
        }
      ]
    } else if (Array.isArray(node)) {
      // Array
      return node.flatMap(el => recurse(el, path))
    } else {
      // It's a leaf
      return []
    }
  }
  const result = recurse(items, [])
  return result
}

function extractCsvLocations({ items }) {
  if (items.length === 0) return []
  let latHeader = null
  let lonHeader = null
  const sample = items.slice(0, 100)
  Object.keys(items[0]).forEach(h => {
    // For each header, check if the name include a name associated with latitude
    // and if a subset (here first 100) of data points are all valid Latitude
    // Start verification with latitude since it is less permissive
    const hLw = h.toLowerCase()
    if (sample.every(i => i[h] === '')) {
      // continue to next iteration if all sample values are empty string
    } else if (
      namesLat.some(name => hLw.includes(name)) &&
      sample.every(i => isValidLat(i[h]))
    ) {
      latHeader = h
    } else if (
      namesLon.some(name => hLw.includes(name)) &&
      sample.every(i => isValidLon(i[h]))
    ) {
      lonHeader = h
    }
  })

  // If we didnt find a column for lat and lon return empty
  if (latHeader === null || lonHeader === null) return []

  return items.map(i => {
    return {
      latitude: +i[latHeader],
      longitude: +i[lonHeader],
      path: '',
      description: _.omit(i, [latHeader, lonHeader]) // This can be slow, consider to remove it if not needed
    }
  })
}

async function genericLocationViewer(fileManager) {
  const filenames = fileManager.getFilenames()

  const csvFilenames = filenames.filter(name => name.endsWith('.csv'))
  const csvItems = await Promise.all(
    csvFilenames.map(async name => [name, await fileManager.getCsvItems(name)])
  )

  const jsonFilenames = filenames.filter(
    name => /\.js(:?on)?$/.test(name) && name !== 'Location History.json'
  )
  const jsonTexts = await fileManager.preprocessFiles(jsonFilenames)
  const csvEntries = csvItems.flatMap(([name, csv]) =>
    extractCsvLocations(csv).map(o => ({ ...o, filename: name }))
  )
  const jsonEntries = Object.entries(jsonTexts).flatMap(([name, json]) => {
    try {
      return extractJsonLocations(JSON.parse(json)).map(o => ({
        ...o,
        filename: name
      }))
    } catch (e) {
      console.error(e)
      return []
    }
  })
  const items = [...jsonEntries, ...csvEntries]
  const headers = ['filename', 'latitude', 'longitude', 'path', 'description']
  return { headers, items }
}

export { genericDateViewer, timedObservationViewer, genericLocationViewer }
