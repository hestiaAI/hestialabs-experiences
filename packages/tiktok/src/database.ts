import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TiktokComment',
      columns: [
        ['date', TEXT],
        ['comment', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'userdata',
      path: '$.Comment.Comments.CommentsList[*]',
      table: 'TiktokComment',
      getters: [
        {
          column: 'date',
          path: '$.Date'
        },
        {
          column: 'comment',
          path: '$.Comment'
        }
      ]
    }
  ]
}

export default config
