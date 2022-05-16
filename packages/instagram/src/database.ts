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
    },
    {
      name: 'InstagramPostViewed',
      columns: [
        ['accountName', TEXT],
        ['unixTimestamp', TEXT]
      ]
    },
    {
      name: 'InstagramVideoWatched',
      columns: [
        ['accountName', TEXT],
        ['unixTimestamp', TEXT]
      ]
    },
    {
      name: 'InstagramAdViewed',
      columns: [
        ['accountName', TEXT],
        ['unixTimestamp', TEXT]
      ]
    },
    {
      name: 'InstagramCommentLiked',
      columns: [
        ['accountName', TEXT],
        ['unixTimestamp', TEXT]
      ]
    },
    {
      name: 'InstagramPostLiked',
      columns: [
        ['accountName', TEXT],
        ['unixTimestamp', TEXT]
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
    },
    {
      fileId: 'postsViewed',
      path: '$.impressions_history_posts_seen[*].string_map_data',
      table: 'InstagramPostViewed',
      getters: [
        {
          column: 'accountName',
          path: '$.Auteur.value'
        },
        {
          column: 'unixTimestamp',
          path: '$.Heure.timestamp'
        }
      ]
    },
    {
      fileId: 'videosWatched',
      path: '$.impressions_history_videos_watched[*].string_map_data',
      table: 'InstagramVideoWatched',
      getters: [
        {
          column: 'accountName',
          path: '$.Auteur.value'
        },
        {
          column: 'unixTimestamp',
          path: '$.Heure.timestamp'
        }
      ]
    },
    {
      fileId: 'adsViewed',
      path: '$.impressions_history_ads_seen[*].string_map_data',
      table: 'InstagramAdViewed',
      getters: [
        {
          column: 'accountName',
          path: '$.Auteur.value'
        },
        {
          column: 'unixTimestamp',
          path: '$.Heure.timestamp'
        }
      ]
    },
    {
      fileId: 'likedComments',
      path: '$.likes_comment_likes[*]',
      table: 'InstagramCommentLiked',
      getters: [
        {
          column: 'accountName',
          path: '$.title'
        },
        {
          column: 'unixTimestamp',
          path: '$.string_list_data[0].timestamp'
        }
      ]
    },
    {
      fileId: 'likedPosts',
      path: '$.likes_media_likes[*]',
      table: 'InstagramPostLiked',
      getters: [
        {
          column: 'accountName',
          path: '$.title'
        },
        {
          column: 'unixTimestamp',
          path: '$.string_list_data[0].timestamp'
        }
      ]
    }
  ]
}

export default config
