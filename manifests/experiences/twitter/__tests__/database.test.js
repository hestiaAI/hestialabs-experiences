import fs from 'fs'
import path from 'path'

import {
  adImpressions,
  adEngagements,
  missingAttributesImpressions,
  missingAttributesEngagements
} from './samples.helpers'
import preprocessorsModule from '~/manifests/preprocessors'
import DBMS from '~/utils/sql'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db
const { files, preprocessors, databaseConfig } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../twitter.json'), 'utf8')
)
Object.entries(preprocessors).forEach(
  ([path, pre]) => (preprocessors[path] = preprocessorsModule[pre])
)

function runQuery(sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, sqlFilePath), 'utf8')
  return db.select(sql)
}

async function getDatabase(adImpressions, adEngagements) {
  const fileManager = new FileManager(preprocessors, null, files)
  const fileImpressions = mockFile(
    'test/data/ad-impressions.js',
    JSON.stringify(adImpressions)
  )
  const fileEngagements = mockFile(
    'test/data/ad-engagements.js',
    JSON.stringify(adEngagements)
  )
  await fileManager.init([fileImpressions, fileEngagements])
  db = await DBMS.createDB(databaseConfig)
  const records = await DBMS.generateRecords(fileManager, databaseConfig)
  DBMS.insertRecords(db, records)
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

    // Table TwitterAd
    result = db.select('SELECT * FROM TwitterAd')
    expected = {
      headers: ['id', 'tweetId', 'advertiserName', 'time', 'displayLocation'],
      items: [
        {
          id: 1,
          tweetId: '1381646278988292098',
          advertiserName: 'PwC Switzerland',
          displayLocation: 'TimelineHome',
          time: '2021-04-15 19:43:25'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)

    // Table TwitterCriterion
    result = db.select('SELECT * FROM TwitterCriterion')
    expected = {
      headers: ['adId', 'targetingType', 'targetingValue'],
      items: [
        {
          adId: 1,
          targetingType: 'Locations',
          targetingValue: 'Switzerland'
        },
        {
          adId: 1,
          targetingType: 'Age',
          targetingValue: '35 and up'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query ads-per-advertiser returns the correct items', () => {
    const result = runQuery('../queries/ads-per-advertiser.sql')
    const expected = {
      headers: ['advertiserName', 'date', 'count'],
      items: [
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
      items: [{ advertiserName: 'PwC Switzerland', count: 1 }]
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
        'engagements',
        'date',
        'targetingType',
        'targetingValue'
      ],
      items: [
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date: '2021-04-15 19:43:25',
          targetingType: 'Locations',
          targetingValue: 'Switzerland'
        },
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date: '2021-04-15 19:43:25',
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
