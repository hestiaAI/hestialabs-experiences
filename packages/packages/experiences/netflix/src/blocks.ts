import type { ViewBlocks } from '@/types'
import { genericDateViewer } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'watchOverview',
    customPipeline: 'csv_viewing_activity',
    files: ['viewing-activity'],
    visualization: 'ChartViewOverviewNetflix.vue',
    title: 'Viewing activity',
    text: 'Get an overview of how you use Netflix and what information is stored about you'
  },
  {
    id: 'notifications',
    customPipeline: 'csv_messages_by_netflix',
    files: ['messages-by-netflix'],
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      filters: [
        { value: 'clickCnt', type: 'Boolean' },
        { value: 'deviceModel', type: 'List' }
      ],
      dateAccessor: { text: 'Date', value: 'sentUtcTs' },
      seriesAccessor: { text: 'Profile', value: 'profileName' }
    },
    title: 'Notifications',
    text: 'See how many times Netflix sent you notifications'
  },
  genericDateViewer
]

export default blocks
