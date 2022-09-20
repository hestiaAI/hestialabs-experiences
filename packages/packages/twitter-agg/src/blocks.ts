import type { ViewBlocks } from '@/types'

import sqlOverview from './sql/overview.sql'
import sqlPersonalization from './sql/personalization.sql'

const blocks: ViewBlocks = [
  {
    id: 'overview',
    sql: sqlOverview,
    files: ['ads'],
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of ads printed',
          valueLabel: 'ads',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: 'impressionDate'
        },
        {
          title: 'Top Advertisers',
          cols: '4',
          type: 'TopChart.vue',
          valueAccessor: 'companyName'
        },
        {
          title: 'Interactions with ads (clicks, video views)',
          cols: '4',
          type: 'PieChart.vue',
          valueAccessor: 'engagedWith'
        },
        {
          type: 'HourChart.vue',
          cols: '4',
          dateAccessor: 'impressionDate'
        },
        {
          type: 'WeekChart.vue',
          cols: '4',
          dateAccessor: 'impressionDate'
        }
      ]
    },
    showTable: true,
    title: 'Advertising overview',
    text: 'Understand how much, who and why you are being targeted by Twitter ads in this interactive visualization. Click on any graph to filter the results.'
  },
  {
    id: 'personalization',
    sql: sqlPersonalization,
    files: ['personalization'],
    // visualization: 'ChartViewTwitterInferredInfos.vue',
    showTable: true,
    title: 'Inferred Data',
    text: 'Find out what information Twitter has deduced about you'
  }
]

export default blocks
