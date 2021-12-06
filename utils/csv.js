import * as csv from '@fast-csv/parse'
import _ from 'lodash'

const acceptedDelimiters = [',', ';', '\t']

function differentiateDuplicates(strings) {
  const occurrences = _.mapValues(_.groupBy(strings, _.identity), l => l.length)
  const counter = Object.fromEntries(_.uniq(strings).map(name => [name, 0]))
  return strings.map(name =>
    occurrences[name] === 1 ? name : `${name}_${++counter[name]}`
  )
}
export default async function getCsvHeadersAndItems(csvText) {
  for (const delimiter of acceptedDelimiters) {
    try {
      const { headers, items } = await new Promise((resolve, reject) => {
        const headers = []
        const items = []
        csv
          .parseString(csvText, {
            delimiter,
            headers: headers => differentiateDuplicates(headers),
            strictColumnHandling: true
          })
          .on('headers', h => headers.push(...h))
          .on('data', row => items.push(row))
          .on('error', error => reject(error))
          .on('end', () => resolve({ headers, items }))
      })
      if (
        items.length > 0 &&
        _.every(
          items,
          i =>
            Object.keys(i).length > 0 &&
            Object.keys(i).length === headers.length
        )
      ) {
        return { headers, items }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return { items: [], headers: [] }
}
