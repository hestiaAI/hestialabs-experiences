import fs from 'fs'
import path from 'path'
import { createItems, databaseBuilder } from '../database'
import {
  adImpressions,
  adEngagements,
  adsItemsExpected,
  targetingItemsExpected
} from './samples.helpers'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'

async function getFileManager() {
  const fileManager = new FileManager(
    {
      'data/ad-impressions.js': preprocessors.twitter,
      'data/ad-engagements.js': preprocessors.twitter
    },
    true
  )
  const fileImpressions = mockFile(
    'data/ad-impressions.js',
    JSON.stringify(adImpressions)
  )
  const fileEngagements = mockFile(
    'data/ad-engagements.js',
    JSON.stringify(adEngagements)
  )
  await fileManager.init([fileImpressions, fileEngagements], true)

  return fileManager
}

test('the twitter file parser returns the correct items for the database', async () => {
  const fileManager = await getFileManager()
  const impressionsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-impressions.js')
  )
  const engagementsFile = JSON.parse(
    await fileManager.getPreprocessedText('data/ad-engagements.js')
  )
  const results = createItems({ impressionsFile, engagementsFile })
  const { adsItems, targetingItems } = results
  expect(adsItems).toEqual(adsItemsExpected)
  expect(targetingItems).toEqual(targetingItemsExpected)
})

test('the advertisers-per-day query returns the correct items', async () => {
  const fileManager = await getFileManager()
  const db = await databaseBuilder(fileManager)
  const sql = fs.readFileSync(
    path.resolve(__dirname, '../queries/advertisers-per-day.sql'),
    'utf8'
  )
  const result = db.select(sql)
  const expected = {
    headers: ['advertiserName', 'date', 'count'],
    items: [
      { advertiserName: 'Illumeably', date: '2021-04-15', count: 1 },
      { advertiserName: 'PwC Switzerland', date: '2021-04-15', count: 1 }
    ]
  }
  expect(result).toEqual(expected)
})
