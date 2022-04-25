import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT, INTEGER, DATE } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TwitterAd',
      columns: [
        ['id', INTEGER],
        ['tweetId', TEXT],
        ['advertiserName', TEXT],
        ['displayLocation', TEXT],
        ['time', DATE]
      ],
      primaryKey: 'id'
    },
    {
      name: 'TwitterEngagement',
      columns: [
        ['id', INTEGER],
        ['tweetId', TEXT],
        ['advertiserName', TEXT],
        ['displayLocation', TEXT],
        ['time', DATE]
      ]
    },
    {
      name: 'TwitterCriterion',
      columns: [
        ['adId', INTEGER],
        ['targetingType', TEXT],
        ['targetingValue', TEXT]
      ],
      foreignKeys: [
        {
          columns: 'adId',
          reference: {
            table: 'TwitterAd',
            columns: 'id'
          }
        }
      ]
    }
  ],
  getters: [
    {
      fileId: 'impressions',
      path: '$.*.ad.adsUserData.adImpressions.impressions[*]',
      table: 'TwitterAd',
      getters: [
        {
          column: 'tweetId',
          path: '$.promotedTweetInfo.tweetId'
        },
        {
          column: 'advertiserName',
          path: '$.advertiserInfo.advertiserName'
        },
        {
          column: 'displayLocation',
          path: '$.displayLocation'
        },
        {
          column: 'time',
          path: '$.impressionTime'
        },
        {
          path: '$.matchedTargetingCriteria[*]',
          table: 'TwitterCriterion',
          getters: [
            {
              column: 'adId',
              reference: {
                table: 'TwitterAd',
                column: 'id',
                autoincrementedId: true
              }
            },
            {
              column: 'targetingType',
              path: '$.targetingType'
            },
            {
              column: 'targetingValue',
              path: '$.targetingValue'
            }
          ]
        }
      ]
    },
    {
      fileId: 'engagements',
      path: '$.*.ad.adsUserData.adEngagements.engagements[*].impressionAttributes',
      table: 'TwitterEngagement',
      getters: [
        {
          column: 'tweetId',
          path: '$.promotedTweetInfo.tweetId'
        },
        {
          column: 'advertiserName',
          path: '$.advertiserInfo.advertiserName'
        },
        {
          column: 'displayLocation',
          path: '$.displayLocation'
        },
        {
          column: 'time',
          path: '$.impressionTime'
        }
      ]
    }
  ]
}

export default config
