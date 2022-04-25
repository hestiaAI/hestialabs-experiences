import type { ViewBlocks } from '@/types/view-block'

import sqlAll from './sql/all.sql'
import sqlAppOpens from './sql/app-opens.sql'
import sqlLikesDislikesOpen from './sql/likes-dislikes-open.sql'
import sqlLikesDislikes from './sql/likes-dislikes.sql'
import sqlMessages from './sql/messages.sql'
import sqlUserInfos from './sql/user-infos.sql'

import vegaDonutMultipleComparisons from './vega/donut-multiple-comparisons.vega'
import vegaScatterLikesPassesCorrelation from './vega/scatter-likes-passes-correlation.vega'

const files = ['tinder']

const blocks: ViewBlocks = [
  {
    key: 'user-infos',
    sql: sqlUserInfos,
    visualization: 'TinderUserInfos.vue',
    title: 'User infos',
    text: 'Tinder profile information'
  },
  {
    key: 'app-opens-vue',
    sql: sqlAppOpens,
    text: 'See the number of times that you opened the app per day.',
    title: 'Usage',
    visualization: 'ChartViewHeatMapCalendar.vue',
    vizProps: {
      title: 'Application usage over time',
      legendOffset: 360,
      dateAccessor: 'dateValue',
      valueAccessor: 'amount',
      legendLabel: 'App Opened'
    }
  },
  {
    key: 'likes-dislikes-vue',
    sql: sqlLikesDislikes,
    text: 'See the number of likes and passes that you made over time.',
    title: 'Likes and passes',
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Likes vs Passes over time',
      legendOffset: 350,
      dateAccessor: { text: 'Date', value: 'dateValue' },
      seriesAccessor: { text: 'Action', value: 'actionType' },
      valueAccessor: 'amount'
    }
  },
  {
    key: 'messages-activity',
    sql: sqlMessages,
    visualization: 'TinderMessageActivity.vue',
    vizProps: {
      dateAccessor: 'sentDate'
    },
    title: 'Messages',
    text: 'See at what time of the day and week you receive/send the most messages'
  },
  {
    key: 'donut',
    sql: sqlAll,
    text: 'Compare the different actions you perform in the application.',
    title: 'Comparison',
    visualization: vegaDonutMultipleComparisons
  },
  {
    key: 'likes-dislikes-open',
    sql: sqlLikesDislikesOpen,
    text: 'Observe the possible correlation between the number of likes/passes and the number of times you open the app.',
    title: 'Likes / passes correlation',
    visualization: vegaScatterLikesPassesCorrelation
  }
].map(b => ({ ...b, files }))

export default blocks
