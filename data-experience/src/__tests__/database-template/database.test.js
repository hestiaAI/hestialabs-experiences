import experience from '@hestia.ai/database-template'
import { courierTasks, courierTasksHeaders, courierTasksItems } from './samples.helpers'
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
    const files = [new NodeFile('courier_tasks.csv', courierTasks)]
    await tester.init(experience, files)
  })

  afterAll(() => tester.close())

  test('query courierTasks returns the correct items', () => {
    const sql = getSql('courierTasks')
    const result = tester.select(sql)
    const expected = {
      headers: courierTasksHeaders,
      items: courierTasksItems
    }
    arrayEqualNoOrder(result.headers, expected.headers)
    arrayEqualNoOrder(result.items, expected.items)
  })
})
