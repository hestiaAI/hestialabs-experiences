import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'HerLike',
      columns: [
        ['name', TEXT],
        ['likedAt', TEXT],
        ['matched', TEXT]
      ]
    },
    {
      name: 'HerNotification',
      columns: [
        ['sender', TEXT],
        ['notificationType', TEXT],
        ['notificationSentAt', TEXT]
      ]
    },
    {
      name: 'HerBlock',
      columns: [
        ['name', TEXT],
        ['blockedAt', TEXT]
      ]
    },
    {
      name: 'HerMessage',
      columns: [
        ['conversationId', TEXT],
        ['message', TEXT],
        ['messageType', TEXT],
        ['sender', TEXT],
        ['messageSentAt', TEXT]
      ]
    },
    {
      name: 'HerReport',
      columns: [
        ['reportedType', TEXT],
        ['reason', TEXT],
        ['reportedAt', TEXT]
      ]
    },
    {
      name: 'HerSkip',
      columns: [
        ['name', TEXT],
        ['skippedAt', TEXT]
      ]
    },
    {
      name: 'HerProfile',
      columns: [
        ['name', TEXT],
        ['fullName', TEXT],
        ['birthday', TEXT],
        ['lastOnlineUtc', TEXT],
        ['registrationDateUtc', TEXT],
        ['email', TEXT],
        ['pushNotificationsEnabled', TEXT],
        ['lastUsedFilters', TEXT],
        ['heightInCm', TEXT],
        ['location', TEXT],
        ['customLocation', TEXT],
        ['status', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'liked',
      path: '$.items[*]',
      table: 'HerLike',
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
      fileId: 'notifications',
      path: '$.items[*]',
      table: 'HerNotification',
      getters: [
        {
          column: 'sender',
          path: '$.sender'
        },
        {
          column: 'notificationType',
          path: '$.notificationType'
        },
        {
          column: 'notificationSentAt',
          path: '$.notifcationSentAt'
        }
      ]
    },
    {
      fileId: 'blocked',
      path: '$.items[*]',
      table: 'HerBlock',
      getters: [
        {
          column: 'name',
          path: '$.name'
        },
        {
          column: 'blockedAt',
          path: '$.blockedAt'
        }
      ]
    },
    {
      fileId: 'messages',
      path: '$.items[*]',
      table: 'HerMessage',
      getters: [
        {
          column: 'conversationId',
          path: '$.conversation'
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
      fileId: 'reported',
      path: '$.items[*]',
      table: 'HerReport',
      getters: [
        {
          column: 'reportedType',
          path: '$.reportedType'
        },
        {
          column: 'reason',
          path: '$.reason'
        },
        {
          column: 'reportedAt',
          path: '$.reportedAt'
        }
      ]
    },
    {
      fileId: 'skipped',
      path: '$.items[*]',
      table: 'HerSkip',
      getters: [
        {
          column: 'name',
          path: '$.name'
        },
        {
          column: 'skippedAt',
          path: '$.skippedAt'
        }
      ]
    },
    {
      fileId: 'profiles',
      path: '$.items[*]',
      table: 'HerProfile',
      getters: [
        {
          column: 'name',
          path: '$.name'
        },
        {
          column: 'fullName',
          path: '$.fullName'
        },
        {
          column: 'birthday',
          path: '$.birthday'
        },
        {
          column: 'lastOnlineUtc',
          path: '$.lastOnlineUtc'
        },
        {
          column: 'registrationDateUtc',
          path: '$.registrationDateUtc'
        },
        {
          column: 'email',
          path: '$.email'
        },
        {
          column: 'pushNotificationsEnabled',
          path: '$.pushNotificationsEnabled'
        },
        {
          column: 'lastUsedFilters',
          path: '$.lastUsedFilters'
        },
        {
          column: 'heightInCm',
          path: '$.heightInCm'
        },
        {
          column: 'location',
          path: '$.location'
        },
        {
          column: 'customLocation',
          path: '$.customLocation'
        },
        {
          column: 'status',
          path: '$.status'
        }
      ]
    }
  ]
}

export default config
