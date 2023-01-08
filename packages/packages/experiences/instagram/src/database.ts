import type { DatabaseConfig } from '@/types'
import { SQLType, JSONPathRecord } from '@/types/database-config'
import { toDateString, SUPPORTED_LOCALE } from '@/utils'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'InstagramMessage',
      columns: [
        ['senderName', TEXT],
        ['timestampMs', TEXT],
        ['messageContent', TEXT]
      ]
    },
    {
      name: 'InstagramFollower',
      columns: [
        ['accountName', TEXT],
        ['timestampMs', TEXT],
        ['accountUrl', TEXT]
      ]
    },
    {
      name: 'InstagramFollowing',
      columns: [
        ['accountName', TEXT],
        ['timestampMs', TEXT],
        ['accountUrl', TEXT]
      ]
    },
    {
      name: 'InstagramPostViewed',
      columns: [
        ['accountName', TEXT],
        ['datetime', TEXT]
      ]
    },
    {
      name: 'InstagramVideoWatched',
      columns: [
        ['accountName', TEXT],
        ['datetime', TEXT]
      ]
    },
    {
      name: 'InstagramAdViewed',
      columns: [
        ['accountName', TEXT],
        ['datetime', TEXT]
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
        ['datetime', TEXT]
      ]
    },
    {
      name: 'InstagramAdvertiser',
      columns: [
        ['advertiserName', TEXT],
        ['hasDataFileCustomAudience', TEXT],
        ['hasRemarketingCustomAudience', TEXT],
        ['hasInPersonStoreVisit', TEXT]
      ]
    },
    {
      name: 'InstagramPost',
      columns: [
        ['title', TEXT],
        ['unixTimestamp', TEXT],
        ['latitude', TEXT],
        ['longitude', TEXT]
      ]
    },
    {
      name: 'InstagramStory',
      columns: [
        ['title', TEXT],
        ['unixTimestamp', TEXT],
        ['latitude', TEXT],
        ['longitude', TEXT]
      ]
    },
    {
      name: 'InstagramAdClicked',
      columns: [
        ['title', TEXT],
        ['unixTimestamp', TEXT]
      ]
    },
    {
      name: 'InstagramAdInterest',
      columns: [['title', TEXT]]
    },
    {
      name: 'InstagramYourTopic',
      columns: [['title', TEXT]]
    },
    {
      name: 'InstagramReelTopic',
      columns: [['title', TEXT]]
    },
    {
      name: 'InstagramReelSentiment',
      columns: [['title', TEXT]]
    },
    {
      name: 'InstagramInfo',
      columns: [['name', TEXT]]
    }
  ],
  getters: [
    {
      fileId: 'adsInterests',
      path: '$.inferred_data_ig_interest[*]..value',
      table: 'InstagramAdInterest',
      getters: [
        {
          column: 'title',
          path: '$'
        }
      ]
    },
    {
      fileId: 'yourTopics',
      path: '$.topics_your_topics[*]..value',
      table: 'InstagramYourTopic',
      getters: [
        {
          column: 'title',
          path: '$'
        }
      ]
    },
    {
      fileId: 'yourReelsTopics',
      path: '$.topics_your_reels_topics[*]..value',
      table: 'InstagramReelTopic',
      getters: [
        {
          column: 'title',
          path: '$'
        }
      ]
    },
    {
      fileId: 'yourReelsSentiments',
      path: '$.topics_your_reels_emotions[*]..value',
      table: 'InstagramReelSentiment',
      getters: [
        {
          column: 'title',
          path: '$'
        }
      ]
    },
    {
      fileId: 'personalInfos',
      path: '$.profile_user[*].string_map_data',
      table: 'InstagramInfo',
      options: {
        callback: output => {
          const o = output as JSONPathRecord
          // Get 4th value == Name, language dependent
          o['name'] = Object.values(o)[3].value
        }
      },
      getters: [
        {
          column: 'name',
          path: 'name'
        }
      ]
    },
    {
      fileId: 'adsClicked',
      path: '$.impressions_history_ads_clicked[*]',
      table: 'InstagramAdClicked',
      getters: [
        {
          column: 'title',
          path: '$.title'
        },
        {
          column: 'unixTimestamp',
          path: '$.string_list_data[0].timestamp'
        }
      ]
    },
    {
      fileId: 'advertisers',
      path: '$.ig_custom_audiences_all_types.[*]',
      table: 'InstagramAdvertiser',
      getters: [
        {
          column: 'advertiserName',
          path: '$.advertiser_name'
        },
        {
          column: 'hasDataFileCustomAudience',
          path: '$.has_data_file_custom_audience'
        },
        {
          column: 'hasRemarketingCustomAudience',
          path: '$.has_remarketing_custom_audience'
        },
        {
          column: 'hasInPersonStoreVisit',
          path: '$.has_in_person_store_visit'
        }
      ]
    },
    {
      fileId: 'posts',
      path: '$.[*].media[*]',
      table: 'InstagramPost',
      getters: [
        {
          column: 'title',
          path: '$.title'
        },
        {
          column: 'unixTimestamp',
          path: '$.creation_timestamp'
        },
        {
          column: 'longitude',
          path: '$.media_metadata.photo_metadata.exif_data[0].longitude'
        },
        {
          column: 'latitude',
          path: '$.media_metadata.photo_metadata.exif_data[0].latitude'
        }
      ]
    },
    {
      fileId: 'stories',
      path: '$.ig_stories[*]',
      table: 'InstagramStory',
      getters: [
        {
          column: 'title',
          path: '$.title'
        },
        {
          column: 'unixTimestamp',
          path: '$.creation_timestamp'
        },
        {
          column: 'longitude',
          path: '$.media_metadata.video_metadata.exif_data[0].longitude'
        },
        {
          column: 'latitude',
          path: '$.media_metadata.video_metadata.exif_data[0].latitude'
        }
      ]
    },
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
          column: 'timestampMs',
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
          column: 'timestampMs',
          path: '$.timestamp'
        },
        {
          column: 'accountUrl',
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
          column: 'timestampMs',
          path: '$.timestamp'
        },
        {
          column: 'accountUrl',
          path: '$.href'
        }
      ]
    },
    {
      fileId: 'postsViewed',
      path: '$.impressions_history_posts_seen[*].string_map_data',
      table: 'InstagramPostViewed',
      options: {
        callback: output => {
          const o = output as JSONPathRecord
          o['date'] =
            toDateString(
              o.Time.value,
              '%b %d, %Y, %H:%M %p',
              SUPPORTED_LOCALE.EN
            ) ||
            toDateString(o.Time.value, '%d %b %Y à %H:%M', SUPPORTED_LOCALE.FR)
        }
      },
      getters: [
        {
          column: 'accountName',
          path: '$.Author.value'
        },
        {
          column: 'datetime',
          path: 'date'
        }
      ]
    },
    {
      fileId: 'videosWatched',
      path: '$.impressions_history_videos_watched[*].string_map_data',
      table: 'InstagramVideoWatched',
      options: {
        callback: output => {
          const o = output as JSONPathRecord
          o['date'] =
            toDateString(
              o.Time.value,
              '%b %d, %Y, %H:%M %p',
              SUPPORTED_LOCALE.EN
            ) ||
            toDateString(o.Time.value, '%d %b %Y à %H:%M', SUPPORTED_LOCALE.FR)
        }
      },
      getters: [
        {
          column: 'accountName',
          path: '$.Author.value'
        },
        {
          column: 'datetime',
          path: 'date'
        }
      ]
    },
    {
      fileId: 'adsViewed',
      path: '$.impressions_history_ads_seen[*].string_map_data',
      table: 'InstagramAdViewed',
      options: {
        callback: output => {
          const o = output as JSONPathRecord
          o['date'] =
            toDateString(
              o.Time.value,
              '%b %d, %Y, %H:%M %p',
              SUPPORTED_LOCALE.EN
            ) ||
            toDateString(o.Time.value, '%d %b %Y à %H:%M', SUPPORTED_LOCALE.FR)
        }
      },
      getters: [
        {
          column: 'accountName',
          path: '$.Author.value'
        },
        {
          column: 'datetime',
          path: 'date'
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
      options: {
        callback: output => {
          const o = output as JSONPathRecord
          const dateString = o['string_list_data'][1].value
          o['date'] =
            toDateString(
              dateString,
              '%b %d, %Y, %H:%M %p',
              SUPPORTED_LOCALE.EN
            ) ||
            toDateString(dateString, '%d %b %Y à %H:%M', SUPPORTED_LOCALE.FR)
        }
      },
      getters: [
        {
          column: 'accountName',
          path: '$.title'
        },
        {
          column: 'datetime',
          path: 'date'
        }
      ]
    }
  ]
}

export default config
