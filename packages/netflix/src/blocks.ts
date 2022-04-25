import type { ViewBlocks } from '@/types/view-block'
import { genericDateViewer } from '@/pipelines/generic'
import { customPipelineGetFirstCSV } from '@/pipelines/custom'

const blocks: ViewBlocks = [
  {
    key: 'watchOverview',
    customPipeline: customPipelineGetFirstCSV('viewing-activity'),
    files: ['viewing-activity'],
    visualization: 'ChartViewOverviewNetflix.vue',
    title: 'Viewing activity',
    text: 'Get an overview of how you use Netflix and what information is stored about you'
  },
  {
    key: 'notifications',
    customPipeline: customPipelineGetFirstCSV('messages-by-netflix'),
    files: ['messages-by-netflix'],
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Notifications sent by Netflix',
      yLabel: 'count',
      filters: [
        { text: 'Interacted with', value: 'Click Cnt', type: 'Boolean' },
        { text: 'Device Model', value: 'Device Model', type: 'List' }
      ],
      dateAccessor: { text: 'Date', value: 'Sent Utc Ts' },
      seriesAccessor: { text: 'Profile', value: 'Profile Name' }
    },
    title: 'Notifications',
    text: 'See how many times Netflix sent you notifications'
  },
  genericDateViewer
]

export default blocks
