import { JSONPath } from 'jsonpath-plus'

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
  const headers = ['advertiserName', 'date', 'count']
  // Select relevant fields
  impressions = impressions.map(v => ({
    advertiserName: v.advertiserInfo.advertiserName,
    date: v.impressionTime.substring(0, 10)
  }))
  // GroupBy and count, using a tree
  impressions = impressions.reduce((acc, { advertiserName, date }) => {
    if (!acc[advertiserName]) {
      acc[advertiserName] = {}
    }
    const group = acc[advertiserName]
    if (!group[date]) {
      group[date] = { advertiserName, date, count: 0 }
    }
    group[date].count++
    return acc
  }, Object.create(null))
  // Flatten
  const items = []
  Object.entries(impressions).forEach(([k1, v1]) =>
    Object.entries(v1).forEach(([k2, v2]) => items.push(v2))
  )

  return await Promise.resolve({ headers, items })
}

export default {
  dashboard,
  advertisersPerDay
}
