import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
// don't import the whole of d3 or tests fail
import { timeParse } from 'd3-time-format'
import Ajv from 'ajv'
import jsonToTableSchema from './jsonToTableSchema'
import allParsers from './parsers'
const ajv = new Ajv()

// Define all accepted date formats
const timeParsers = [
  timeParse('%Y-%m-%dT%H:%M:%SZ'),
  timeParse('%Y-%m-%dT%H:%M:%S.%LZ'),
  timeParse('%Y-%m-%d %H:%M:%S %Z UTC'),
  timeParse('%Y-%m-%d %H:%M:%S.%L%Z'),
  timeParse('%Y-%m-%d %H:%M:%S UTC'),
  timeParse('%Y-%m-%d %H:%M:%S'),
  timeParse('%Y-%m-%d %H:%M'),
  timeParse('%Y-%m-%d %H:%M'),
  timeParse('%Y-%m-%d'),
  timeParse('%Y/%m/%d %H:%M:%S'),
  timeParse('%Y-%m-%dT%H:%M:%S.%LZ[UTC]'),
  timeParse('%Y-%m-%d %H:%M'),
  timeParse('%s'), // Unix seconds
  timeParse('%Q') // Unix milliseconds
]

// Define range of valid year, in case of timestamp date format
// the will accept any number so need to filter.
const validYearMin = 2000
const validYearMax = 2038

// Try to transform {{ value }} into a Date object,
// return the date or null if not a valid date
function getValidDate (value) {
  // Check if it is a phone number
  if (value.length === 0 || value[0] === '0' || value[0] === '+') { return null }

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
function isObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
// Transform a json object to a list of dated events
function extractJsonEntries (json) {
  // small trick to avoid recognizing coodinates as date (issue need to be addressed later)
  const unallowedNames = ['lat', 'lon', 'lng']
  const validDateName = name =>
    unallowedNames.every(
      unallowedName => !name.toLowerCase().includes(unallowedName)
    )
  function recurse (node) {
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
          if (kDate && vDate) { return [{ date: vDate, description: `${k}` }] }
          if (!kDate && vDate && validDateName(k)) { return [{ date: vDate, description: '' }] }
          if (kDate && !vDate) { return [{ date: kDate, description: `${v}` }] }
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

function extractCsvEntries ({ items }) {
  return items.flatMap((item) => {
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

async function genericDateViewer ({ fileManager, options }) {
  let filenames = fileManager.getFilenames()
  if (_.has(options, 'acceptedPaths')) {
    filenames = filenames.filter(name =>
      new RegExp(options.acceptedPaths).test(name)
    )
  }

  const csvFilenames = filenames.filter(name => name.endsWith('.csv'))
  const csvItems = await Promise.all(
    csvFilenames.map(async (name) => {
      const items = await fileManager.getCsvItems(name)
      fileManager.freeFile(name) // Clear file from memory
      return [name, items]
    })
  )
  const csvEntries = csvItems.flatMap(([name, csv]) =>
    extractCsvEntries(csv).map(o => ({ ...o, filename: name }))
  )
  const jsonFilenames = filenames.filter(name => /\.js(:?on)?$/.test(name))
  const jsonEntries = (
    await Promise.all(
      jsonFilenames.flatMap(async (jsonFilename) => {
        const [filename, json] = Object.entries(
          await fileManager.preprocessFiles([jsonFilename])
        )[0]
        fileManager.freeFile(jsonFilename) // Clear file from memory
        try {
          return extractJsonEntries(JSON.parse(json)).map(o => ({
            ...o,
            filename
          }))
        } catch (e) {
          console.error(e)
          return []
        }
      })
    )
  ).flat()
  const items = [...jsonEntries, ...csvEntries]
  const headers = ['date', 'description', 'filename']
  return { headers, items }
}

async function timedObservationViewer ({ fileManager, options }) {
  // Process options
  options.fileMatchers.forEach((m) => {
    try {
      m.regex = new RegExp(m.regex)
    } catch (error) {
      throw new Error(`The regex '${m.regex}' is not valid`)
    }
  })
  if (_.has(options, 'parser')) {
    const parser = options.parser
    if (parser in allParsers) {
      options.parser = allParsers[parser]
    } else {
      throw new Error(`The parser ${parser} doesn't exist`)
    }
  } else {
    options.parser = _.identity
  }

  // Get files
  const matchingFilenames = fileManager
    .getFilenames()
    .filter(name => options.fileMatchers.some(_ => _.regex.test(name)))
  const files = await fileManager.preprocessFiles(matchingFilenames)

  // Process files
  const headers = ['date', 'eventSource', 'eventType', 'eventValue']
  const items = Object.entries(files).flatMap(([name, text]) => {
    const matcher = _.find(options.fileMatchers, m => m.regex.test(name))
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
    return options.parser(events, options, name.match(matcher.regex))
  })
  return { headers, items }
}

const isValidLat = num => isFinite(num) && Math.abs(num) <= 90
const isValidLon = num => isFinite(num) && Math.abs(num) <= 180
const namesLat = ['lat']
const namesLon = ['lon', 'lng']

function extractJsonLocations (items) {
  function recurse (node, path) {
    if (isObject(node)) {
      // Object

      // First check if there is possible lat and lon at this level
      let latHeader = null
      let lonHeader = null
      Object.entries(node).forEach(([k, v]) => {
        const kLw = k.toLowerCase()
        // Specific to Google format, lat and lon are multiplied by 1e7
        if (kLw.includes('e7')) { node[k] = v = v * 1e-7 }
        if (namesLat.some(name => kLw.includes(name)) && isValidLat(v)) { latHeader = k } else if (namesLon.some(name => kLw.includes(name)) && isValidLon(v)) { lonHeader = k }
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

function extractCsvLocations ({ items }) {
  if (items.length === 0) { return [] }
  let latHeader = null
  let lonHeader = null
  const sample = items.slice(0, 100)
  Object.keys(items[0]).forEach((h) => {
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
  if (latHeader === null || lonHeader === null) { return [] }

  return items.map((i) => {
    return {
      latitude: +i[latHeader],
      longitude: +i[lonHeader],
      path: '',
      description: _.omit(i, [latHeader, lonHeader]) // This can be slow, consider to remove it if not needed
    }
  })
}

async function genericLocationViewer ({ fileManager, options }) {
  let filenames = fileManager.getFilenames()
  if (_.has(options, 'acceptedPaths')) {
    filenames = filenames.filter(name =>
      new RegExp(options.acceptedPaths).test(name)
    )
  }

  const csvFilenames = filenames.filter(name => name.endsWith('.csv'))
  const csvItems = await Promise.all(
    csvFilenames.map(async (name) => {
      const csvItems = await fileManager.getCsvItems(name)
      fileManager.freeFile(name) // Clear file from memory
      return [name, csvItems]
    })
  )
  const csvEntries = csvItems.flatMap(([name, csv]) =>
    extractCsvLocations(csv).map(o => ({ ...o, filename: name }))
  )

  const jsonFilenames = filenames.filter(name => /\.js(:?on)?$/.test(name))
  const jsonEntries = (
    await Promise.all(
      jsonFilenames.flatMap(async (jsonFilename) => {
        const [filename, json] = Object.entries(
          await fileManager.preprocessFiles([jsonFilename])
        )[0]
        fileManager.freeFile(jsonFilename) // Clear file from memory
        try {
          return extractJsonLocations(JSON.parse(json)).map(o => ({
            ...o,
            filename
          }))
        } catch (e) {
          console.error(e)
          return []
        }
      })
    )
  ).flat()

  const items = [...jsonEntries, ...csvEntries]
  const headers = ['filename', 'latitude', 'longitude', 'path', 'description']
  return { headers, items }
}

/**
 * Build a table from JSON data given a set of JSONPath accessors
 * The options are passed with "customPipelineOptions" in the manifest and must
 * follow the JsonShema defined in jsonToTableSchema.js, e.g:
 *  "customPipelineOptions": {
 *      "accessor": {
 *        "filePath": "...", // A file path or glob
 *        "jsonPath": "..." // A JsonPath
 *      },
 *      "columns": [
 *        {
 *          "name": "Advertiser",
 *          "path": "name",
 *          "type": "string",
 *        },
 *        ...
 *      ]
 *    }
 * jsonPath uses the normal jsonPath syntax.
 * see https://github.com/JSONPath-Plus/JSONPath
 *
 * jsonSchema is a parsed json object in the JsonSchema syntax.
 * We're using the default syntax of https://ajv.js.org/
 *
 */
async function jsonToTableConverter ({ fileManager, options }) {
  // Validate that the given options use the correct format
  const validate = ajv.compile(jsonToTableSchema)
  const valid = validate(options)
  if (!valid) {
    console.error('Invalid options: ', ajv.errorsText(validate.errors))
    return {}
  }

  const tableDatasPromises = options.map(async (opts) => {
    const entries = await fileManager.findMatchingObjects(opts.accessor, {
      freeFiles: true
    })
    return makeTableData(entries, opts)
  })
  const tableDatas = await Promise.all(tableDatasPromises)
  const mergedData = mergeTableData(tableDatas)
  return mergedData
}

export function mergeTableData (tableDatas) {
  const nonEmpties = tableDatas.filter(
    td => td.headers?.length && td.items?.length
  )
  const headers = [...new Set(nonEmpties.flatMap(td => td.headers))]
  const items = nonEmpties.flatMap(td => td.items)
  return { headers, items }
}

function provideColumnName (column) {
  return column.name || column.path
}

function extractHeaders (entries) {
  const headerSet = entries.reduce((hSet, obj) => {
    Object.keys(obj).forEach(k => hSet.add(k))
    return hSet
  }, new Set())
  return [...headerSet]
}

export function makeTableData (entries, options) {
  // If objects is an array of a single array
  // display the single array.
  // That way a jsonPath to an array is displayed the same way
  // as if it ended with '[*]'.
  // This solution seemed preferable to generating [*] json paths
  // from the json viewer.
  const singleArray = entries.length === 1 && Array.isArray(entries[0])
  const entriesToDisplay = singleArray ? entries[0] : entries

  // TODO maybe display columns that are not configured in options
  // by creating column configurations from headers
  // add an ignoreColumns field in options
  // in UnitFileExplorer, create a columns configuration from entries[0]
  // so that an example configuration is displayed to the user
  // this.customPipelineOptions = [{ accessor, columns }]

  if (options?.columns) {
    const headers = options.columns.map(provideColumnName)
    const items = entriesToDisplay.map(e => makeTableItem(e, options))
    return { headers, items }
  }

  const firstObject = entriesToDisplay[0]
  if (firstObject === undefined) {
    return { headers: [], items: [] }
  }
  if (typeof firstObject === 'object' && !Array.isArray(firstObject)) {
    const headers = extractHeaders(entriesToDisplay)
    const tableData = { headers, items: entriesToDisplay }
    return tableData
  }
  return {
    headers: ['item'],
    items: entriesToDisplay.map(s => ({ item: s }))
  }
}

function makeTableItem (object, options) {
  const item = {}
  options.columns.forEach((c) => {
    // get all entries that satisfy the given path
    const value = JSONPath({
      path: c.path,
      json: object,
      wrap: false
    })
    const name = provideColumnName(c)
    // Cast value to specified format, may need to handle errors
    switch (c.type) {
      case 'date':
        item[name] = timeParse(c.format)(value)
        break
      case 'object':
        item[name] = value
        break
      case 'string':
        item[name] = String(value)
        break
      case 'number':
        item[name] = Number(value)
        break
      case 'boolean':
        item[name] = Boolean(value)
        break
      default:
        // consider it a string
        item[name] = String(value)
    }
  })
  return item
}

function capitalize (str) {
  if (!str) {
    return str
  }
  let capitalized = str[0].toUpperCase()
  if (str.length > 1) {
    capitalized += str.substr(1)
  }
  return capitalized
}

async function createTableOptions (fileManager, accessor) {
  const [found] = await fileManager.findMatchingObjects(accessor)
  const firstEntry = Array.isArray(found) ? found[0] : found
  if (!firstEntry || Array.isArray(firstEntry)) {
    return { accessor }
  }
  const columns = Object.keys(firstEntry).map((key) => {
    const options = {
      name: capitalize(key),
      path: `$["${key}"]`
    }
    const value = firstEntry[key]
    if (typeof value === 'object') {
      options.type = 'object'
    }
    return options
  })
  return [{ accessor, columns }]
}

export {
  genericDateViewer,
  timedObservationViewer,
  genericLocationViewer,
  jsonToTableConverter,
  createTableOptions
}
