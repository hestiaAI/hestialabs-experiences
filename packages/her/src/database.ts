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
          path: '$.Name'
        },
        {
          column: 'likedAt',
          path: "$.['Liked at']"
        },
        {
          column: 'matched',
          path: '$.Matched'
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
          path: '$.Sender'
        },
        {
          column: 'notificationType',
          path: "$.['Notification type']"
        },
        {
          column: 'notificationSentAt',
          path: "$.['Notifcation sent at']"
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
          path: '$.Name'
        },
        {
          column: 'blockedAt',
          path: "$.['Blocked at']"
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
          path: '$.Conversation'
        },
        {
          column: 'message',
          path: '$.Message'
        },
        {
          column: 'messageType',
          path: "$.['Message type']"
        },
        {
          column: 'sender',
          path: '$.Sender'
        },
        {
          column: 'messageSentAt',
          path: "$.['Message Sent At']"
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
          path: "$.['Reported type']"
        },
        {
          column: 'reason',
          path: '$.Reason'
        },
        {
          column: 'reportedAt',
          path: "$.['Reported at']"
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
          path: '$.Name'
        },
        {
          column: 'skippedAt',
          path: "$.['Skipped at']"
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
          path: '$.Name'
        },
        {
          column: 'fullName',
          path: "$.['Full name']"
        },
        {
          column: 'birthday',
          path: '$.Birthday'
        },
        {
          column: 'lastOnlineUtc',
          path: "$.['Last online UTC']"
        },
        {
          column: 'registrationDateUtc',
          path: "$.['Registration_date UTC']"
        },
        {
          column: 'email',
          path: '$.Email'
        },
        {
          column: 'pushNotificationsEnabled',
          path: "$.['Push notifications enabled']"
        },
        {
          column: 'lastUsedFilters',
          path: "$.['Last used filters']"
        },
        {
          column: 'heightInCm',
          path: "$.['Height in cm']"
        },
        {
          column: 'location',
          path: '$.Location'
        },
        {
          column: 'customLocation',
          path: "$.['Custom Location']"
        },
        {
          column: 'status',
          path: '$.Status'
        }
      ]
    }
  ]
}

export default config
