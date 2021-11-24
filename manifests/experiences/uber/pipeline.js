import { genericDateViewer } from '~/manifests/generic-pipelines'

async function tripsData(fileManager) {
  return await fileManager.getCsvItems('Uber Data/Rider/trips_data.csv')
}

async function rawTripsData(fileManager) {
  return await fileManager.getText('Uber Data/Rider/trips_data.csv')
}

async function tripsGraphData(fileManager) {
  const tripsData = await fileManager.getCsvItems(
    'Uber Data/Rider/trips_data.csv'
  )
  const filteredValues = tripsData.items.reduce((acc, d) => {
    // filter non trips data
    if (
      (d['Product Type'] &&
        String(d['Product Type']).toLowerCase().includes('ubereats')) ||
      d['Trip or Order Status'] !== 'COMPLETED'
    )
      return acc
    // remove street numbers to aggregate
    acc.push({
      source: d['Begin Trip Address'].replace(/[0-9]/g, ''),
      target: d['Dropoff Address'].replace(/[0-9]/g, ''),
      value: 1
    })
    return acc
  }, [])
  return { headers: tripsData.headers, items: filteredValues }
}
export default {
  tripsData,
  rawTripsData,
  tripsGraphData,
  genericDateViewer
}
