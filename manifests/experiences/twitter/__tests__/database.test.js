import fs from 'fs'
import path from 'path'

import databaseBuilder from '../database'
import {
  adImpressions,
  adEngagements,
  missingAttributesImpressions,
  missingAttributesEngagements
} from './samples.helpers'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db

function runQuery(sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, sqlFilePath), 'utf8')
  return db.select(sql)
}

async function getDatabase(adImpressions, adEngagements) {
  const fileManager = new FileManager(
    {
      'test/data/ad-impressions.js': preprocessors.twitter,
      'test/data/ad-engagements.js': preprocessors.twitter
    },
    true
  )
  const fileImpressions = mockFile(
    'test/data/ad-impressions.js',
    JSON.stringify(adImpressions)
  )
  const fileEngagements = mockFile(
    'test/data/ad-engagements.js',
    JSON.stringify(adEngagements)
  )
  await fileManager.init([fileImpressions, fileEngagements], true)

  db = await databaseBuilder(fileManager)
}

describe('with incomplete samples', () => {
  test('the database builder creates the tables without error', async () => {
    await getDatabase(
      missingAttributesImpressions,
      missingAttributesEngagements
    )
    db.close()
  })
})

describe('with complete samples', () => {
  beforeAll(async () => {
    await getDatabase(adImpressions, adEngagements)
  })

  afterAll(() => {
    db.close()
  })

  test('the database builder creates the tables correctly', () => {
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
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)

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
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query advertisers-per-day returns the correct items', () => {
    const result = runQuery('../queries/advertisers-per-day.sql')
    const expected = {
      headers: ['advertiserName', 'date', 'count'],
      items: [
        { advertiserName: 'Illumeably', date: '2021-04-15', count: 1 },
        { advertiserName: 'PwC Switzerland', date: '2021-04-15', count: 1 }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query all-advertisers returns the correct items', () => {
    const result = runQuery('../queries/all-advertisers.sql')
    const expected = {
      headers: ['advertiserName', 'count'],
      items: [
        { advertiserName: 'Illumeably', count: 1 },
        { advertiserName: 'PwC Switzerland', count: 1 }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query all-criteria-all-advertisers returns the correct items', () => {
    const result = runQuery('../queries/all-criteria-all-advertisers.sql')
    const expected = {
      headers: ['advertiserName', 'targetingType', 'targetingValue', 'count'],
      items: [
        {
          advertiserName: 'Illumeably',
          targetingType: 'Platforms',
          targetingValue: 'Desktop',
          count: 1
        },
        {
          advertiserName: 'Illumeably',
          targetingType: 'Languages',
          targetingValue: 'English',
          count: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Age',
          targetingValue: '35 and up',
          count: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query overview returns the correct items', () => {
    const result = runQuery('../queries/overview.sql')
    const expected = {
      headers: [
        'tweetId',
        'companyName',
        'engagement',
        'date',
        'targetingType',
        'targetingValue'
      ],
      items: [
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          engagement: 0,
          date: '2021-04-15 19:51:50',
          targetingType: 'Platforms',
          targetingValue: 'Desktop'
        },
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          engagement: 0,
          date: '2021-04-15 19:51:50',
          targetingType: 'Languages',
          targetingValue: 'English'
        },
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagement: 1,
          date: '2021-04-15 19:43:20',
          targetingType: 'Locations',
          targetingValue: 'Switzerland'
        },
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagement: 1,
          date: '2021-04-15 19:43:20',
          targetingType: 'Age',
          targetingValue: '35 and up'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query targeting-criteria-all-advertisers returns the correct items', () => {
    const result = runQuery('../queries/targeting-criteria-all-advertisers.sql')
    const expected = {
      headers: ['targetingType', 'targetingValue', 'count'],
      items: [
        {
          targetingType: 'Platforms',
          targetingValue: 'Desktop',
          count: 1
        },
        {
          targetingType: 'Languages',
          targetingValue: 'English',
          count: 1
        },
        {
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count: 1
        },
        {
          targetingType: 'Age',
          targetingValue: '35 and up',
          count: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query targeting-criteria-by-advertiser returns the correct items', () => {
    const result = runQuery('../queries/targeting-criteria-by-advertiser.sql')
    const expected = {
      headers: ['advertiserName', 'targetingType', 'targetingValue', 'count'],
      items: [
        {
          advertiserName: 'Illumeably',
          targetingType: 'Platforms',
          targetingValue: 'Desktop',
          count: 1
        },
        {
          advertiserName: 'Illumeably',
          targetingType: 'Languages',
          targetingValue: 'English',
          count: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Age',
          targetingValue: '35 and up',
          count: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
