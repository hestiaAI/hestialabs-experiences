import { JSONPath } from 'jsonpath-plus'

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

export default async function (inputFiles) {
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

  return await Promise.resolve({ headers, items })
}
