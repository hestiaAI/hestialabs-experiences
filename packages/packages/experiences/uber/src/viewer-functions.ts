import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import keplerConfig from './kepler-config'
import type { FileManager, PipelineOutputItems } from '@/types/utils'

async function tripsGraphData(params: { fileManager: FileManager }) {
  const tripsData = (
    await params.fileManager.getCsvItemsFromId('trips')
  )[0] ?? {
    headers: [],
    items: []
  }
  const filteredValues = tripsData.items.reduce((acc, d) => {
    // filter non trips data
    if (
      (d.productType &&
        String(d.productType).toLowerCase().includes('ubereats')) ||
      d.tripOrOrderStatus !== 'COMPLETED'
    ) {
      return acc
    }
    // remove street numbers to aggregate
    acc.push({
      source: d.beginTripAddress.replace(/[0-9]/g, ''),
      target: d.dropoffAddress.replace(/[0-9]/g, ''),
      value: 1
    })
    return acc
  }, []) as PipelineOutputItems
  return { headers: ['source', 'target', 'value'], items: filteredValues }
}

async function tripsKeplerData(params: { fileManager: FileManager }) {
  const rawCsv = (
    await params.fileManager.getPreprocessedTextFromId('trips')
  )[0]
  return { rawCsv, config: keplerConfig }
}
const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_trips: customPipelineGetFirstCSV('trips'),
    tripsGraphData: tripsGraphData,
    tripsKeplerData: tripsKeplerData
  }
}

export default viewerFunctions
