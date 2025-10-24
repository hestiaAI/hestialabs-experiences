import type { ViewBlocks } from '@/types'

import sqlViews from './sql/views.sql'
import sqlInteractions from './sql/interactions.sql'
import sqlAdvertisers from './sql/advertisers.sql'
import sqlInterests from './sql/interests.sql'
import sqlAdInteractions from './sql/ad-interactions.sql'
import sqlPostsAndStories from './sql/posts-and-stories.sql'

import sqlTime from './sql/time.sql'

import { genericDateViewer } from '@/pipelines/generic'

import keplerConfigPublications from './kepler/kepler_config_publications'

import { makeSessions } from './postprocessors'

const blocks: ViewBlocks = [
  {
    id: 'consumption',
    sql: sqlViews,
    showTable: false,
    files: ['postsViewed', 'videosWatched', 'adsViewed'],
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Content viewed',
          valueLabel: 'views',
          cols: '12',
          type: 'TimelineChart.vue',
          dateAccessor: 'actionDate'
        },
        {
          valueLabel: 'interactions',
          title: 'Type of content',
          cols: '6',
          height: 220,
          type: 'PieChart.vue',
          valueAccessor: 'actionType'
        },
        {
          valueLabel: 'interactions',
          title: 'Top Account',
          cols: '6',
          height: 220,
          type: 'TopChart.vue',
          isScrollable: true,
          topK: 100,
          valueAccessor: 'accountName'
        }
      ]
    },
    title: 'Consumption',
    text: 'See how much content you watch over time.'
  },
  {
    id: 'consumption-time',
    sql: sqlTime,
    showTable: false,
    postprocessor: makeSessions,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Time spent',
          valueLabel: 'minutes',
          cols: '12',
          type: 'TimelineChart.vue',
          dateAccessor: 'start_date',
          valueAccessor: 'duration_m'
        },
        {
          valueLabel: 'minutes',
          type: 'WeekChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: 'start_date',
          valueAccessor: 'duration_m'
        },
        {
          valueLabel: 'minutes',
          type: 'HourChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: 'start_date',
          valueAccessor: 'duration_m'
        },
        {
          valueLabel: 'actions',
          title: 'Actions',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          valueAccessor: 'actions',
          valueAsArray: true
        }
      ]
    },
    title: 'Consommation (durée)',
    text: 'See which advertisers are using your information on Instagram.'
  },
  {
    id: 'interactions',
    sql: sqlInteractions,
    files: [
      'likedComments',
      'likedPosts',
      'followings',
      'messages',
      'personalInfos'
    ],
    showTable: false,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Number of interactions',
          valueLabel: 'action',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: '_date'
        },
        {
          valueLabel: 'interactions',
          title: 'Interaction Type',
          cols: '4',
          type: 'TopChart.vue',
          valueAccessor: 'interactionType'
        },
        {
          valueLabel: 'interactions',
          type: 'WeekChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: '_date'
        },
        {
          valueLabel: 'interactions',
          type: 'HourChart.vue',
          cols: '4',
          height: 220,
          dateAccessor: '_date'
        },
        {
          valueLabel: 'interactions',
          title: 'User',
          cols: '4',
          height: 220,
          type: 'TopChart.vue',
          isScrollable: true,
          topK: 100,
          valueAccessor: 'accountName'
        }
      ]
    },
    title: 'Interactions',
    text: 'See which actions you do most when using Instagram.'
  },
  {
    id: 'ad-interactions',
    sql: sqlAdInteractions,
    files: ['adsClicked', 'adsViewed'],
    showTable: false,
    visualization: 'ChartViewDashboard.vue',
    vizProps: {
      graphs: [
        {
          title: 'Ads viewed',
          valueLabel: 'action',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: '_date'
        },
        {
          valueLabel: 'interactions',
          title: 'Ads clicked',
          cols: '4',
          type: 'PieChart.vue',
          valueAccessor: 'clicked'
        }
      ]
    },
    title: 'Ads 1/3 (Interactions)',
    text: 'See how many ads you viewed and whether or not you interacted with them.'
  },
  {
    id: 'ad-interests',
    sql: sqlInterests,
    visualization: 'ChartViewDashboard.vue',
    files: ['adsInterests'],
    vizProps: {
      graphs: [
        {
          title: 'Type of interest',
          valueLabel: 'value',
          cols: '12',
          type: 'TopChart.vue',
          valueAccessor: '_type',
          height: 150
        }
      ]
    },
    showTable: false,
    title: 'Ads 2/3 (Interests)',
    text: 'See which interests are inferred about you.'
  },
  {
    id: 'ad-advertisers',
    sql: sqlAdvertisers,
    files: ['advertisers'],
    showTable: true,
    title: 'Ads 3/3 (Advertisers)',
    text: 'See which advertisers have used your information on Instagram.'
  },
  {
    id: 'localisation',
    sql: sqlPostsAndStories,
    files: ['posts', 'stories'],
    visualization: 'ChartViewGenericMap.vue',
    vizProps: {
      keplerConfig: keplerConfigPublications
    },
    showTable: false,
    title: 'Localisation',
    text: 'See your posts and stories that have been geotagged.'
  },
  genericDateViewer
]

export default blocks
