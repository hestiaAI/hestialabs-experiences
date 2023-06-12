import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'Messages',
      columns: [
        ['createTime', TEXT],
        ['role', TEXT],
        ['content', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'conversations',
      path: '$..Message',
      table: 'Messages',
      getters: [
        {
          column: 'createTime',
          path: '$.create_time'
        },
        {
          column: 'role',
          path: '$.author.role'
        },
        {
          column: 'content',
          path: '$.content.parts'
        }
      ]
    }
  ]
}

export default config
