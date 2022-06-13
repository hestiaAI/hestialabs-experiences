import type { ViewBlocks } from '@/types'
import { customPipelineMergeCSV } from '@/pipelines/custom'

const blocks: ViewBlocks = [
  {
    id: 'trackerControl',
    customPipeline: customPipelineMergeCSV('tracker-control'),
    files: ['tracker-control'],
    showTable: true,
    visualization: 'ChartViewTrackerControl.vue',
    title: 'Overview',
    text: 'Monitor below all the tracking done on your smartphone applications. You can filter the results by selecting a time range, selecting certain apps in the dropdown, clicking on each graph, or using the table filters or search box.'
  }
]

export default blocks
