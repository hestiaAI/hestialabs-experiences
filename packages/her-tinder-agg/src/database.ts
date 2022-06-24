import type { DatabaseConfig } from '@/types'
import { SQLType, JSONPathReturnObject } from '@/types/database-config'

const { TEXT, INTEGER } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'HerLikeSkip',
      columns: [
        ['date', TEXT],
        ['action', TEXT],
        ['count', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'HerLikeMatch',
      columns: [
        ['name', TEXT],
        ['likedAt', TEXT],
        ['matched', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'HerMessage',
      columns: [
        ['conversationId', TEXT],
        ['message', TEXT],
        ['messageType', TEXT],
        ['sender', TEXT],
        ['messageSentAt', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'TinderUsage',
      columns: [
        ['date', TEXT],
        ['likes', INTEGER],
        ['passes', INTEGER],
        ['messagesSent', INTEGER],
        ['messagesReceived', INTEGER],
        ['matches', INTEGER],
        ['opens', INTEGER],
        ['superlikes', INTEGER],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'TinderOrientation',
      columns: [
        ['sexualOrientations', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'herLikeSkip',
      path: '$.result.items[*]',
      table: 'HerLikeSkip',
      getters: [
        {
          column: 'date',
          path: '$.date'
        },
        {
          column: 'action',
          path: '$.actionValue'
        },
        {
          column: 'count',
          path: '$.actionCount'
        }
      ]
    },
    {
      fileId: 'herLikeMatch',
      path: '$.result.items[*]',
      table: 'HerLikeMatch',
      getters: [
        {
          column: 'name',
          path: '$.name'
        },
        {
          column: 'likedAt',
          path: '$.likedAt'
        },
        {
          column: 'matched',
          path: '$.matched'
        }
      ]
    },
    {
      fileId: 'herMessage',
      path: '$.result.items[*]',
      table: 'HerMessage',
      getters: [
        {
          column: 'conversationId',
          path: '$.conversationId'
        },
        {
          column: 'message',
          path: '$.message'
        },
        {
          column: 'messageType',
          path: '$.messageType'
        },
        {
          column: 'sender',
          path: '$.sender'
        },
        {
          column: 'messageSentAt',
          path: '$.messageSentAt'
        }
      ]
    },
    {
      fileId: 'tinderUsage',
      path: '$.result.items[*]',
      table: 'TinderUsage',
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          const path = ['date', 'dateValue'].find(p => p in o)
          o['foundDate'] = path ? o[path] : 'null'
        }
      },
      getters: [
        {
          column: 'date',
          path: 'foundDate'
        },
        {
          column: 'likes',
          path: '$.likes'
        },
        {
          column: 'passes',
          path: '$.passes'
        },
        {
          column: 'superlikes',
          path: '$.number_of_superlikes'
        },
        {
          column: 'messagesSent',
          path: '$.number_of_messages_sent'
        },
        {
          column: 'messagesReceived',
          path: '$.number_of_messages_received'
        },
        {
          column: 'matches',
          path: '$.number_of_matches'
        },
        {
          column: 'opens',
          path: '$.opens'
        }
      ]
    },
    {
      fileId: 'tinderUser',
      path: '$.result.items[*]',
      table: 'TinderOrientation',
      getters: [
        {
          column: 'sexualOrientations',
          path: '$.sexualOrientations'
        }
      ]
    }
  ]
}

export default config
