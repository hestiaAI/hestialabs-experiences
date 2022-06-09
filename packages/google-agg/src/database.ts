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
    },
    {
      name: 'OtherCandidate',
      columns: [
        ['winnerLatitude', INTEGER],
        ['winnerLongitude', INTEGER],
        ['winnerAddress', TEXT],
        ['winnerName', TEXT],
        ['winnerConfidence', INTEGER],
        ['winnerSemanticType', TEXT],
        ['loserLatitude', INTEGER],
        ['loserLongitude', INTEGER],
        ['loserAddress', TEXT],
        ['loserName', TEXT],
        ['loserConfidence', INTEGER],
        ['loserSemanticType', TEXT],
        ['timestamp', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'Travels',
      columns: [
        ['startLatitude', INTEGER],
        ['startLongitude', INTEGER],
        ['startTimestamp', TEXT],
        ['endLatitude', INTEGER],
        ['endLongitude', INTEGER],
        ['endTimestamp', TEXT],
        ['confidence', TEXT],
        ['transitPath', TEXT],
        ['distanceMeters', INTEGER],
        ['activityType', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'Records',
      columns: [
        ['latitude', INTEGER],
        ['longitude', INTEGER],
        ['timestamp', TEXT],
        ['accuracy', INTEGER],
        ['source', TEXT],
        ['activityType', TEXT],
        ['FilePath', TEXT, 'FILEPATH']
      ]
    },
    {
      name: 'Wifi',
      columns: [
        ['mac', INTEGER],
        ['latitude', INTEGER],
        ['longitude', INTEGER],
        ['count', TEXT],
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
    },
    {
      fileId: 'otherCandidate',
      path: '$.result.items[*]',
      table: 'OtherCandidate',
      getters: [
        {
          column: 'winnerLatitude',
          path: '$.winnerLatitude'
        },
        {
          column: 'winnerLongitude',
          path: '$.winnerLongitude'
        },
        {
          column: 'winnerAddress',
          path: '$.winnerAddress'
        },
        {
          column: 'winnerName',
          path: '$.winnerName'
        },
        {
          column: 'winnerConfidence',
          path: '$.winnerConfidence'
        },
        {
          column: 'winnerSemanticType',
          path: '$.winnerSemanticType'
        },
        {
          column: 'loserLatitude',
          path: '$.loserLatitude'
        },
        {
          column: 'loserLongitude',
          path: '$.loserLongitude'
        },
        {
          column: 'loserAddress',
          path: '$.loserAddress'
        },
        {
          column: 'loserName',
          path: '$.loserName'
        },
        {
          column: 'loserConfidence',
          path: '$.loserConfidence'
        },
        {
          column: 'loserSemanticType',
          path: '$.loserSemanticType'
        },
        {
          column: 'timestamp',
          path: '$.timestamp'
        }
      ]
    },
    {
      fileId: 'travels',
      path: '$.result.items[*]',
      table: 'Travels',
      getters: [
        {
          column: 'startLatitude',
          path: '$.startLatitude'
        },
        {
          column: 'startLongitude',
          path: '$.startLongitude'
        },
        {
          column: 'startTimestamp',
          path: '$.startTimestamp'
        },
        {
          column: 'endLatitude',
          path: '$.endLatitude'
        },
        {
          column: 'endLongitude',
          path: '$.endLongitude'
        },
        {
          column: 'endTimestamp',
          path: '$.endTimestamp'
        },
        {
          column: 'confidence',
          path: '$.confidence'
        },
        {
          column: 'transitPath',
          path: '$.transitPath'
        },
        {
          column: 'distanceMeters',
          path: '$.distanceMeters'
        },
        {
          column: 'activityType',
          path: '$.activityType'
        }
      ]
    },
    {
      fileId: 'records',
      path: '$.result.items[*]',
      table: 'Records',
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
          column: 'timestamp',
          path: '$.timestamp'
        },
        {
          column: 'source',
          path: '$.source'
        },
        {
          column: 'activityType',
          path: '$.activityType'
        },
        {
          column: 'accuracy',
          path: '$.accuracy'
        }
      ]
    },
    {
      fileId: 'wifi',
      path: '$.result.items[*]',
      table: 'Wifi',
      getters: [
        {
          column: 'mac',
          path: '$.mac'
        },
        {
          column: 'latitude',
          path: '$.latitude'
        },
        {
          column: 'longitude',
          path: '$.longitude'
        },
        {
          column: 'count',
          path: '$.count'
        }
      ]
    }
  ]
}

export default config
