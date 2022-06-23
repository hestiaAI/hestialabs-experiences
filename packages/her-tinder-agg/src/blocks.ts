import type { ViewBlocks } from '@/types'

import sqlAll from './sql/all.sql'
import sqlAllperApp from './sql/all-per-app.sql'
import sqlAllperSo from './sql/all-per-so.sql'

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
    id: 'sqlAllperSo',
    sql: sqlAllperSo,
    visualization: 'ChartViewGroupBar.vue',
    vizProps: {
      groupsAccessor: 'sexualOrientations',
      valuesAccessor: ['likes', 'passes', 'matches'],
      colorPalette: ['#69B3A2', '#C23636', '#67A4BF'],
      xLabel: 'Sexual Orientation',
      yLabel: 'Number of action per day and user'
    },
    showTable: false,
    title: 'Sexual Orientation',
    text: 'Compare the average number of actions made by people of different sexual orientations each day when they open their application.'
  },
  {
    id: 'sqlAllperApp',
    sql: sqlAllperApp,
    visualization: 'ChartViewGroupBar.vue',
    vizProps: {
      groupsAccessor: 'app',
      valuesAccessor: ['likes', 'passes', 'matches'],
      colorPalette: ['#69B3A2', '#C23636', '#67A4BF'],
      xLabel: 'App used',
      yLabel: 'Number of action per day and user'
    },
    showTable: false,
    title: 'App',
    text: 'Compare the average number of actions made by users of different dating apps each day when they open their app.'
  }
]

export default blocks
