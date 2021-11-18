import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'

function representsInt(field) {
  return (
    !isNaN(field) &&
    parseInt(Number(field)) === field &&
    !isNaN(parseInt(field, 10))
  )
}

function isValidDate(date) {
  return (
    date.toString() !== 'Invalid Date' &&
    date.getFullYear() >= 1980 &&
    date.getFullYear() <= 2038
  )
}

function tryGetDate(field) {
  if (representsInt(field)) {
    const int = parseInt(field, 10)
    // The timestamp can be in seconds or milliseconds
    for (const i in [int * 1000, int]) {
      const date = new Date(i)
      if (isValidDate(date)) {
        return date
      }
    }
  }
  if (typeof field === 'string') {
    const date = new Date(field)
    if (isValidDate(date)) {
      return date
    }
  }
  return null
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function extractJsonEntries(node) {
  if (Array.isArray(node)) {
    // Array
    return node.flatMap(el => extractJsonEntries(el))
  } else if (isObject(node)) {
    // Object
    const entries = Object.entries(node).flatMap(([k, v]) => {
      const dateInKey = tryGetDate(k)
      const inner = extractJsonEntries(v)
      if (dateInKey !== null && _.some(inner, o => Object.hasOwn(o, 'date'))) {
        return inner.map(o => ({ ...o, date: dateInKey }))
      } else {
        return inner.map(o => ({
          ...o,
          description: `${_.startCase(k)} > ${o.description}`
        }))
      }
    })
    console.log(entries)
    const [dates, others] = _.partition(entries, o => Object.hasOwn(o, 'date'))
    const description = `[${others
      .map(({ description }) => description)
      .join(', ')}]`

    return dates.map(({ date }) => ({
      date,
      description: `${description}`
    }))
  } else {
    // Leaf
    const date = tryGetDate(node)
    if (date !== null) {
      console.log(`found date: ${node}`)
      return [{ date }]
    }
    if (typeof node === 'string') {
      return [{ description: _.startCase(node) }]
    }
    return [{ description: node }]
  }
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

  console.log(jsonTexts)
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
