import type { DatabaseConfig } from '@/types'
import {
  SQLType,
  JSONPathResultType,
  JSONPathReturnObject
} from '@/types/database-config'

const { TEXT, INTEGER } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'TinderUsage',
      columns: [
        ['actionType', TEXT],
        ['dateValue', TEXT],
        ['amount', INTEGER]
      ]
    },
    {
      name: 'TinderUser',
      columns: [
        ['ageFilterMax', INTEGER],
        ['ageFilterMin', INTEGER],
        ['birthDate', TEXT],
        ['createDate', TEXT],
        ['gender', TEXT],
        ['genderFilter', TEXT],
        ['interestedIn', TEXT],
        ['education', TEXT],
        ['college', TEXT],
        ['sexualOrientations', TEXT],
        ['descriptors', TEXT]
      ]
    },
    {
      name: 'TinderMessage',
      columns: [
        ['sender', TEXT],
        ['receiver', TEXT],
        ['message', TEXT],
        ['sentDate', TEXT]
      ]
    }
  ],
  getters: [
    {
      fileId: 'tinder',
      path: '$.Usage.[*]@number()',
      table: 'TinderUsage',
      options: {
        resultType: JSONPathResultType.all,
        callback: output => {
          const o = output as JSONPathReturnObject
          o['grandparentProperty'] = o.pointer.split('/')[2]
        }
      },
      getters: [
        {
          column: 'actionType',
          path: '$.grandparentProperty'
        },
        {
          column: 'dateValue',
          path: '$.parentProperty'
        },
        {
          column: 'amount',
          path: '$.value'
        }
      ]
    },
    {
      fileId: 'tinder',
      path: '$.User',
      table: 'TinderUser',
      getters: [
        {
          column: 'ageFilterMax',
          path: '$.age_filter_max'
        },
        {
          column: 'ageFilterMin',
          path: '$.age_filter_min'
        },
        {
          column: 'birthDate',
          path: '$.birth_date'
        },
        {
          column: 'createDate',
          path: '$.create_date'
        },
        {
          column: 'descriptors',
          path: '$.descriptors'
        },
        {
          column: 'gender',
          path: '$.gender'
        },
        {
          column: 'genderFilter',
          path: '$.gender_filter'
        },
        {
          column: 'interestedIn',
          path: '$.interested_in'
        },
        {
          column: 'education',
          path: '$.education'
        },
        {
          column: 'college',
          path: '$.college'
        },
        {
          column: 'sexualOrientations',
          path: '$.sexual_orientations'
        }
      ]
    },
    {
      fileId: 'tinder',
      path: '$.Messages[*].messages[*]',
      table: 'TinderMessage',
      getters: [
        {
          column: 'sender',
          path: '$.from'
        },
        {
          column: 'receiver',
          path: '$.to'
        },
        {
          column: 'sentDate',
          path: '$.sent_date'
        },
        {
          column: 'message',
          path: '$.message'
        }
      ]
    }
  ]
}

export default config
