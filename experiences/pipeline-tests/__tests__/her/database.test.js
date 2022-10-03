import experience from '@hestiaai/her'
import { her } from './samples.helpers'
import { NodeFile } from '~/utils/node-file'
import {
  DatabaseTester,
  arrayEqualNoOrder,
  getSqlFromBlock
} from '~/utils/test-utils'

const tester = new DatabaseTester()
const getSql = getSqlFromBlock.bind(null, experience)

describe('with complete samples', () => {
  beforeAll(async() => {
    const files = [new NodeFile('liked.csv', her)]
    await tester.init(experience, files)
  })

  afterAll(() => tester.close())

  test('query liked returns the correct items', () => {
    const sql = getSql('matches')
    const result = tester.select(sql)
    const expected = {
      headers: ['name', 'likedAt', 'matched'],
      items: [
        { likedAt: '01/01/1970 12:00', matched: 'TRUE', name: 'Plif' },
        { likedAt: '01/01/1970 13:23', matched: 'TRUE', name: 'Plaf' },
        { likedAt: '02/01/1970 21:42', matched: 'FALSE', name: 'Plouf' },
        { likedAt: '02/01/1970 12:42', matched: 'FALSE', name: 'Plif' }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
