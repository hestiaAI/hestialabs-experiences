import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'ResourceAccessIOS',
      columns: [
        ['app', TEXT],
        ['identifierType', TEXT],
        ['category', TEXT],
        ['identifier', TEXT],
        ['kind', TEXT],
        ['timestamp', TEXT],
        ['type', TEXT]
      ]
    },
    {
      name: 'NetworkActivityIOS',
      columns: [
        ['domain', TEXT],
        ['context', TEXT],
        ['domainType', TEXT],
        ['initiatedType', TEXT],
        ['hits', TEXT],
        ['firstTimeStamp', TEXT],
        ['domainOwner', TEXT],
        ['bundleId', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'access',
      path: '$.result.items[*]',
      table: 'ResourceAccessIOS',
      getters: [
        {
          column: 'app',
          path: '$.app'
        },
        {
          column: 'category',
          path: '$.category'
        },
        {
          column: 'identifier',
          path: '$.identifier'
        },
        {
          column: 'timestamp',
          path: '$.timestamp'
        }
      ]
    },
    {
      fileId: 'network',
      path: '$.result.items[*]',
      table: 'NetworkActivityIOS',
      getters: [
        {
          column: 'bundleId',
          path: '$.bundleId'
        },
        {
          column: 'domain',
          path: '$.domain'
        },
        {
          column: 'domainOwner',
          path: '$.domainOwner'
        },
        {
          column: 'domainType',
          path: '$.domainType'
        },
        {
          column: 'context',
          path: '$.context'
        },
        {
          column: 'firstTimeStamp',
          path: '$.firstTimeStamp'
        },
        {
          column: 'initiatedType',
          path: '$.initiatedType'
        },
        {
          column: 'hits',
          path: '$.hits'
        }
      ]
    }
  ]
}

export default config
