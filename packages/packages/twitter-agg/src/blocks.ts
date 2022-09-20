import type { ViewBlocks } from '@/types'

import sqlOverview from './sql/overview.sql'
// import sqlPersonalization from './sql/personalization.sql'
import sqlTargeting from './sql/targeting.sql'
// import { toGraph } from './postprocessors'
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
    showTable: false,
    title: 'Advertising overview',
    text: 'Understand how much, who and why you are being targeted by Twitter ads in this interactive visualization. Click on any graph to filter the results.'
  },
  {
    id: 'targeting',
    sql: sqlTargeting,
    files: ['personalization'],
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Top Advertisers',
          valueLabel: 'ads',
          cols: '4',
          height: 600,
          topK: 30,
          type: 'TopChart.vue',
          valueAccessor: 'advertiserName'
        },
        {
          title: 'Targeting Value',
          cols: '4',
          height: 600,
          topK: 30,
          type: 'TopChart.vue',
          valueAccessor: 'targetingValue'
        },
        {
          title: 'Targeting Type',
          cols: '4',
          type: 'PieChart.vue',
          height: 600,
          valueAccessor: 'targetingType'
        }
      ]
    },
    showTable: false,
    title: 'Targeting Criteria',
    text: 'Find which criteria are used to target this group of person.'
  }
  /*,
  {
    id: 'personalization',
    sql: sqlPersonalization,
    files: ['personalization'],
    visualization: 'ChartViewDirectedGraph.vue',
    postprocessor: toGraph,
    showTable: true,
    title: 'Inferred Data',
    text: 'Find out what information Twitter has deduced about you'
  }
  */
]

export default blocks
