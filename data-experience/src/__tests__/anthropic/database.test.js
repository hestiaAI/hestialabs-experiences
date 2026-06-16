import experience from '@hestia.ai/anthropic'
import { conversations, memories } from './samples.helpers'
import NodeFile from '~/utils/node-file'
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
      new NodeFile('conversations.json', JSON.stringify(conversations)),
      new NodeFile('memories.json', JSON.stringify(memories))
    ]
    await tester.init(experience, files)
  })

  afterAll(() => tester.close())

  test('query messages returns the correct items', () => {
    const sql = getSql('messages')
    const result = tester.select(sql)
    const expected = {
      headers: ['createTime', 'role', 'content', 'convTitle', 'convId'],
      items: [
        {
          createTime: '2024-07-19T09:33:31.582203Z',
          role: 'human',
          content: 'Help me plan this migration.',
          convTitle: 'Project Planning',
          convId: 'conv-001'
        },
        {
          createTime: '2024-07-19T09:33:32.000000Z',
          role: 'assistant',
          content: 'Sure, let us break it into milestones.',
          convTitle: 'Project Planning',
          convId: 'conv-001'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })

  test('query conversations-memory returns the correct items', () => {
    const sql = getSql('conversations-memory')
    const result = tester.select(sql)
    const expected = {
      headers: ['accountUuid', 'conversationsMemory'],
      items: [
        {
          accountUuid: 'acc-001',
          conversationsMemory: 'User is working on data flow analysis for legal research.'
        }
      ]
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
