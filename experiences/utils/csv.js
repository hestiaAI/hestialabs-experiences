import * as Papa from 'papaparse'
import { camelCase } from 'lodash-es'
import { setsEqual } from './utils'

/** Need to find a way to apply this function to headers // , mapValues, identity, groupBy, every, uniq
function differentiateDuplicates(strings) {
  const occurrences = mapValues(groupBy(strings, identity), l => l.length)
  const counter = Object.fromEntries(uniq(strings).map(name => [name, 0]))
  return strings.map(name =>
    occurrences[name] === 1 ? name : `${name}_${++counter[name]}`
  )
}
 */
async function getCsvHeadersAndItems(csvText) {
  const { headers, items } = await new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: function(header) {
        return camelCase(header)
      },
      complete: function(results) {
        results.errors.forEach(e => console.error(e))
        resolve({ headers: results.meta.fields, items: results.data })
      }
    })
  })
  return { headers, items }
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
