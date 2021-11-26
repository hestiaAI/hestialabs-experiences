import * as csv from '@fast-csv/parse'
import _ from 'lodash'

const acceptedDelimiters = [',', ';', '\t']

export default async function getCsvHeadersAndItems(csvText) {
  for (const delimiter of acceptedDelimiters) {
    try {
      const { headers, items } = await new Promise(resolve => {
        const items = []
        csv
          .parseString(csvText, {
            delimiter,
            headers: true,
            strictColumnHandling: true
          })
          .on('data', row => items.push(row))
          .on('end', () => {
            const headers = Object.keys(items[0] ?? {})
            resolve({ headers, items })
          })
      })
      if (
        items.length > 0 &&
        _.every(
          items,
          i =>
            Object.keys(i).length > 1 &&
            Object.keys(i).length === headers.length
        )
      ) {
        return { headers, items }
      }
    } catch (error) {}
  }
  return { items: [], headers: [] }
}
