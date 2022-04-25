import { ViewBlock } from '@/types/view-block'

import sqlOffFacebookActivityCount from './sql/off-facebook-activity-count.sql'
import sqlOffFacebookActivityTypeCount from './sql/off-facebook-activity-type-count.sql'
import sqlAdInteractions from './sql/ad-interactions.sql'
import sqlYourTopics from './sql/your-topics.sql'
import sqlAdvertisersContactList from './sql/advertisers-contact-list.sql'

import sunburstTargetingAdvertiser from '@/postprocessors/sunburst-targeting-advertiser'

const blocks: ViewBlock[] = [
  {
    key: 'off-facebook-activity-count',
    sql: sqlOffFacebookActivityCount,
    files: ['off-facebook-activity'],
    visualization: 'ChartViewTopRow.vue',
    vizProps: {
      dateFormat: '%s'
    },
    title: 'Off Facebook activity ranking',
    text: 'See how many times third parties have informed Facebook of your activity outside of Facebook.'
  },
  {
    key: 'off-facebook-activity-type-count',
    sql: sqlOffFacebookActivityTypeCount,
    files: ['off-facebook-activity'],
    postprocessor: sunburstTargetingAdvertiser,
    visualization: 'ChartViewSunburst.vue',
    title: 'Off Facebook activity type',
    text: 'See which kind of information advertisers have shared with Facebook of your activity outside of Facebook.'
  },
  {
    key: 'ad-interactions',
    sql: sqlAdInteractions,
    files: ['advertisers-interacted'],
    showTable: true,
    title: 'Ad interactions',
    text: 'See the list of ads with which you have interacted.'
  },
  {
    key: 'your-topics',
    sql: sqlYourTopics,
    files: ['ads-interests'],
    showTable: true,
    title: 'Inferred interests',
    text: "Get a list of topics that Facebook thinks you're interested in."
  },
  {
    key: 'advertisers-contact-list',
    sql: sqlAdvertisersContactList,
    files: ['advertisers-contact-list'],
    showTable: true,
    title: 'Contact list',
    text: 'Get a list of advertisers that have uploaded a contact list containing you.'
  },
  {
    key: 'custom-audiences',
    sql: 'custom-audiences',
    files: ['advertisers-using-information'],
    showTable: true,
    title: 'Advertisers using your data',
    text: 'See all advertisers that use Facebook to get information about you'
  },
  {
    key: 'genericDateViewer',
    customPipeline: 'genericDateViewer',
    visualization: 'ChartViewGenericDateViewer.vue',
    title: 'Timeline',
    text: 'See all the dated events in your files, corresponding to data that has been collected on you at or concerning a specific date.'
  },
  {
    key: 'genericLocationViewer',
    customPipeline: 'genericLocationViewer',
    customPipelineOptions: { acceptedPaths: '.*' },
    visualization: 'ChartViewGenericLocationViewer.vue',
    title: 'Location observations',
    text: 'See all the location events in your files, corresponding to data that has been collected on you at or concerning a specific location.'
  }
]

export default blocks
