import type { ViewBlocks } from '@/types'

import sqlAll from './sql/all.sql'
import sqlAllTinder from './sql/all-tinder-usage.sql'
import sqlAllHer from './sql/all-her-usage.sql'

const blocks: ViewBlocks = [
  {
    id: 'overview',
    sql: sqlAll,
    showTable: false,
    visualization: 'ChartViewOverviewHerTinder.vue',
    title: 'Overview',
    text: 'Compare the activities of dating applications according to application and sexual orientation.'
  },
  {
    id: 'tindersUsage',
    sql: sqlAllTinder,
    showTable: true,
    title: 'Tinder',
    text: ''
  },
  {
    id: 'herUsage',
    sql: sqlAllHer,
    showTable: true,
    title: 'Her',
    text: ''
  }
]

export default blocks
