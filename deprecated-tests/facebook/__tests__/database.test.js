import fs from 'fs'
import path from 'path'

import {
  advertisersUsingYourActivity,
  advertisersWhoUploadedAContactList,
  advertisersInteractedWith,
  yourOffFacebookActivity,
  adsInterests
} from './samples.helpers'
import preprocessorsModule from '~/manifests/preprocessors'
import DBMS from '~/utils/sql'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db
const { files, preprocessors, databaseConfig } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../facebook.json'), 'utf8')
)
Object.entries(preprocessors).forEach(
  ([path, pre]) => (preprocessors[path] = preprocessorsModule[pre])
)

function runQuery(sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, sqlFilePath), 'utf8')
  return db.select(sql)
}

async function getDatabase(mockedFiles) {
  const fileManager = new FileManager(preprocessors, null, files)
  await fileManager.init(mockedFiles)
  db = await DBMS.createDB(databaseConfig)
  const records = await DBMS.generateRecords(fileManager, databaseConfig)
  DBMS.insertRecords(db, records)
}

describe('with complete samples', () => {
  beforeAll(async () => {
    const files = [
      mockFile(
        'ads_information/advertisers_using_your_activity_or_information.json',
        JSON.stringify(advertisersUsingYourActivity)
      ),
      mockFile(
        'ads_information/advertisers_who_uploaded_a_contact_list_with_your_information.json',
        JSON.stringify(advertisersWhoUploadedAContactList)
      ),
      mockFile(
        "ads_information/advertisers_you've_interacted_with.json",
        JSON.stringify(advertisersInteractedWith)
      ),
      mockFile(
        'apps_and_websites_off_of_facebook/your_off-facebook_activity.json',
        JSON.stringify(yourOffFacebookActivity)
      ),
      mockFile(
        'other_logged_information/ads_interests.json',
        JSON.stringify(adsInterests)
      )
    ]
    await getDatabase(files)
  })

  afterAll(() => {
    db.close()
  })

  test('query your-topics returns the correct items', () => {
    const result = runQuery('../queries/your-topics.sql')
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
    const result = runQuery('../queries/off-facebook-activity-count.sql')
    const expected = {
      headers: ['advertiserName', 'date', 'count'],
      items: [
        {
          advertiserName: 'App01',
          date: 1615460377,
          count: 1
        },
        {
          advertiserName: 'App02',
          date: 1600622182,
          count: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query off-facebook-activity-type-count returns the correct items', () => {
    const result = runQuery('../queries/off-facebook-activity-type-count.sql')
    const expected = {
      headers: ['targetingType', 'targetingValue', 'count'],
      items: [
        {
          targetingType: 'App01',
          targetingValue: 'CUSTOM',
          count: 1
        },
        {
          targetingType: 'App02',
          targetingValue: 'CUSTOM',
          count: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query ad-interactions returns the correct items', () => {
    const result = runQuery('../queries/ad-interactions.sql')
    const expected = {
      headers: ['title', 'action', 'timestamp'],
      items: [
        {
          title: 'SALE',
          action: 'Closed ad',
          timestamp: 1629695476
        },
        {
          title: 'How to get 10000$ with this one simple trick',
          action: 'Clicked ad',
          timestamp: 1629440065
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query advertisers-contact-list returns the correct items', () => {
    const result = runQuery('../queries/advertisers-contact-list.sql')
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