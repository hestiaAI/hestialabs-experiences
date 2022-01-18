import { JSONPath } from 'jsonpath-plus'
import { DB } from '~/utils/sql'

async function getFileFromGlob(glob, fileManager) {
  const matches = fileManager.findMatchingFilePaths(glob)
  if (matches.length === 0) {
    throw new Error(`Missing file: ${glob}`)
  } else if (matches.length > 1) {
    console.warn(`File ${glob} was found multiple times`)
  }
  const file = await fileManager.getPreprocessedText(matches[0])
  return JSON.parse(file)
}

export default async function databaseBuilder(fileManager) {
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
    ['adId', 'INTEGER'],
    ['targetingType', 'TEXT'],
    ['targetingValue', 'TEXT']
  ])

  const impressionsFile = await getFileFromGlob(
    '**/ad-impressions.js',
    fileManager
  )
  const engagementsFile = await getFileFromGlob(
    '**/ad-engagements.js',
    fileManager
  )
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
      const tweetId = v.promotedTweetInfo?.tweetId ?? null
      const advertiserName = v.advertiserInfo?.advertiserName ?? null
      adsItems.push({
        id: adsId,
        tweetId,
        advertiserName,
        time: v.impressionTime ?? null,
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

  db.insert('twitterAds', adsItems)
  db.insert('twitterCriteria', targetingItems)
  return db
}
