import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'
import { aggregate, countReducer } from '@/utils/aggregate'
import csvProcessors from '@/manifests/csv-processors'

function dashboardFillItems(items, impressionAttributes, isEngagement) {
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

async function dashboard(inputFiles) {
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
  dashboardFillItems(items, impressions, false)
  dashboardFillItems(items, engagements, true)

  return await Promise.resolve({ headers, items })
}

async function advertisersPerDay(inputFiles) {
  // JSON iterator
  const impressionsFile = JSON.parse(inputFiles['data/ad-impressions.js'])
  let impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  // Select relevant fields
  const headers = ['advertiserName', 'date', 'count']
  impressions = impressions.map(v => ({
    advertiserName: v.advertiserInfo.advertiserName,
    date: v.impressionTime.substring(0, 10)
  }))
  // GroupBy and count
  const items = aggregate(
    impressions,
    ['advertiserName', 'date'],
    countReducer('count')
  )

  return await Promise.resolve({ headers, items })
}

async function targetingTree(inputFiles) {
  // JSON iterator on impressions
  const impressionsFile = JSON.parse(inputFiles['data/ad-impressions.js'])
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  // Find 10 most present advertisers
  const advertisers = impressions.map(v => ({
    advertiserName: v.advertiserInfo.advertiserName
  }))
  const advertisersCount = aggregate(
    advertisers,
    ['advertiserName'],
    countReducer('count')
  )
  const topAdvertisers = _.chain(advertisersCount)
    .sortBy(x => -x.count)
    .take(10)
    .map('advertiserName')
    .value()
  // Iterator on targeting criteria
  let items = []
  impressions.forEach(v => {
    // Filter top advertisers
    if (topAdvertisers.includes(v.advertiserInfo.advertiserName)) {
      const criteria = JSONPath({
        path: '$.matchedTargetingCriteria[*]',
        json: v
      })
      criteria.forEach(criterion => {
        // Select relevant fields
        items.push({
          advertiserName: v.advertiserInfo.advertiserName,
          targetingType: criterion.targetingType,
          targetingValue: criterion.targetingValue
        })
      })
    }
  })
  let headers = ['advertiserName', 'targetingType', 'targetingValue', 'count']
  // GroupBy and count
  items = aggregate(
    items,
    ['advertiserName', 'targetingType', 'targetingValue'],
    countReducer('count')
  )
  // Transform to tree
  ;[headers, items] = csvProcessors.sunburstTargeting(headers, items)

  return await Promise.resolve({ headers, items })
}

export default {
  dashboard,
  advertisersPerDay,
  targetingTree
}
