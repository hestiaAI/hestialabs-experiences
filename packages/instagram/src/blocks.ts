import type { ViewBlocks } from '@/types'

import sqlLikes from './sql/likes.sql'
import sqlViews from './sql/views.sql'
import sqlFollows from './sql/follows.sql'
import sqlMessages from './sql/messages.sql'
import { genericViewers } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'views',
    sql: sqlViews,
    files: ['postsViewed', 'videosWatched', 'adsViewed'],
    visualization: 'ChartViewLinePieTop.vue',
    vizProps: {
      titleTimeline: 'Content viewed',
      titlePie: 'Type of content',
      titleTop: 'Top Account',
      rowLabel: 'views',
      dateAccessor: { text: 'Date', value: 'actionDate' },
      seriesAccessor: { text: 'Action', value: 'actionType' },
      topAccessor: { text: 'Action', value: 'accountName' }
    },
    showTable: false,
    title: 'Views',
    text: ''
  },
  {
    id: 'likes',
    sql: sqlLikes,
    files: ['likedComments', 'likedPosts'],
    visualization: 'ChartViewAreaTop.vue',
    vizProps: {
      titleArea: 'Likes given',
      titleTop: 'Top User',
      rowLabel: 'likes',
      dateAccessor: { text: 'Date', value: 'actionDate' },
      seriesAccessor: { text: 'Action', value: 'actionType' },
      topAccessor: { text: 'Action', value: 'accountName' }
    },
    showTable: false,
    title: 'Likes',
    text: ''
  },
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
      title: 'Followers vs Followings over time',
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
