import * as csv from '@fast-csv/parse'

export default function getCsvHeadersAndItems(csvText) {
  return new Promise(resolve => {
    const items = []
    csv
      .parseString(csvText, { headers: true })
      .on('data', row => items.push(row))
      .on('end', () => {
        resolve({ headers: Object.keys(items[0]) || [], items })
      })
  })
}
