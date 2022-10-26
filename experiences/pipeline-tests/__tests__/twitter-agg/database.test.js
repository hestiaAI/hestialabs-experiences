// import { readFileSync } from 'fs'
// import path from 'path'
import experience from '@hestia.ai/twitter-agg'
import {
  ads,
  adsLastMonth,
  targeting
} from './samples.helpers'
import { NodeFile } from '~/utils/node-file'
import {
  DatabaseTester,
  arrayEqualNoOrder,
  getSqlFromBlock
} from '~/utils/test-utils'

const tester = new DatabaseTester()
const getSql = getSqlFromBlock.bind(null, experience)

async function init() {
  const files = [
    ['test/block00.json', JSON.stringify(ads)],
    ['test/block01.json', JSON.stringify(adsLastMonth)],
    ['test/block05.json', JSON.stringify(targeting)]
  ].map(([name, contents]) => new NodeFile(name, contents))
  await tester.init(experience, files)
}

describe('twitter-agg with complete samples', () => {
  beforeAll(async() => await init())
  afterAll(() => tester.close())

  test('the database builder creates the tables correctly', () => {
    let result, expected

    // Table TwitterAd
    result = tester.select('SELECT * FROM TwitterAd')
    expected = {
      headers: [
        'tweetId',
        'companyName',
        'impressionDate',
        'url',
        'engagedWith',
        'criteriaCount',
        'filePath'
      ],
      items: [
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          impressionDate: '2021-04-15 19:51:50',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block00.json'
        },
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          impressionDate: '2021-04-15 19:51:50',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block00.json'
        },
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          impressionDate: '2021-04-15 19:51:50',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block00.json'
        },
        {
          tweetId: '1380113782299488259',
          companyName: 'Crypto.com',
          impressionDate: '2021-04-15 19:49:08',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block00.json'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)

    // Table TwitterAdLastMonth
    result = tester.select('SELECT * FROM TwitterAdLastMonth')
    expected = {
      headers: [
        'tweetId',
        'companyName',
        'impressionDate',
        'url',
        'engagedWith',
        'criteriaCount',
        'filePath'
      ],
      items: [
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          impressionDate: '2021-04-15 19:51:50',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block01.json'
        },
        {
          tweetId: '1380113782299488259',
          companyName: 'Crypto.com',
          impressionDate: '2021-04-15 19:49:08',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block01.json'
        }
      ]
    }

    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query overview-last-month returns the correct items', () => {
    const sql = getSql('overview-last-month')
    const result = tester.select(sql)
    const expected = {
      headers: [
        'tweetId',
        'companyName',
        'impressionDate',
        'url',
        'engagedWith',
        'criteriaCount',
        'filePath'
      ],
      items: [
        {
          tweetId: '1369584490276741122',
          companyName: 'Illumeably',
          impressionDate: '2021-04-15 19:51:50',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block01.json'
        },
        {
          tweetId: '1380113782299488259',
          companyName: 'Crypto.com',
          impressionDate: '2021-04-15 19:49:08',
          url: null,
          engagedWith: 'No',
          criteriaCount: null,
          filePath: 'test/block01.json'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
