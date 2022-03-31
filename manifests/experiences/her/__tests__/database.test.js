import fs from 'fs'
import path from 'path'

import databaseBuilder from '../database'
import { her } from './samples.helpers'
import FileManager from '~/utils/file-manager'
import { mockFile } from '~/utils/__mocks__/file-manager-mock'
import { arrayEqualNoOrder } from '~/utils/test-utils'

let db
const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../her.json'), 'utf8')
)

function runQuery(sqlFilePath) {
  const sql = fs.readFileSync(path.resolve(__dirname, sqlFilePath), 'utf8')
  return db.select(sql)
}

async function getDatabase(mockedFiles) {
  const fileManager = new FileManager(null, null, manifest.files)
  await fileManager.init(mockedFiles)
  db = await databaseBuilder(fileManager)
}

describe('with complete samples', () => {
  beforeAll(async () => {
    const files = [mockFile('liked.csv', her)]
    await getDatabase(files)
  })

  afterAll(() => {
    db.close()
  })

  test('query all returns the correct items', () => {
    const result = runQuery('../queries/liked.sql')
    const expected = {
      headers: ['name', 'likedat', 'matched'],
      items: [
        { likedat: '01/01/1970 12:00', matched: 'TRUE', name: 'Plif' },
        { likedat: '01/01/1970 13:23', matched: 'TRUE', name: 'Plaf' },
        { likedat: '02/01/1970 21:42', matched: 'FALSE', name: 'Plouf' },
        { likedat: '02/01/1970 12:42', matched: 'FALSE', name: 'Plif' }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
