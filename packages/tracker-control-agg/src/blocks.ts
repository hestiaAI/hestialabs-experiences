import type { ViewBlocks } from '@/types'
import { customPipelineMergeCSV } from '@/pipelines/custom'
import sqlAll from './sql/all.sql'

const blocks: ViewBlocks = [
  {
    id: 'trackerControl',
    sql: sqlAll,
    files: ['tracker-control'],
    // visualization: 'ChartViewTrackerControl.vue',
    showTable: true,
    title: 'Overview',
    text: 'Monitor below all the tracking done on all participant smartphone applications. You can filter the results by selecting a time range or clicking on each graph.'
  }
]

export default blocks
