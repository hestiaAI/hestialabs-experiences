import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
import * as d3 from 'd3'

// Define all accepted date formats
const timeParsers = [
  d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ'),
  d3.timeParse('%Y-%m-%d %H:%M:%S %Z UTC'),
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

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
// Transform a json object to a list of dated events
function extractJsonEntries(json) {
  function recurse(node) {
    if (isObject(node)) {
      const entries = Object.entries(node).flatMap(([k, v]) => {
        const kDate = getValidDate(k)
        const kPretty = _.startCase(k)
        // The value is not a leaf node
        if (typeof v === 'object') {
          const inner = recurse(v)
          if (!kDate) {
            return inner.map(o =>
              o.description
                ? { ...o, description: `${kPretty} > ${o.description}` }
                : o
            )
          } else {
            return inner.map(o => (o.date ? o : { ...o, date: kDate }))
          }
        } else {
          const vDate = getValidDate(v)
          // If both key and value contain dates, use key date as description
          if (kDate && vDate) return [{ date: vDate, description: `${k}` }]
          if (!kDate && vDate) return [{ date: vDate }]
          if (kDate && !vDate) return [{ date: kDate, description: `${v}` }]
          return [{ description: `${kPretty} : ${v}` }]
        }
      })
      const [dates, rest] = _.partition(entries, o => _.has(o, 'date'))
      const [describedDates, undescribedDates] = _.partition(dates, o =>
        _.has(o, 'description')
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
      return node.flatMap(el => recurse(el))
    } else {
      // we should never enter here
      console.log('Error: found leaf in JSON date extractor')
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

  const jsonFilenames = filenames.filter(name => name.endsWith('.json'))
  const jsonTexts = await fileManager.preprocessFiles(jsonFilenames)

  const csvEntries = csvItems.flatMap(([name, csv]) =>
    extractCsvEntries(csv).map(o => ({
      ...o,
      description: `${name} > ${o.description}`
    }))
  )
  const jsonEntries = Object.entries(jsonTexts).flatMap(([name, json]) => {
    try {
      return extractJsonEntries(JSON.parse(json)).map(o => ({
        ...o,
        description: `${name} > ${o.description}`
      }))
    } catch (e) {
      console.error(e)
      // TODO
      return []
    }
  })
  const items = [...jsonEntries, ...csvEntries]
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
