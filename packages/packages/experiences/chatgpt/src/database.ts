import type { DatabaseConfig } from '@/types'
import {
  SQLType,
  JSONPathResultType,
  JSONPathReturnObject
} from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'Messages',
      columns: [
        ['createTime', TEXT],
        ['role', TEXT],
        ['content', TEXT],
        ['status', TEXT],
        ['convTitle', TEXT],
        ['convId', TEXT],
        ['convCreateTime', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'conversations',
      path: '$..message',
      table: 'Messages',
      options: {
        resultType: JSONPathResultType.all,
        callback: output => {
          const o = output as JSONPathReturnObject
          if (o.value && typeof o.value === 'object') {
            const timestamp = (o.value as { create_time?: number })[
              'create_time'
            ]?.toString()
            if (timestamp) {
              const parsedTimestamp = parseInt(timestamp.split('.')[0])
              if (!isNaN(parsedTimestamp)) {
                o['create_time'] = new Date(
                  parsedTimestamp * 1000
                ).toISOString()
              }
            }
          }
          o['conv_title'] = o.path.split("['mapping']")[0] + "['title']"
          o['conv_id'] = o.path.split("['mapping']")[0] + "['id']"
        }
      },
      getters: [
        {
          column: 'createTime',
          path: '$.create_time'
        },
        {
          column: 'role',
          path: '$.value.author.role'
        },
        {
          column: 'content',
          path: '$.value.content.parts'
        },
        {
          column: 'status',
          path: '$.value.status'
        },
        {
          queryRoot: true,
          column: 'convTitle',
          pathKey: 'conv_title'
        },
        {
          queryRoot: true,
          column: 'convId',
          pathKey: 'conv_id'
        }
      ]
    }
  ]
}

export default config
