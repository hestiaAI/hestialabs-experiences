import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'InstagramComment',
      columns: [
        ['datetime', TEXT],
        ['text', TEXT],
        ['sender', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'comments',
      path: '$.media_comments[*]',
      table: 'InstagramComment',
      getters: [
        {
          column: 'datetime',
          path: '$.[0]'
        },
        {
          column: 'text',
          path: '$.[1]'
        },
        {
          column: 'sender',
          path: '$.[2]'
        }
      ]
    }
  ]
}

export default config
