import type { ViewBlocks } from '@/types'

import sqlAll from './sql/all.sql'

const blocks: ViewBlocks = [
  {
    id: 'overview',
    sql: sqlAll,
    showTable: false,
    visualization: 'ChartViewOverviewHerTinder.vue',
    title: 'Overview',
    text: 'Compare the activities of dating applications according to application and sexual orientation.'
  }
]

export default blocks
