import { JSONPath } from 'jsonpath-plus'
import { DB } from '~/utils/sql'

export async function databaseBuilder(fileManager) {
  const db = new DB()
  await db.init()

  db.create('twitterAds', [
    ['id', 'INTEGER'],
    ['tweetId', 'TEXT'],
    ['advertiserName', 'TEXT'],
    ['time', 'DATE'],
    ['engagement', 'INTEGER']
  ])
  db.create('twitterCriteria', [
    ['id', 'INTEGER'],
    ['adId', 'TEXT'],
    ['targetingType', 'TEXT'],
    ['targetingValue', 'TEXT']
  ])

  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const engagementsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-engagements.js')
  )
  const { adsItems, targetingItems } = createItems({
    impressionsFile,
    engagementsFile
  })
  db.insert('twitterAds', adsItems)
  db.insert('twitterCriteria', targetingItems)
  return db
}

export function createItems({ impressionsFile, engagementsFile }) {
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  const engagements = JSONPath({
    path: '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes',
    json: engagementsFile
  })
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
