import type { ViewBlocks } from '@/types'

import sqlViews from './sql/views.sql'
import sqlInteractions from './sql/interactions.sql'
import sqlAdvertisers from './sql/advertisers.sql'
import sqlInterests from './sql/interests.sql'
import sqlAdInteractions from './sql/ad-interactions.sql'
import sqlPostsAndStories from './sql/posts-and-stories.sql'

import { genericDateViewer } from '@/pipelines/generic'

import keplerConfigPublications from './kepler/kepler_config_publications'

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
          title: 'Ad viewed',
          valueLabel: 'action',
          cols: '8',
          type: 'TimelineChart.vue',
          dateAccessor: '_date'
        },
        {
          valueLabel: 'interactions',
          title: 'Ad Clicked',
          cols: '4',
          type: 'PieChart.vue',
          valueAccessor: 'clicked'
        }
      ]
    },
    title: 'Ad 1/3 (Interactions)',
    text: 'See how much ads you see and wether or not you interact with them.'
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
    title: 'Ad 2/3 (Interests)',
    text: 'See which interests are inferred about you.'
  },
  {
    id: 'ad-advertisers',
    sql: sqlAdvertisers,
    files: ['advertisers'],
    showTable: true,
    title: 'Ad 3/3 (Advertisers)',
    text: 'See which advertisers are using your information on Instagram.'
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
