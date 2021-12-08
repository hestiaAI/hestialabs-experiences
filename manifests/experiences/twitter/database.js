import { JSONPath } from 'jsonpath-plus'
// eslint-disable-next-line import/default
import ItemsWorker from './database.worker.js'
import db from '@/utils/sql'
import { runWorker } from '@/utils/utils'

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
  const workerInput = { impressions, engagements }
  const workerOutput = await runWorker(new ItemsWorker(), workerInput)
  const { adsItems, targetingItems } = workerOutput
  db.insert('twitterAds', adsItems)
  db.insert('twitterCriteria', targetingItems)
}
