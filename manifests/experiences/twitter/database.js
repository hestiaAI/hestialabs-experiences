import { JSONPath } from 'jsonpath-plus'
import db from '@/utils/sql'

export default async function databaseBuilder(fileManager) {
  await db.init()

  db.create('twitterAds', [
    ['id', 'INTEGER'],
    ['tweetId', 'INTEGER'],
    ['advertiserName', 'TEXT'],
    ['time', 'DATE'],
    ['engagement', 'INTEGER']
  ])
  db.create('twitterCriteria', [
    ['id', 'INTEGER'],
    ['adId', 'INTEGER'],
    ['targetingType', 'TEXT'],
    ['targetingValue', 'TEXT']
  ])

  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  const engagementsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-engagements.js')
  )
  const engagements = JSONPath({
    path: '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes',
    json: engagementsFile
  })

  const adsItems = []
  const targetingItems = []
  let j = 0
  const files = [
    { values: impressions, engagement: 0 },
    { values: engagements, engagement: 1 }
  ]
  for (const file of files) {
    file.values.forEach((v, i) => {
      adsItems.push({
        id: i,
        tweetId: v.promotedTweetInfo?.tweetId ?? null,
        advertiserName: v.advertiserInfo?.advertiserName ?? null,
        time: v.impressionTime,
        engagement: file.engagement
      })
      const criteria = JSONPath({
        path: '$.matchedTargetingCriteria[*]',
        json: v
      })
      criteria.forEach(criterion => {
        targetingItems.push({
          id: j++,
          adId: i,
          targetingType: criterion?.targetingType ?? null,
          targetingValue: criterion?.targetingValue ?? null
        })
      })
    })
  }
  db.insert('twitterAds', adsItems)
  db.insert('twitterCriteria', targetingItems)
}
