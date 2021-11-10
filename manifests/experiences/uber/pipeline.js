import * as csv from '@fast-csv/parse'

async function tripsData(inputFiles) {
  const data = inputFiles['Uber Data/Rider/trips_data.csv']
  const result = await new Promise(resolve => {
    const items = []
    csv
      .parseString(data, { headers: true })
      .on('data', row => items.push(row))
      .on('end', () => resolve({ headers: Object.keys(items[0]), items }))
  })
  console.log('after pip', result)
  return result
}

export default {
  tripsData
}
