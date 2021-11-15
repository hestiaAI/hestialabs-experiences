import { JSONPath } from 'jsonpath-plus'
import db from '@/utils/sql'

export default async function databaseBuilder(fileManager) {
  await db.init()

  db.create('twitterAds', [
    ['id', 'INTEGER'],
    ['advertiserName', 'TEXT'],
    ['date', 'TEXT']
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
    advertiserName: v.advertiserInfo.advertiserName,
    date: v.impressionTime.substring(0, 10)
  }))
  db.insert('twitterAds', items)
}
