import type { ViewBlocks } from '@/types'

import allInferences from './sql/inference.sql'
import allConnections from './sql/connection.sql'
import allAdTargeting from './sql/ad-targeting.sql'

const blocks: ViewBlocks = [
  {
    id: 'inference',
    sql: allInferences,
    files: ['inference'],
    showTable: true,
    // visualization: 'ChartViewListLinkedinInference.vue',
    title: 'Inferences about your group',
    text: 'The cards below represent the inferences (positive or negative) that Linkedin has made about the members of your group, classified according to the number of occurrences (from the most present to the least present inference).'
  },
  {
    id: 'ad-targeting',
    sql: allAdTargeting,
    files: ['ad-targeting'],
    showTable: true,
    // visualization: 'ChartViewLinkedinAdTargeting.vue',
    title: 'Skills and diversity',
    text: 'The charts below represent the criteria Linkedin uses to determine which ads to show to your group members. They draw an interesting map of the skills and experiences of your group and its diversity.'
  },
  {
    id: 'connections',
    sql: allConnections,
    files: ['connections'],
    showTable: true,
    // visualization: 'ChartViewOverviewLinkedinConnection.vue',
    title: 'Collective network ( Reach )',
    text: "This infographic represents the scope of your group's network. Clicking on an item will filter all the graphs according to this criterion."
  }
]

export default blocks
