import keplerConfig from './kepler-config'
import { genericDateViewer } from '~/manifests/generic-pipelines'

async function tripsData(fileManager) {
  return await fileManager.getCsvItems('Uber Data/Rider/trips_data.csv')
}

async function tripsRawData(fileManager) {
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
  return { headers: ['source', 'target', 'value'], items: filteredValues }
}

async function tripsKeplerData(fileManager) {
  return { rawCsv: await tripsRawData(fileManager), config: keplerConfig }
}

export default {
  tripsData,
  tripsRawData,
  tripsKeplerData,
  tripsGraphData,
  genericDateViewer
}
