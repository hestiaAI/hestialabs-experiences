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

  test('query app-opens returns the correct items', () => {
    const result = runQuery('../queries/app-opens.sql')
    const expected = {
      headers: ['date', 'open'],
      items: [
        {
          date: '2019-01-01',
          open: 5
        },
        {
          date: '2020-01-01',
          open: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
