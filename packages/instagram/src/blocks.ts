import type { ViewBlocks } from '@/types'

import sqlComments from './sql/comments.sql'
import sqlConnections from './sql/connections.sql'
import sqlLikes from './sql/likes.sql'
import sqlFollows from './sql/follows.sql'
import sqlMessages from './sql/messages.sql'
import sqlSavedcollections from './sql/saved-collections.sql'
import sqlSearches from './sql/searches.sql'
import { genericViewers } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'messages',
    sql: sqlMessages,
    files: ['messages'],
    visualization: 'ChartViewOverviewInstagramMessage.vue',
    showTable: false,
    title: 'Messages',
    text: ''
  },
  {
    id: 'follows',
    sql: sqlFollows,
    files: ['followers', 'followings'],
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Follerwers vs Followings over time',
      legendOffset: 350,
      dateAccessor: { text: 'Date', value: 'followDate' },
      seriesAccessor: { text: 'Action', value: 'followType' }
    },
    showTable: false,
    title: 'Follows',
    text: ''
  },

  ...genericViewers
]

export default blocks
