import keplerConfig from './kepler-config'
import { customPipelineGetFirstCSV } from '@/pipelines/custom'
import { genericDateViewer, genericLocationViewer } from '@/pipelines/generic'
import type { ViewBlocks } from '@/types/view-block'

async function tripsGraphData({ fileManager }) {
  const tripsData = (await fileManager.getCsvItemsFromId('trips'))[0] ?? {
    headers: [],
    items: []
  }
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
  const rawCsv = (await fileManager.getPreprocessedTextFromId('trips'))[0]
  return { rawCsv, config: keplerConfig }
}

const blocks: ViewBlocks = [
  {
    id: 'tripsData',
    customPipeline: customPipelineGetFirstCSV('trips'),
    files: ['trips'],
    visualization: 'ChartViewOverviewUber.vue',
    title: 'Uber overview',
    text: 'This interactive visualisation shows your Uber habits, play with it to discover everything Uber knows on you. Your data is grouped by currency and every graph is filterable.'
  },
  {
    id: 'tripsGraphData',
    customPipeline: tripsGraphData,
    files: ['trips'],
    visualization: 'ChartViewSankey.vue',
    title: 'Uber Trips',
    text: 'Get information about the places you have visited the most or from which you originate the most.'
  },
  genericDateViewer,
  {
    id: 'tripsKeplerData',
    customPipeline: tripsKeplerData,
    files: ['trips'],
    visualization: '/kepler',
    title: 'Map of trips',
    text: 'See where you travelled'
  },
  genericLocationViewer
]

export default blocks
