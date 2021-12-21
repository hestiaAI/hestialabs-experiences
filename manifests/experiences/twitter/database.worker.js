import { JSONPath } from 'jsonpath-plus'

// For some reason I couldn't import this function from database.js.
// Also, if you use optional chaining, you get an error
// complaining that the webworker-loader is not being used.
function createItems(data) {
  const { impressions, engagements } = data
  const adsItems = []
  const targetingItems = []
  let targetingItemsId = 0
  let adsId = 0
  const files = [
    { values: impressions, engagement: 0 },
    { values: engagements, engagement: 1 }
  ]
  for (const file of files) {
    file.values.forEach(v => {
      const tweetId = v.promotedTweetInfo ? v.promotedTweetInfo.tweetId : null
      const advertiserName = v.advertiserInfo
        ? v.advertiserInfo.advertiserName
        : null
      adsItems.push({
        id: adsId,
        tweetId,
        advertiserName,
        time: v.impressionTime,
        engagement: file.engagement
      })
      const criteria = JSONPath({
        path: '$.matchedTargetingCriteria[*]',
        json: v
      })
      criteria.forEach(criterion => {
        let targetingType = null
        let targetingValue = null
        if (criterion) {
          targetingType = criterion.targetingType || null
          targetingValue = criterion.targetingValue || null
        }
        targetingItems.push({
          id: targetingItemsId++,
          adId: adsId,
          targetingType,
          targetingValue
        })
      })
      adsId++
    })
  }
  return { adsItems, targetingItems }
}

onmessage = message => postMessage(createItems(message.data))
