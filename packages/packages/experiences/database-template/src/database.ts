import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'CourierTasks',
      columns: [['beginDate', TEXT]]
    }
  ],
  getters: [
    {
      fileId: 'courier_tasks',
      path: '$.items[*]',
      table: 'CourierTasks',
      getters: [
        {
          column: 'beginDate',
          path: '$.taskCreationTime'
        }
      ]
    }
  ]
}

export default config
