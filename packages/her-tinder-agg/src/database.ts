import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT, INTEGER } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'HerLikeSkip',
      columns: [
        ['date', TEXT],
        ['action', TEXT],
        ['count', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'HerLikeMatch',
      columns: [
        ['name', TEXT],
        ['likedAt', TEXT],
        ['matched', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
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
        ['FilePath', TEXT, 'FILEPATH']
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
        ['superlikes', INTEGER]
      ]
    },
    {
      name: 'TinderOrientation',
      columns: [
        ['sexualOrientations', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'herLikeSkip',
      path: '$.items[*]',
      table: 'HerLikeSkip',
      getters: [
        {
          column: 'name',
          path: '$.dateValue'
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
      path: '$.items[*]',
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
      path: '$.items[*]',
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
      path: '$.items[*]',
      table: 'TinderUsage',
      getters: [
        {
          column: 'date',
          path: '$.dateValue'
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
      path: '$.items[*].sexualOrientations[*]',
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
