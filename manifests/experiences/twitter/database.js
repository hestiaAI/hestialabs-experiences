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
  const adsItems = []
  const targetingItems = []
  let j = 0
  impressions.forEach((v, i) => {
    adsItems.push({
      id: i,
      tweetId: v.promotedTweetInfo?.tweetId ?? null,
      advertiserName: v.advertiserInfo.advertiserName,
      time: v.impressionTime,
      engagement: 0
    })
    const criteria = JSONPath({
      path: '$.matchedTargetingCriteria[*]',
      json: v
    })
    criteria.forEach(criterion => {
      targetingItems.push({
        id: j++,
        adId: i,
        targetingType: criterion.targetingType,
        targetingValue: criterion?.targetingValue ?? null
      })
    })
  })
  db.insert('twitterAds', adsItems)
  db.insert('twitterCriteria', targetingItems)
}
