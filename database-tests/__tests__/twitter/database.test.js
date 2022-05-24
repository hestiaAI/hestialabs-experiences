import experience from '@hestiaai/twitter'
import {
  adImpressions,
  adEngagements,
  missingAttributesImpressions,
  missingAttributesEngagements
} from './samples.helpers'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { DatabaseTester, arrayEqualNoOrder } from '~/utils/test-utils'

const tester = DatabaseTester()

async function init(adImpressions, adEngagements) {
  const files = [
    mockFile('test/data/ad-impressions.js', JSON.stringify(adImpressions)),
    mockFile('test/data/ad-engagements.js', JSON.stringify(adEngagements))
  ]
  await tester.init(experience, files)
}

describe('with incomplete samples', () => {
  test('the database builder creates the tables without error', async () => {
    await init(missingAttributesImpressions, missingAttributesEngagements)
    tester.close()
  })
})

describe('with complete samples', () => {
  beforeAll(async () => await init(adImpressions, adEngagements))
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
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query ads-per-advertiser returns the correct items', () => {
    const result = tester.select('../queries/ads-per-advertiser.sql')
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
    const result = tester.select('../queries/all-advertisers.sql')
    const expected = {
      headers: ['advertiserName', 'count'],
      items: [{ advertiserName: 'PwC Switzerland', count: 1 }]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query all-criteria-all-advertisers returns the correct items', () => {
    const result = tester.select('../queries/all-criteria-all-advertisers.sql')
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
    const result = tester.select('../queries/overview.sql')
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
    const result = tester.select(
      '../queries/targeting-criteria-all-advertisers.sql'
    )
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
    const result = tester.select(
      '../queries/targeting-criteria-by-advertiser.sql'
    )
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
