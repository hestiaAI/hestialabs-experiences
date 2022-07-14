import type { ViewBlocks } from '@/types'
import sqlAll from './sql/all.sql'

const blocks: ViewBlocks = [
  {
    id: 'trackerControl',
    sql: sqlAll,
    files: ['tracker-control'],
    visualization: 'ChartViewTrackerControl.vue',
    title: 'Overview',
    text: 'Monitor below all the tracking done on all participant smartphone applications. You can filter the results by selecting a time range or clicking on each graph.'
  },
  {
    id: 'trackerControlGraph',
    sql: sqlAll,
    files: ['tracker-control'],
    visualization: 'ChartViewDirectedGraph.vue',
    title: 'Data hoarding',
    text: 'Your data is transferred from applications to third parties, but did you know that there is a whole economy behind this data transfer, and that many exchange data with each other?.'
  }
]

export default blocks
