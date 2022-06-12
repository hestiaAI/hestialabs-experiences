import type { ViewBlocks } from '@/types'
import { customPipelineMergeCSV } from '@/pipelines/custom'

const blocks: ViewBlocks = [
  {
    id: 'trackerControl',
    customPipeline: customPipelineMergeCSV('tracker-control'),
    files: ['tracker-control'],
    visualization: 'ChartViewTrackerControl.vue',
    title: 'Overview',
    text: 'Monitor below all the tracking done on your smartphone applications. You can filter the results by selecting a time range, selecting certain apps in the dropdown, clicking on each graph, or using the table filters or search box. Any filtering you do will also limit what data is shared into the pool if you share this tab on the \'Share My Data\' tab.'
  }
]

export default blocks
