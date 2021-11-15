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

  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  const items = impressions.map((v, i) => ({
    id: i,
    tweetId: v.promotedTweetInfo?.tweetId ?? null,
    advertiserName: v.advertiserInfo.advertiserName,
    time: v.impressionTime,
    engagement: 0
  }))
  db.insert('twitterAds', items)
}
