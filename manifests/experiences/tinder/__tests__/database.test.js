import fs from 'fs'
import path from 'path'

import databaseBuilder from '../database'
import { tinder } from './samples.helpers'
import preprocessors from '~/manifests/preprocessors'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../tinder.json'), 'utf8')
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
    const files = [mockFile('input.json', JSON.stringify(tinder))]
    await getDatabase(files)
  })

  afterAll(() => {
    db.close()
  })

  test('query all returns the correct items', () => {
    const result = runQuery('../queries/all.sql')
    const expected = {
      headers: [
        'date',
        'likes',
        'number_of_superlikes',
        'passes',
        'number_of_messages_sent',
        'number_of_messages_received',
        'number_of_matches',
        'open'
      ],
      items: [
        {
          date: '2019-01-01',
          likes: 10,
          number_of_superlikes: 0,
          passes: 23,
          number_of_messages_sent: 2,
          number_of_messages_received: 0,
          number_of_matches: 0,
          open: 5
        },
        {
          date: '2020-01-01',
          likes: null,
          number_of_superlikes: 0,
          passes: 42,
          number_of_messages_sent: 3,
          number_of_messages_received: 1,
          number_of_matches: 1,
          open: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
