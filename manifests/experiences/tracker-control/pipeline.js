import * as csv from '@fast-csv/parse'

async function trackerControl(inputFiles) {
  const data = Object.values(inputFiles)[0]
  return await new Promise(resolve => {
    const items = []
    csv
      .parseString(data, { headers: true })
      .on('data', row => items.push(row))
      .on('end', () => resolve({ headers: Object.keys(items[0]), items }))
  })
}

export default {
  trackerControl
}
