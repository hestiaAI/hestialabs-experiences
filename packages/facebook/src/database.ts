import type { JSONPathReturnObject } from 'types/utils'
import type { DatabaseConfig } from '@/types'
import { SQLType, JSONPathResultType } from '@/types/database-config'

const { TEXT, INTEGER } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'AdvertiserInteraction',
      columns: [
        ['title', TEXT],
        ['action', TEXT],
        ['timestamp', INTEGER]
      ]
    },
    {
      name: 'AdvertiserUploadedContactInformation',
      columns: [['name', TEXT]]
    },
    {
      name: 'OffFacebookActivityEvent',
      columns: [
        ['name', TEXT],
        ['type', TEXT],
        ['timestamp', INTEGER]
      ]
    },
    {
      name: 'AdsInterest',
      columns: [['name', TEXT]]
    },
    {
      name: 'CustomAudience',
      columns: [
        ['advertiserName', TEXT],
        ['hasDataFileCustomAudience', TEXT],
        ['hasRemarketingCustomAudience', TEXT],
        ['hasInPersonStoreVisit', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'advertisers-interacted',
      path: '$.history_v2[*]',
      table: 'AdvertiserInteraction',
      getters: [
        {
          column: 'title',
          path: '$.title'
        },
        {
          column: 'action',
          path: '$.action'
        },
        {
          column: 'timestamp',
          path: '$.timestamp'
        }
      ]
    },
    {
      fileId: 'advertisers-contact-list',
      path: '$.custom_audiences_v2[*]',
      table: 'AdvertiserUploadedContactInformation',
      getters: [
        {
          column: 'name',
          path: '$'
        }
      ]
    },
    {
      fileId: 'off-facebook-activity',
      path: '$.off_facebook_activity_v2[*].events[*]',
      table: 'OffFacebookActivityEvent',
      options: {
        resultType: JSONPathResultType.all,
        callback: (output: JSONPathReturnObject) =>
          (output['namePath'] = output.path.split("['events']")[0] + "['name']")
      },
      getters: [
        {
          column: 'name',
          pathKey: 'namePath',
          queryRoot: true
        },
        {
          column: 'type',
          path: '$.value.type'
        },
        {
          column: 'timestamp',
          path: '$.value.timestamp'
        }
      ]
    },
    {
      fileId: 'ads-interests',
      path: '$.topics_v2[*]',
      table: 'AdsInterest',
      getters: [
        {
          column: 'name',
          path: '$'
        }
      ]
    },
    {
      fileId: 'advertisers-using-information',
      table: 'CustomAudience',
      path: '$.custom_audiences_all_types_v2[*]',
      options: {
        callback: (output: object) => {
          for (const key in output) {
            if (typeof output[key] === 'boolean') {
              output[key] = output[key] ? 'Yes' : 'No'
            }
          }
        }
      },
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
    }
  ]
}

export default config
