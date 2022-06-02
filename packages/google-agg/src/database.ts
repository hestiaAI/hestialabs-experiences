import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT, INTEGER, FLOAT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'PlaceVisit',
      columns: [
        ['latitude', INTEGER],
        ['longitude', INTEGER],
        ['address', TEXT],
        ['name', TEXT],
        ['startTimestamp', TEXT],
        ['endTimestamp', TEXT],
        ['placeVisitImportance', FLOAT],
        ['visitConfidence', FLOAT],
        ['locationConfidence', FLOAT],
        ['duration', FLOAT],
        ['semanticType', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    }
  ],
  getters: [
    {
      fileId: 'placeVisited',
      path: '$.result.items[*]',
      table: 'PlaceVisit',
      getters: [
        {
          column: 'latitude',
          path: '$.latitude'
        },
        {
          column: 'longitude',
          path: '$.longitude'
        },
        {
          column: 'address',
          path: '$.address'
        },
        {
          column: 'name',
          path: '$.name'
        },
        {
          column: 'startTimestamp',
          path: '$.startTimestamp'
        },
        {
          column: 'endTimestamp',
          path: '$.endTimestamp'
        },
        {
          column: 'placeVisitImportance',
          path: '$.placeVisitImportance'
        },
        {
          column: 'visitConfidence',
          path: '$.visitConfidence'
        },
        {
          column: 'locationConfidence',
          path: '$.locationConfidence'
        },
        {
          column: 'duration',
          path: '$.duration'
        },
        {
          column: 'semanticType',
          path: '$.semanticType'
        }
      ]
    }
  ]
}

export default config
