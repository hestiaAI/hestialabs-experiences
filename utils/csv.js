import * as csv from '@fast-csv/parse'
import _ from 'lodash'
import { setsEqual } from './utils'

const acceptedDelimiters = [',', ';', '\t']

function differentiateDuplicates(strings) {
  const occurrences = _.mapValues(_.groupBy(strings, _.identity), l => l.length)
  const counter = Object.fromEntries(_.uniq(strings).map(name => [name, 0]))
  return strings.map(name =>
    occurrences[name] === 1 ? name : `${name}_${++counter[name]}`
  )
}

async function getCsvHeadersAndItems(csvText) {
  let best = { items: [], headers: [] }
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
      if (_.every(items, i => Object.keys(i).length === headers.length)) {
        if (headers.length >= 2) {
          return { headers, items }
        } else if (headers.length === 1) {
          best = { headers, items }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  return best
}

/**
 * Retrieve the csvs that match the fileID and merge them into one array
 * @param {*} fileManager The fileManager instance that store the files and files IDs
 * @param {*} fileID The corresponding key that link to the globPath we seek, defined in the manifest under files.
 * @returns the merged csvs array
 */
async function getCsvAndMergeFromID(fileManager, fileID) {
  const files = await fileManager.getCsvItemsFromId(fileID)

  if (!files.length) {
    return {
      headers: [],
      items: []
    }
  }

  // Merge the files that have the same headers as the first file
  const file = files.slice(1).reduce((prev, curr) => {
    if (setsEqual(new Set(prev.headers), new Set(curr.headers))) {
      return { headers: prev.headers, items: prev.items.concat(curr.items) }
    } else {
      return prev
    }
  }, files[0])
  return file
}

export { getCsvHeadersAndItems, getCsvAndMergeFromID }
