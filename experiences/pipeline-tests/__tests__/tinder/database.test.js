import experience from '@hestiaai/tinder'
import { tinder } from './samples.helpers'
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
    const files = [new NodeFile('input.json', JSON.stringify(tinder))]
    await tester.init(experience, files)
  })
  afterAll(() => tester.close())

  test('query all returns the correct items', () => {
    const sql = getSql('donut')
    const result = tester.select(sql)
    const expected = {
      headers: [
        'dateValue',
        'likes',
        'number_of_superlikes',
        'passes',
        'number_of_messages_sent',
        'number_of_messages_received',
        'number_of_matches',
        'opens'
      ],
      items: [
        {
          dateValue: '2019-01-01',
          likes: 10,
          number_of_superlikes: 0,
          passes: 23,
          number_of_messages_sent: 2,
          number_of_messages_received: 0,
          number_of_matches: 0,
          opens: 5
        },
        {
          dateValue: '2020-01-01',
          likes: 0,
          number_of_superlikes: 0,
          passes: 42,
          number_of_messages_sent: 3,
          number_of_messages_received: 1,
          number_of_matches: 1,
          opens: 1
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
