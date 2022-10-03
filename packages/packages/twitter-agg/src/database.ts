import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT, INTEGER, DATE } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TwitterAd',
      columns: [
        ['tweetId', TEXT],
        ['companyName', TEXT],
        ['impressionDate', DATE],
        ['url', TEXT],
        ['engagedWith', TEXT],
        ['criteriaCount', INTEGER],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'TwitterAdLastMonth',
      columns: [
        ['tweetId', TEXT],
        ['companyName', TEXT],
        ['impressionDate', DATE],
        ['url', TEXT],
        ['engagedWith', TEXT],
        ['criteriaCount', INTEGER],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'TwitterTargeting',
      columns: [
        ['advertiserName', TEXT],
        ['targetingType', TEXT],
        ['targetingValue', DATE],
        ['criteriaCount', TEXT],
        ['filePath', TEXT, 'FILEPATH']
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
        ['age', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'ads',
      path: '$.result.items[*]',
      table: 'TwitterAd',
      getters: [
        {
          column: 'tweetId',
          path: '$.tweetId'
        },
        {
          column: 'companyName',
          path: '$.companyName'
        },
        {
          column: 'impressionDate',
          path: '$.date_'
        },
        {
          column: 'url',
          path: '$.url'
        },
        {
          column: 'engagedWith',
          path: '$.engagedWith'
        },
        {
          column: 'criteriaCount',
          path: '$.count'
        }
      ]
    },
    {
      fileId: 'adsLastMonth',
      path: '$.result.items[*]',
      table: 'TwitterAdLastMonth',
      getters: [
        {
          column: 'tweetId',
          path: '$.tweetId'
        },
        {
          column: 'companyName',
          path: '$.companyName'
        },
        {
          column: 'impressionDate',
          path: '$.date_'
        },
        {
          column: 'url',
          path: '$.url'
        },
        {
          column: 'engagedWith',
          path: '$.engagedWith'
        },
        {
          column: 'criteriaCount',
          path: '$.count'
        }
      ]
    },
    {
      fileId: 'targeting',
      path: '$.result.items[*]',
      table: 'TwitterTargeting',
      getters: [
        {
          column: 'advertiserName',
          path: '$.advertiserName'
        },
        {
          column: 'targetingType',
          path: '$.targetingType'
        },
        {
          column: 'targetingValue',
          path: '$.targetingValue'
        },
        {
          column: 'criteriaCount',
          path: '$.count_'
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
