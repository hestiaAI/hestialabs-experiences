// import { readFileSync } from 'fs'
// import path from 'path'
import experience from '@hestia.ai/twitter'
import {
  adImpressions,
  adEngagements,
  missingAttributesImpressions,
  missingAttributesEngagements
} from './samples.helpers'
import NodeFile from '~/utils/node-file'
import {
  DatabaseTester,
  arrayEqualNoOrder,
  getSqlFromBlock
} from '~/utils/test-utils'

const tester = new DatabaseTester()
const getSql = getSqlFromBlock.bind(null, experience)

async function init(adImpressions, adEngagements) {
  const files = [
    new NodeFile('test/data/ad-impressions.js', JSON.stringify(adImpressions)),
    new NodeFile('test/data/ad-engagements.js', JSON.stringify(adEngagements))
  ]
  await tester.init(experience, files)
}

describe('with incomplete samples', () => {
  test('the database builder creates the tables without error', async() => {
    await init(missingAttributesImpressions, missingAttributesEngagements)
    tester.close()
  })
})

describe('with complete samples', () => {
  beforeAll(async() => await init(adImpressions, adEngagements))
  afterAll(() => tester.close())

  test('the database builder creates the tables correctly', () => {
    let result, expected

    // Table TwitterAd
    result = tester.select('SELECT * FROM TwitterAd')
    expected = {
      headers: ['id', 'tweetId', 'advertiserName', 'time', 'displayLocation'],
      items: [
        {
          id: 1,
          tweetId: '1381646278988292098',
          advertiserName: 'PwC Switzerland',
          displayLocation: 'TimelineHome',
          time: '2021-04-15 19:43:25'
        },
        {
          id: 2,
          tweetId: '1389506561530384384',
          advertiserName: 'digitec',
          displayLocation: 'SearchTweets',
          time: '2020-06-05 15:27:46'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)

    // Table TwitterCriterion
    result = tester.select('SELECT * FROM TwitterCriterion')
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
        },
        {
          adId: 2,
          targetingType: 'Locations',
          targetingValue: 'Switzerland'
        },
        { adId: 2, targetingType: 'Languages', targetingValue: 'English' }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query ads-per-advertiser returns the correct items', () => {
    const sql = getSql('ads-per-advertiser')
    const result = tester.select(sql)
    const expected = {
      headers: ['advertiserName', 'date_', 'count_'],
      items: [
        { advertiserName: 'PwC Switzerland', date_: '2021-04-15', count_: 1 },
        { advertiserName: 'digitec', date_: '2020-06-05', count_: 1 }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query all-criteria-all-advertisers returns the correct items', () => {
    const sql = getSql('all-criteria-all-advertisers')
    const result = tester.select(sql)
    const expected = {
      headers: ['advertiserName', 'targetingType', 'targetingValue', 'count_'],
      items: [
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count_: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Age',
          targetingValue: '35 and up',
          count_: 1
        },
        {
          advertiserName: 'digitec',
          targetingType: 'Languages',
          targetingValue: 'English',
          count_: 1
        },
        {
          advertiserName: 'digitec',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count_: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query overview returns the correct items', () => {
    const sql = getSql('overview')
    const result = tester.select(sql)
    const expected = {
      headers: [
        'tweetId',
        'companyName',
        'engagements',
        'date_',
        'targetingType',
        'targetingValue',
        'engagedWith'
      ],
      items: [
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date_: '2021-04-15 19:43:25',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          engagedWith: 'Yes'
        },
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date_: '2021-04-15 19:43:25',
          targetingType: 'Age',
          targetingValue: '35 and up',
          engagedWith: 'Yes'
        },
        {
          engagedWith: 'Yes',
          tweetId: '1389506561530384384',
          companyName: 'digitec',
          engagements: 1,
          date_: '2020-06-05 15:27:46',
          targetingType: 'Locations',
          targetingValue: 'Switzerland'
        },
        {
          engagedWith: 'Yes',
          tweetId: '1389506561530384384',
          companyName: 'digitec',
          engagements: 1,
          date_: '2020-06-05 15:27:46',
          targetingType: 'Languages',
          targetingValue: 'English'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query overview-last-month returns the correct items', () => {
    const sql = getSql('overview-last-month')
    // const sql = readFileSync(path.join(__dirname, 'overview-last-month.sql')).toString()
    const correctedSql = sql.replace('now', '2021-04-17')
    const result = tester.select(correctedSql)
    const expected = {
      headers: [
        'tweetId',
        'companyName',
        'engagements',
        'date_',
        'targetingType',
        'targetingValue',
        'engagedWith'
      ],
      items: [
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date_: '2021-04-15 19:43:25',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          engagedWith: 'Yes'
        },
        {
          tweetId: '1381646278988292098',
          companyName: 'PwC Switzerland',
          engagements: 1,
          date_: '2021-04-15 19:43:25',
          targetingType: 'Age',
          targetingValue: '35 and up',
          engagedWith: 'Yes'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query targeting-criteria-all-advertisers returns the correct items', () => {
    const sql = getSql('targeting-criteria-all-advertisers')
    const result = tester.select(sql)
    const expected = {
      headers: ['targetingType', 'targetingValue', 'count_'],
      items: [
        {
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count_: 2
        },
        {
          targetingType: 'Languages',
          targetingValue: 'English',
          count_: 1
        },
        {
          targetingType: 'Age',
          targetingValue: '35 and up',
          count_: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query targeting-criteria-by-advertiser returns the correct items', () => {
    const sql = getSql('targeting-criteria-by-advertiser')
    const result = tester.select(sql)
    const expected = {
      headers: ['advertiserName', 'targetingType', 'targetingValue', 'count_'],
      items: [
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count_: 1
        },
        {
          advertiserName: 'PwC Switzerland',
          targetingType: 'Age',
          targetingValue: '35 and up',
          count_: 1
        },
        {
          advertiserName: 'digitec',
          targetingType: 'Languages',
          targetingValue: 'English',
          count_: 1
        },
        {
          advertiserName: 'digitec',
          targetingType: 'Locations',
          targetingValue: 'Switzerland',
          count_: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
