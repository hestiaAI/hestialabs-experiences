import type { ViewBlocks } from '@/types'

import sqlOverview from './sql/overview.sql'
import sqlPersonalization from './sql/personalization.sql'
import sqlAdsPerAdvertiser from './sql/ads-per-advertiser.sql'
import sqlTargetingCriteriaByAdvertiser from './sql/targeting-criteria-by-advertiser.sql'
import sqlTargetingCriteriaAllAdvertisers from './sql/targeting-criteria-all-advertisers.sql'
import sqlAllCriteriaAllAdvertisers from './sql/all-criteria-all-advertisers.sql'

import vegaWordcloudTargetingCriteriaEn from './vega/wordcloud-targeting-criteria-en'
import vegaWordcloudTargetingCriteriaFr from './vega/wordcloud-targeting-criteria-fr'

import { sunburstTargeting } from './postprocessors'
import { genericDateViewer } from '@/pipelines/generic'

const blocks: ViewBlocks = [
  {
    id: 'overview',
    sql: sqlOverview,
    files: ['impressions', 'engagements'],
    visualization: 'ChartViewOverviewTwitter.vue',
    title: 'Advertising overview',
    text: 'Understand how much, who and why you are being targeted by Twitter ads in this interactive visualization. Click on any graph to filter the results.'
  },
  {
    id: 'ads-per-advertiser',
    sql: sqlAdsPerAdvertiser,
    files: ['impressions', 'engagements'],
    visualization: 'ChartViewTopRow.vue',
    vizProps: {
      yAccessor: 'advertiserName',
      xAccessor: 'count_',
      dateAccessor: 'date_',
      xLabel: 'ads',
      countLabel: 'ads'
    },
    title: 'Top advertisers',
    text: 'See the ranking of advertisers that have shown you the most ads.'
  },
  {
    id: 'targeting-criteria-by-advertiser',
    sql: sqlTargetingCriteriaByAdvertiser,
    files: ['impressions', 'engagements'],
    postprocessor: sunburstTargeting,
    visualization: 'ChartViewSunburst.vue',
    title: 'Targeting criteria (Top 10 advertisers)',
    text: 'Understand why you have been targeted by these advertisers. The graph shows the 10 advertisers who use the most targeting criteria on you. In the first ring you will find the different advertisers, in the second ring the types of targeting used (location, language, ...). And finally, if you click on a ring, the graph will enlarge to show you the targeting values (Swiss, French, ...) in the outer ring.'
  },
  {
    id: 'targeting-criteria-all-advertisers',
    sql: sqlTargetingCriteriaAllAdvertisers,
    files: ['impressions', 'engagements'],
    visualization: {
      en: vegaWordcloudTargetingCriteriaEn,
      fr: vegaWordcloudTargetingCriteriaFr
    },
    title: 'Targeting criteria (All advertisers)',
    text: "Get more details on how you are targeted by these advertisers. This graph shows the number of times you have been targeted by different advertisers using a specific criterion. You can change the type of criterion and get information about the meaning of each criterion's type at the bottom of the graph."
  },
  {
    id: 'all-criteria-all-advertisers',
    sql: sqlAllCriteriaAllAdvertisers,
    files: ['impressions', 'engagements'],
    postprocessor: sunburstTargeting,
    showTable: true,
    title: 'Targeting criteria (1 advertiser)',
    visualization: 'ChartViewSearchSunburst.vue',
    text: 'Visualize the targeting criteria used by one specific advertiser. You can look up the advertiser in the table below and click on it to visualise them.'
  },
  {
    id: 'personalization',
    sql: sqlPersonalization,
    files: ['personalization'],
    visualization: 'ChartViewTwitterInferredInfos.vue',
    title: 'Inferred Data',
    text: 'Find out what information Twitter has deduced about you'
  },
  genericDateViewer
]

export default blocks
