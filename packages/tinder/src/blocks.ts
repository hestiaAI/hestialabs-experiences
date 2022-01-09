import { ViewBlock } from 'shared/view-block'

import sparqlAll from './sparql/all.rq'
import sparqlAppOpens from './sparql/app-opens.rq'
import sparqlLikesDislikes from './sparql/likes-dislikes.rq'
import sparqlLikesDislikesMessages from './sparql/likes-dislikes-messages.rq'
import sparqlLikesDislikesOpen from './sparql/likes-dislikes-open.rq'

import vegaDonutMultipleComparisons from './vega/donut-multiple-comparisons.vega'
import vegaScatterLikesPassesCorrelation from './vega/scatter-likes-passes-correlation.vega'

const blocks: ViewBlock[] = [
  {
    key: 'likes-dislikes-vue',
    query: sparqlLikesDislikes,
    text: 'See the number of likes and passes that you made over time.',
    title: 'Likes and passes',
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Likes vs Passes over time',
      legendOffset: 350,
      accessor: [
        { text: 'Likes', value: 'likes' },
        { text: 'Passes', value: 'pass' }
      ]
    }
  },
  {
    key: 'app-opens-vue',
    query: sparqlAppOpens,
    text: 'See the number of times that you opened the app (per day or per month).',
    title: 'App openings',
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Application usage over time',
      legendOffset: 360,
      accessor: [{ text: 'App opened', value: 'open' }]
    }
  },
  {
    key: 'monthly-history-vue',
    query: sparqlLikesDislikesMessages,
    text: 'Compare the number of likes, passes, messages sent and messages received.',
    title: 'Likes, passes, messages',
    visualization: 'ChartViewTimeSeries.vue',
    vizProps: {
      title: 'Activity history',
      legendOffset: 200,
      accessor: [
        { text: 'Likes', value: 'likes' },
        { text: 'Passes', value: 'pass' },
        { text: 'Messages received', value: 'msg_rcv' },
        { text: 'Messages sent', value: 'msg_sent' }
      ]
    }
  },
  {
    key: 'donut',
    query: sparqlAll,
    text: 'Compare different pairs of values in a donut chart.',
    title: 'Pairs',
    visualization: vegaDonutMultipleComparisons
  },
  {
    key: 'likes-dislikes-open',
    query: sparqlLikesDislikesOpen,
    text: 'Observe the possible correlation between the number of likes/passes and the number of times you open the app.',
    title: 'Likes and passes correlation',
    visualization: vegaScatterLikesPassesCorrelation
  },
  {
    key: 'all',
    query: sparqlAll,
    text: 'If you want to inspect precisely the values for each day, all the data can be summarized in a table.',
    title: 'All data',
    showTable: true
  }
]

export default blocks
