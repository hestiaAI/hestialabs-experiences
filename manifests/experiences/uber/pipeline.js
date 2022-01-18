import keplerConfig from './kepler-config'
import {
  genericDateViewer,
  genericLocationViewer
} from '~/manifests/generic-pipelines'

async function tripsData({ fileManager }) {
  const path = fileManager.findMatchingFilePaths(
    '**/Uber Data/Rider/trips_data.csv'
  )[0]
  return await fileManager.getCsvItems(path)
}

async function tripsRawData({ fileManager }) {
  const path = fileManager.findMatchingFilePaths(
    '**/Uber Data/Rider/trips_data.csv'
  )[0]
  return await fileManager.getText(path)
}

async function tripsGraphData({ fileManager }) {
  const path = fileManager.findMatchingFilePaths(
    '**/Uber Data/Rider/trips_data.csv'
  )[0]
  const tripsData = await fileManager.getCsvItems(path)
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

async function tripsKeplerData({ fileManager }) {
  return { rawCsv: await tripsRawData({ fileManager }), config: keplerConfig }
}

export default {
  tripsData,
  tripsRawData,
  tripsKeplerData,
  tripsGraphData,
  genericDateViewer,
  genericLocationViewer
}
