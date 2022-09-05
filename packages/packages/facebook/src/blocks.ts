import type { ViewBlocks } from '@/types'

import sqlOffFacebookActivityCount from './sql/off-facebook-activity-count.sql'
import sqlOffFacebookActivityTypeCount from './sql/off-facebook-activity-type-count.sql'
import sqlAdInteractions from './sql/ad-interactions.sql'
import sqlYourTopics from './sql/your-topics.sql'
import sqlAdvertisersContactList from './sql/advertisers-contact-list.sql'
import sqlCustomAudiences from './sql/custom-audiences.sql'

import { sunburstTargetingAdvertiser } from './postprocessors'
import { genericViewers } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'off-facebook-activity-count',
    sql: sqlOffFacebookActivityCount,
    files: ['off-facebook-activity'],
    visualization: 'ChartViewTopRow.vue',
    vizProps: {
      yAccessor: 'advertiserName',
      xAccessor: 'count_',
      dateAccessor: 'date_',
      xLabel: 'ads',
      countLabel: 'ads',
      dateFormat: '%s'
    },
    title: 'Off Facebook activity ranking',
    text: 'See how many times third parties have informed Facebook of your activity outside of Facebook.'
  },
  {
    id: 'off-facebook-activity-type-count',
    sql: sqlOffFacebookActivityTypeCount,
    files: ['off-facebook-activity'],
    postprocessor: sunburstTargetingAdvertiser,
    visualization: 'ChartViewSunburst.vue',
    title: 'Off Facebook activity type',
    text: 'See which kind of information advertisers have shared with Facebook of your activity outside of Facebook.'
  },
  {
    id: 'ad-interactions',
    sql: sqlAdInteractions,
    files: ['advertisers-interacted'],
    postprocessor: result => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers: any[] = result.headers.map(h => ({ value: h, text: h }))
      const timestampHeader = headers.find(h => h.value === 'timestamp')
      if (timestampHeader) {
        const formatter = new Intl.DateTimeFormat('en-UK', {
          dateStyle: 'short',
          timeStyle: 'medium'
        })
        timestampHeader.formatter = function (value: number) {
          const date = new Date(value * 1000)
          return formatter.format(date)
        }
      }
      result.headers = headers
      return result
    },
    showTable: true,
    title: 'Ad interactions',
    text: 'See the list of ads with which you have interacted.'
  },
  {
    id: 'your-topics',
    sql: sqlYourTopics,
    files: ['ads-interests'],
    showTable: true,
    title: 'Inferred interests',
    text: "Get a list of topics that Facebook thinks you're interested in."
  },
  {
    id: 'advertisers-contact-list',
    sql: sqlAdvertisersContactList,
    files: ['advertisers-contact-list'],
    showTable: true,
    title: 'Contact list',
    text: 'Get a list of advertisers that have uploaded a contact list containing you.'
  },
  {
    id: 'custom-audiences',
    sql: sqlCustomAudiences,
    files: ['advertisers-using-information'],
    showTable: true,
    title: 'Advertisers using your data',
    text: 'See all advertisers that use Facebook to get information about you'
  },
  ...genericViewers
]

export default blocks
