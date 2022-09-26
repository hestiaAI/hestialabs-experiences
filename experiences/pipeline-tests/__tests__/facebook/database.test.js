import experience from '@hestiaai/facebook'
import {
  advertisersUsingYourActivity,
  advertisersWhoUploadedAContactList,
  advertisersInteractedWith,
  yourOffFacebookActivity,
  adsInterests
} from './samples.helpers'
import { NodeFile } from '~/utils/file-manager'
import {
  DatabaseTester,
  arrayEqualNoOrder,
  getSqlFromBlock
} from '~/utils/test-utils'

const tester = new DatabaseTester()
const getSql = getSqlFromBlock.bind(null, experience)

describe('with complete samples', () => {
  beforeAll(async() => {
    const files = [
      new NodeFile(
        'ads_information/advertisers_using_your_activity_or_information.json',
        JSON.stringify(advertisersUsingYourActivity)
      ),
      new NodeFile(
        'ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json',
        JSON.stringify(advertisersWhoUploadedAContactList)
      ),
      new NodeFile(
        "ads_information/advertisers_you've_interacted_with.json",
        JSON.stringify(advertisersInteractedWith)
      ),
      new NodeFile(
        'apps_and_websites_off_of_facebook/your_off-facebook_activity.json',
        JSON.stringify(yourOffFacebookActivity)
      ),
      new NodeFile(
        'other_logged_information/ads_interests.json',
        JSON.stringify(adsInterests)
      )
    ]
    await tester.init(experience, files)
  })

  afterAll(() => tester.close())

  test('query your-topics returns the correct items', () => {
    const sql = getSql('your-topics')
    const result = tester.select(sql)
    const expected = {
      headers: ['name'],
      items: [
        {
          name: 'Computer Science'
        },
        {
          name: 'Space'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query off-facebook-activity-count returns the correct items', () => {
    const sql = getSql('off-facebook-activity-count')
    const result = tester.select(sql)
    const expected = {
      headers: ['advertiserName', 'date_', 'count_'],
      items: [
        {
          advertiserName: 'App01',
          date_: 1615460377,
          count_: 1
        },
        {
          advertiserName: 'App02',
          date_: 1600622182,
          count_: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query off-facebook-activity-type-count returns the correct items', () => {
    const sql = getSql('off-facebook-activity-type-count')
    const result = tester.select(sql)
    const expected = {
      headers: ['targetingType', 'targetingValue', 'count_'],
      items: [
        {
          targetingType: 'App01',
          targetingValue: 'CUSTOM',
          count_: 1
        },
        {
          targetingType: 'App02',
          targetingValue: 'CUSTOM',
          count_: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query ad-interactions returns the correct items', () => {
    const sql = getSql('ad-interactions')
    const result = tester.select(sql)
    const expected = {
      headers: ['title', 'action', 'timestamp'],
      items: [
        {
          title: 'SALE',
          action: 'Closed ad',
          timestamp: '2021-08-23 05:11:16'
        },
        {
          title: 'How to get 10000$ with this one simple trick',
          action: 'Clicked ad',
          timestamp: '2021-08-20 06:14:25'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query advertisers-contact-list returns the correct items', () => {
    const sql = getSql('advertisers-contact-list')
    const result = tester.select(sql)
    const expected = {
      headers: ['name'],
      items: [
        {
          name: 'Apple'
        },
        {
          name: 'Google'
        },
        {
          name: 'Microsoft'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
