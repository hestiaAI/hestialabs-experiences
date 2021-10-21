// Functions defined in this module should expect an object containing the input filenames and their content
// They should return an object containing the headers and items (CSV-like format).
import * as csv from '@fast-csv/parse'
import { JSONPath } from 'jsonpath-plus'

const trackerControl = async inputFiles => {
  const data = Object.values(inputFiles)[0]
  const { headers, items } = await new Promise(resolve => {
    const items = []
    csv
      .parseString(data, { headers: true })
      .on('data', row => items.push(row))
      .on('end', () => resolve({ headers: Object.keys(items[0]), items }))
  })
  return { headers, items }
}

const twitterDashboard = inputFiles => {
  function fillItems(items, impressionAttributes, isEngagement) {
    impressionAttributes.forEach(v => {
      const criteria = JSONPath({
        path: '$.matchedTargetingCriteria[*]',
        json: v
      })
      criteria.forEach(criterion => {
        if (v.promotedTweetInfo) {
          items.push({
            tweet_id: v.promotedTweetInfo.tweetId,
            companyName: v.advertiserInfo.advertiserName,
            engagement: isEngagement,
            date: v.impressionTime,
            targetingType: criterion.targetingType,
            targetingValue: criterion.targetingValue
          })
        }
      })
    })
  }

  const engagementsFile = JSON.parse(inputFiles['data/ad-engagements.js'])
  const impressionsFile = JSON.parse(inputFiles['data/ad-impressions.js'])
  const engagements = JSONPath({
    path: '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes',
    json: engagementsFile
  })
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  const headers = [
    'tweet_id',
    'companyName',
    'engagement',
    'date',
    'targetingType',
    'targetingValue'
  ]
  const items = []
  fillItems(items, impressions, false)
  fillItems(items, engagements, true)

  return { headers, items }
}

export default {
  trackerControl,
  twitterDashboard
}
