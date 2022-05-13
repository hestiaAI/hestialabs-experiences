import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'InstagramMessage',
      columns: [
        ['senderName', TEXT],
        ['timestampMS', TEXT],
        ['messageContent', TEXT]
      ]
    },
    {
      name: 'InstagramFollower',
      columns: [
        ['accountName', TEXT],
        ['timestampMS', TEXT],
        ['accountURL', TEXT]
      ]
    },
    {
      name: 'InstagramFollowing',
      columns: [
        ['accountName', TEXT],
        ['timestampMS', TEXT],
        ['accountURL', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'messages',
      path: '$.messages[*]',
      table: 'InstagramMessage',
      getters: [
        {
          column: 'senderName',
          path: '$.sender_name'
        },
        {
          column: 'timestampMS',
          path: '$.timestamp_ms'
        },
        {
          column: 'messageContent',
          path: '$.content'
        }
      ]
    },
    {
      fileId: 'followers',
      path: '$.relationships_followers[*].string_list_data[0]',
      table: 'InstagramFollower',
      getters: [
        {
          column: 'accountName',
          path: '$.value'
        },
        {
          column: 'timestampMS',
          path: '$.timestamp'
        },
        {
          column: 'accountURL',
          path: '$.href'
        }
      ]
    },
    {
      fileId: 'followings',
      path: '$.relationships_following[*].string_list_data[0]',
      table: 'InstagramFollowing',
      getters: [
        {
          column: 'accountName',
          path: '$.value'
        },
        {
          column: 'timestampMS',
          path: '$.timestamp'
        },
        {
          column: 'accountURL',
          path: '$.href'
        }
      ]
    }
  ]
}

export default config
