import type { ViewBlocks } from '@/types'

const blocks: ViewBlocks = [
  {
    id: 'trackerControl',
    customPipeline: 'csv_tracker_control',
    files: ['tracker-control'],
    showTable: false,
    visualization: 'ChartViewTrackerControl.vue',
    title: 'Overview',
    text: 'Monitor below all the tracking done on your smartphone applications. You can filter the results by selecting a time range, selecting certain apps in the dropdown, clicking on each graph, or using the table filters or search box.'
  }
]

export default blocks
