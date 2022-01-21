import fs from 'fs'
import path from 'path'

import databaseBuilder from '../database'
import {
  advertisersUsingYourActivity,
  advertisersWhoUploadedAContactList,
  advertisersInteractedWith,
  yourOffFacebookActivity,
  adsInterests
} from './samples.helpers'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../facebook.json'), 'utf8')
)
Object.entries(manifest.preprocessors).forEach(
  ([path, pre]) => (manifest.preprocessors[path] = preprocessors[pre])
)

function runQuery(sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, sqlFilePath), 'utf8')
  return db.select(sql)
}

async function getDatabase(mockedFiles) {
  const fileManager = new FileManager(manifest.preprocessors)
  await fileManager.init(mockedFiles, true, manifest.files)
  db = await databaseBuilder(fileManager)
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
})
