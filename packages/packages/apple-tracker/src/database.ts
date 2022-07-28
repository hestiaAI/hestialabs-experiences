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
        ['firstTimeStamp', TEXT],
        ['context', TEXT],
        ['timeStamp', TEXT],
        ['domainType', TEXT],
        ['initiatedType', TEXT],
        ['hits', TEXT],
        ['type', TEXT],
        ['domainOwner', TEXT],
        ['bundleId', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'tracker-control-ios',
      path: '$[?(@.type === "access")]',
      table: 'ResourceAccessIOS',
      getters: [
        {
          column: 'app',
          path: '$.accessor.identifier'
        },
        {
          column: 'identifierType',
          path: '$.accessor.identifierType'
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
          column: 'kind',
          path: '$.kind'
        },
        {
          column: 'timestamp',
          path: '$.timeStamp'
        },
        {
          column: 'type',
          path: '$.type'
        }
      ]
    },
    {
      fileId: 'tracker-control-ios',
      path: '$[?(@.type === "networkActivity")]',
      table: 'NetworkActivityIOS',
      getters: [
        {
          column: 'domain',
          path: '$.domain'
        },
        {
          column: 'firstTimeStamp',
          path: '$.firstTimeStamp'
        },
        {
          column: 'context',
          path: '$.context'
        },
        {
          column: 'timeStamp',
          path: '$.timeStamp'
        },
        {
          column: 'domainType',
          path: '$.domainType'
        },
        {
          column: 'initiatedType',
          path: '$.initiatedType'
        },
        {
          column: 'hits',
          path: '$.hits'
        },
        {
          column: 'type',
          path: '$.type'
        },
        {
          column: 'domainOwner',
          path: '$.domainOwner'
        },
        {
          column: 'bundleId',
          path: '$.bundleID'
        }
      ]
    }
  ]
}

export default config
