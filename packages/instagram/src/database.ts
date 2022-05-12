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
      name: 'InstagramComment',
      columns: [
        ['datetime', TEXT],
        ['text', TEXT],
        ['sender', TEXT]
      ]
    },
    {
      name: 'InstagramConnection',
      columns: [
        ['datetime', TEXT],
        ['name', TEXT],
        ['type', TEXT]
      ]
    },
    {
      name: 'InstagramLike',
      columns: [
        ['datetime', TEXT],
        ['name', TEXT],
        ['type', TEXT]
      ]
    },
    {
      name: 'InstagramPhoto',
      columns: [
        ['caption', TEXT],
        ['datetime', TEXT],
        ['location', TEXT],
        ['path', TEXT]
      ]
    },
    {
      name: 'InstagramMessage',
      columns: [
        ['sender', TEXT],
        ['datetime', TEXT],
        ['text', TEXT]
      ]
    },
    {
      name: 'InstagramSavedCollection',
      columns: [
        ['collectionName', TEXT],
        ['mediaUserName', TEXT],
        ['mediaDateTime', TEXT]
      ]
    },
    {
      name: 'InstagramSearch',
      columns: [
        ['searchClick', TEXT],
        ['time', TEXT],
        ['type', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'comments',
      table: 'InstagramComment',
      path: '$.media_comments[*]',
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
    },
    {
      fileId: 'connections',
      path: '$..[*]@string()',
      table: 'InstagramConnection',
      options: {
        resultType: JSONPathResultType.all,
        callback: output => {
          const o = output as JSONPathReturnObject
          o['grandparentProperty'] = o.pointer.split('/')[1]
        }
      },
      getters: [
        {
          column: 'type',
          path: '$.grandparentProperty'
        },
        {
          column: 'name',
          path: '$.parentProperty'
        },
        {
          column: 'datetime',
          path: '$.value'
        }
      ]
    },
    {
      fileId: 'likes',
      path: '$.[*].[*]@array()',
      table: 'InstagramLike',
      options: {
        resultType: JSONPathResultType.all,
        callback: output => {
          const o = output as JSONPathReturnObject
          o['grandparentProperty'] = o.pointer.split('/')[1]
        }
      },
      getters: [
        {
          column: 'type',
          path: '$.grandparentProperty'
        },
        {
          column: 'name',
          path: '$.value[1]'
        },
        {
          column: 'datetime',
          path: '$.value[0]'
        }
      ]
    },
    {
      fileId: 'media',
      path: '$.photos[*]',
      table: 'InstagramPhoto',
      getters: [
        {
          column: 'caption',
          path: '$.caption'
        },
        {
          column: 'datetime',
          path: "$.['taken_at']"
        },
        {
          column: 'location',
          path: "$.['location']"
        },
        {
          column: 'path',
          path: "$.['path']"
        }
      ]
    },
    {
      fileId: 'messages',
      path: '$[*].conversation[*]',
      table: 'InstagramMessage',
      getters: [
        {
          column: 'sender',
          path: '$.sender'
        },
        {
          column: 'datetime',
          path: "$.['created_at']"
        },
        {
          column: 'text',
          path: '$.text'
        }
      ]
    },
    {
      fileId: 'saved',
      path: '$.saved_collections[*].media[*]',
      table: 'InstagramSavedCollection',
      options: {
        resultType: JSONPathResultType.all,
        callback: output => {
          const o = output as JSONPathReturnObject
          o['namePath'] = o.path.split("['media']")[0] + "['name']"
        }
      },
      getters: [
        {
          column: 'collectionName',
          pathKey: 'namePath',
          queryRoot: true
        },
        {
          column: 'mediaUserName',
          path: '$.value[1]'
        },
        {
          column: 'mediaDateTime',
          path: '$.value[0]'
        }
      ]
    },
    {
      fileId: 'searches',
      path: '$.[*]',
      table: 'InstagramSearch',
      getters: [
        {
          column: 'searchClick',
          path: "$.['search_click']"
        },
        {
          column: 'time',
          path: '$.time'
        },
        {
          column: 'type',
          path: '$.type'
        }
      ]
    }
  ]
}

export default config
