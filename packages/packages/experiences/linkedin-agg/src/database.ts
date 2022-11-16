import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'AdTargeting',
      columns: [
        ['memberAge', TEXT],
        ['companyNames', TEXT],
        ['companyFollowerOf', TEXT],
        ['companyCategory', TEXT],
        ['companySize', TEXT],
        ['degrees', TEXT],
        ['degreeClass', TEXT],
        ['memberSchools', TEXT],
        ['companyGrowthRate', TEXT],
        ['fieldsOfStudy', TEXT],
        ['companyConnections', TEXT],
        ['functionBySize', TEXT],
        ['jobFunctions', TEXT],
        ['memberGender', TEXT],
        ['graduationYear', TEXT],
        ['memberGroups', TEXT],
        ['companyIndustries', TEXT],
        ['memberInterests', TEXT],
        ['interfaceLocales', TEXT],
        ['interfaceLocale', TEXT],
        ['memberTraits', TEXT],
        ['profileLocations', TEXT],
        ['companyRevenue', TEXT],
        ['jobSeniorities', TEXT],
        ['memberSkills', TEXT],
        ['jobTitles', TEXT],
        ['yearsOfExperience', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'Inference',
      columns: [
        ['category', TEXT],
        ['typeOfInference', TEXT],
        ['description', TEXT],
        ['inference', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'Connection',
      columns: [
        ['firstName', TEXT],
        ['lastName', TEXT],
        ['emailAddress', TEXT],
        ['company', TEXT],
        ['position', TEXT],
        ['connectedOn', TEXT],
        ['filePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'ad-targeting',
      path: '$.result.items[*]',
      table: 'AdTargeting',
      getters: [
        {
          column: 'memberAge',
          path: '$.memberAge'
        },
        {
          column: 'companyNames',
          path: '$.companyNames'
        },
        {
          column: 'companyFollowerOf',
          path: '$.companyFollowerOf'
        },
        {
          column: 'companyCategory',
          path: '$.companyCategory'
        },
        {
          column: 'companySize',
          path: '$.companySize'
        },
        {
          column: 'degrees',
          path: '$.degrees'
        },
        {
          column: 'degreeClass',
          path: '$.degreeClass'
        },
        {
          column: 'memberSchools',
          path: '$.memberSchools'
        },
        {
          column: 'companyGrowthRate',
          path: '$.companyGrowthRate'
        },
        {
          column: 'fieldsOfStudy',
          path: '$.fieldsOfStudy'
        },
        {
          column: 'companyConnections',
          path: '$.companyConnections'
        },
        {
          column: 'functionBySize',
          path: '$.functionBySize'
        },
        {
          column: 'jobFunctions',
          path: '$.jobFunctions'
        },
        {
          column: 'memberGender',
          path: '$.memberGender'
        },
        {
          column: 'graduationYear',
          path: '$.graduationYear'
        },
        {
          column: 'memberGroups',
          path: '$.memberGroups'
        },
        {
          column: 'companyIndustries',
          path: '$.companyIndustries'
        },
        {
          column: 'memberInterests',
          path: '$.memberInterests'
        },
        {
          column: 'interfaceLocales',
          path: '$.interfaceLocales'
        },
        {
          column: 'interfaceLocale',
          path: '$.interfaceLocale'
        },
        {
          column: 'memberTraits',
          path: '$.memberTraits'
        },
        {
          column: 'profileLocations',
          path: '$.profileLocations'
        },
        {
          column: 'companyRevenue',
          path: '$.companyRevenue'
        },
        {
          column: 'jobSeniorities',
          path: '$.jobSeniorities'
        },
        {
          column: 'memberSkills',
          path: '$.memberSkills'
        },
        {
          column: 'jobTitles',
          path: '$.jobTitles'
        },
        {
          column: 'yearsOfExperience',
          path: '$.yearsOfExperience'
        }
      ]
    },
    {
      fileId: 'inference',
      path: '$.result.items[*]',
      table: 'Inference',
      getters: [
        {
          column: 'category',
          path: '$.category'
        },
        {
          column: 'typeOfInference',
          path: '$.typeOfInference'
        },
        {
          column: 'description',
          path: '$.description'
        },
        {
          column: 'inference',
          path: '$.inference'
        }
      ]
    },
    {
      fileId: 'connection',
      path: '$.result.items[*]',
      table: 'Connection',
      getters: [
        {
          column: 'firstName',
          path: '$.firstName'
        },
        {
          column: 'lastName',
          path: '$.lastName'
        },
        {
          column: 'emailAddress',
          path: '$.emailAddress'
        },
        {
          column: 'company',
          path: '$.company'
        },
        {
          column: 'position',
          path: '$.position'
        },
        {
          column: 'connectedOn',
          path: '$.connectedOn'
        }
      ]
    }
  ]
}

export default config
