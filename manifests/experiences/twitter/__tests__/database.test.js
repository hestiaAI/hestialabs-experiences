import fs from 'fs'
import path from 'path'
import databaseBuilder from '../database'
import { adImpressions, adEngagements } from './samples.helpers'
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

test('the database builder creates the tables correctly', async () => {
  const fileManager = await getFileManager()
  const db = await databaseBuilder(fileManager)
  let result, expected

  // Table twitterAds
  result = db.select('SELECT * FROM twitterAds')
  expected = {
    headers: ['id', 'tweetId', 'advertiserName', 'time', 'engagement'],
    items: [
      {
        id: 0,
        tweetId: '1369584490276741122',
        advertiserName: 'Illumeably',
        time: '2021-04-15 19:51:50',
        engagement: 0
      },
      {
        id: 1,
        tweetId: '1381646278988292098',
        advertiserName: 'PwC Switzerland',
        time: '2021-04-15 19:43:20',
        engagement: 1
      }
    ]
  }
  expect(result).toEqual(expected)

  // Table twitterCriteria
  result = db.select('SELECT * FROM twitterCriteria')
  expected = {
    headers: ['id', 'adId', 'targetingType', 'targetingValue'],
    items: [
      {
        id: 0,
        adId: 0,
        targetingType: 'Platforms',
        targetingValue: 'Desktop'
      },
      {
        id: 1,
        adId: 0,
        targetingType: 'Languages',
        targetingValue: 'English'
      },
      {
        id: 2,
        adId: 1,
        targetingType: 'Locations',
        targetingValue: 'Switzerland'
      },
      {
        id: 3,
        adId: 1,
        targetingType: 'Age',
        targetingValue: '35 and up'
      }
    ]
  }
  expect(result).toEqual(expected)

  db.close()
})

test('query advertisers-per-day returns the correct items', async () => {
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

  db.close()
})
