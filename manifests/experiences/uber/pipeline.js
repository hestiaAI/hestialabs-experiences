import getCsvHeadersAndItems from '~/utils/csv'

async function tripsData(inputFiles) {
  const data = inputFiles['Uber Data/Rider/trips_data.csv']
  return await getCsvHeadersAndItems(data)
}

export default {
  tripsData
}
