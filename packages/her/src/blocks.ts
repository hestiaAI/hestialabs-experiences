import type { ViewBlocks } from '@/types/view-block'

import sqlProfiles from './sql/profiles.sql'
import sqlLikesPasses from './sql/likes-passes.sql'
import sqlNotifications from './sql/notifications.sql'
import sqlLiked from './sql/liked.sql'
import sqlMessages from './sql/messages.sql'
import sqlBlocked from './sql/blocked.sql'
import sqlReported from './sql/reported.sql'

const blocks: ViewBlocks = [
  {
    id: 'profiles',
    sql: sqlProfiles,
    files: ['profiles'],
    visualization: 'HerUserInfos.vue',
    title: 'User Infos',
    text: 'HER profile information'
  },
  {
    id: 'liked',
    sql: sqlLikesPasses,
    files: ['liked', 'skipped'],
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Likes vs Passes over time',
      legendOffset: 350,
      dateAccessor: { text: 'Date', value: 'date' },
      seriesAccessor: { text: 'Action', value: 'actionValue' },
      valueAccessor: 'actionCount'
    },
    title: 'Likes and Passes',
    text: 'Number of likes and passes that you made over time.'
  },
  {
    id: 'notifications',
    sql: sqlNotifications,
    files: ['notifications'],
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Notifications over time',
      legendOffset: 350,
      dateAccessor: { text: 'Date', value: 'notificationSentAt' },
      seriesAccessor: { text: 'Action', value: 'notificationType' }
    },
    title: 'Notifications',
    text: 'Number of notifications that you recieved over time.'
  },
  {
    id: 'matches',
    sql: sqlLiked,
    files: ['liked'],
    visualization: 'ChartViewOverviewHer.vue',
    title: 'Matches',
    text: "Look at the likes you've made that have become matches or not."
  },
  {
    id: 'messages',
    sql: sqlMessages,
    files: ['messages'],
    visualization: 'HerMessageActivity.vue',
    vizProps: {
      dateAccessor: 'messageSentAt'
    },
    title: 'Messages',
    text: 'Message Activity'
  },
  {
    id: 'blocked',
    sql: sqlBlocked,
    files: ['blocked'],
    showTable: true,
    title: 'Blocks',
    text: 'Blocks that you established over time.'
  },
  {
    id: 'reported',
    sql: sqlReported,
    files: ['reported'],
    showTable: true,
    title: 'Reported',
    text: 'Users that you reported to the moderation.'
  }
]

export default blocks
