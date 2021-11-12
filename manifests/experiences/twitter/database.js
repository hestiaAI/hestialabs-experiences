import { JSONPath } from 'jsonpath-plus'
import db from '@/utils/sql'

export default async function databaseBuilder(fileManager) {
  await db.init()

  db.run('CREATE TABLE twitterAds (id INTEGER, advertiserName TEXT, date TEXT)')

  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const impressions = JSONPath({
    path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
    json: impressionsFile
  })
  // TODO escape special characters
  const sqlInsert = impressions.map((v, i) => {
    const id = i
    const advertiserName = v.advertiserInfo.advertiserName
    const date = v.impressionTime.substring(0, 10)
    return `INSERT INTO twitterAds VALUES (${id}, "${advertiserName}", "${date}");`
  })
  db.run(sqlInsert.join(' '))
}
