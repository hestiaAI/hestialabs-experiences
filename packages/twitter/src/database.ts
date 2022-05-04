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
    },
    {
      name: 'TwitterPersonalization',
      columns: [
        ['languages', TEXT],
        ['gender', TEXT],
        ['interests', TEXT],
        ['partnerInterests', TEXT],
        ['numAudiences', INTEGER],
        ['advertisers', TEXT],
        ['lookalikeAdvertisers', TEXT],
        ['shows', TEXT],
        ['locationHistory', TEXT],
        ['age', TEXT]
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
    },
    {
      fileId: 'personalization',
      path: '$.*.p13nData',
      table: 'TwitterPersonalization',
      getters: [
        {
          column: 'languages',
          path: '$.demographics.languages'
        },
        {
          column: 'gender',
          path: '$.demographics.genderInfo.gender'
        },
        {
          column: 'interests',
          path: '$.interests.interests'
        },
        {
          column: 'partnerInterests',
          path: '$.interests.partnerInterests'
        },
        {
          column: 'numAudiences',
          path: '$.interests.audienceAndAdvertisers.numAudiences'
        },
        {
          column: 'advertisers',
          path: '$.interests.audienceAndAdvertisers.advertisers'
        },
        {
          column: 'lookalikeAdvertisers',
          path: '$.interests.audienceAndAdvertisers.lookalikeAdvertisers'
        },
        {
          column: 'shows',
          path: '$.interests.shows'
        },
        {
          column: 'locationHistory',
          path: '$.locationHistory'
        },
        {
          column: 'age',
          path: '$.inferredAgeInfo.age'
        }
      ]
    }
  ]
}

export default config
