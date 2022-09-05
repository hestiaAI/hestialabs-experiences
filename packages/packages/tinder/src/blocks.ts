import type { ViewBlocks } from '@/types'

import sqlAll from './sql/all.sql'
import sqlAppOpens from './sql/app-opens.sql'
import sqlLikesDislikesOpen from './sql/likes-dislikes-open.sql'
import sqlLikesDislikes from './sql/likes-dislikes.sql'
import sqlMessages from './sql/messages.sql'
import sqlUser from './sql/user.sql'

import vegaDonutMultipleComparisonsEn from './vega/donut-multiple-comparisons-en'
import vegaDonutMultipleComparisonsFr from './vega/donut-multiple-comparisons-fr'
import vegaScatterLikesPassesCorrelationEn from './vega/scatter-likes-passes-correlation-en'
import vegaScatterLikesPassesCorrelationFr from './vega/scatter-likes-passes-correlation-fr'

const files = ['tinder']

const blocks: ViewBlocks = [
  {
    id: 'user',
    sql: sqlUser,
    visualization: 'TinderUserInfos.vue',
    title: 'User infos',
    text: 'Tinder profile information'
  },
  {
    id: 'app-opens-vue',
    sql: sqlAppOpens,
    files: ['tinder'],
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
    id: 'likes-dislikes-vue',
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
    id: 'messages-activity',
    sql: sqlMessages,
    visualization: 'ChartViewHeatMapHour.vue',
    vizProps: {
      dateAccessor: 'sentDate',
      title: 'Messages Sent',
      legendLabel: 'Messages'
    },
    title: 'Messages',
    text: 'See at what time of the day and week you send the most messages'
  },
  {
    id: 'donut',
    sql: sqlAll,
    text: 'Compare the different actions you perform in the application.',
    title: 'Comparison',
    visualization: {
      en: vegaDonutMultipleComparisonsEn,
      fr: vegaDonutMultipleComparisonsFr
    }
  },
  {
    id: 'likes-dislikes-open',
    sql: sqlLikesDislikesOpen,
    text: 'Observe the possible correlation between the number of likes/passes and the number of times you open the app.',
    title: 'Likes / passes correlation',
    visualization: {
      en: vegaScatterLikesPassesCorrelationEn,
      fr: vegaScatterLikesPassesCorrelationFr
    }
  }
].map(b => ({ ...b, files }))

export default blocks
