import type { DatabaseConfig } from '@/types'
import { SQLType } from '@/types/database-config'

const { TEXT, INTEGER, FLOAT } = SQLType

const config: DatabaseConfig = {
  tables: [
    {
      name: 'ActivitySegment',
      columns: [
        ['startLatitude', INTEGER],
        ['startLongitude', INTEGER],
        ['startAddress', TEXT],
        ['startName', TEXT],
        ['startTimestamp', TEXT],
        ['endLatitude', INTEGER],
        ['endLongitude', INTEGER],
        ['endAddress', TEXT],
        ['endName', TEXT],
        ['endTimestamp', TEXT],
        ['confidence', TEXT],
        ['transitPath', TEXT],
        ['distanceMeters', FLOAT],
        ['activityType', TEXT]
      ]
    },
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
        ['semanticType', TEXT]
      ]
    },
    {
      name: 'Winners',
      columns: [
        ['id', INTEGER],
        ['winnerLatitude', INTEGER],
        ['winnerLongitude', INTEGER],
        ['winnerAddress', TEXT],
        ['winnerName', TEXT],
        ['winnerConfidence', FLOAT],
        ['winnerSemanticType', TEXT],
        ['startTimestamp', TEXT],
        ['endTimestamp', TEXT]
      ],
      primaryKey: 'id'
    },
    {
      name: 'Losers',
      columns: [
        ['loserId', INTEGER],
        ['loserLatitude', INTEGER],
        ['loserLongitude', INTEGER],
        ['loserAddress', TEXT],
        ['loserName', TEXT],
        ['loserConfidence', FLOAT],
        ['loserSemanticType', TEXT]
      ],
      foreignKeys: [
        {
          columns: 'loserId',
          reference: {
            table: 'Winners',
            columns: 'id'
          }
        }
      ]
    },
    {
      name: 'Records',
      columns: [
        ['latitude', INTEGER],
        ['longitude', INTEGER],
        ['timestamp', TEXT],
        ['accuracy', INTEGER],
        ['activityType', TEXT],
        ['activityConfidence', INTEGER],
        ['source', TEXT]
      ]
    },
    {
      name: 'WifiScan',
      columns: [
        ['id', INTEGER],
        ['latitude', INTEGER],
        ['longitude', INTEGER],
        ['timestamp', TEXT]
      ],
      primaryKey: 'id'
    },
    {
      name: 'MacAdresses',
      columns: [
        ['macId', INTEGER],
        ['mac', INTEGER]
      ],
      foreignKeys: [
        {
          columns: 'macId',
          reference: {
            table: 'WifiScan',
            columns: 'id'
          }
        }
      ]
    }
  ],
  getters: [
    {
      fileId: 'LOCATION_HISTORY',
      path: '$.timelineObjects[*].activitySegment',
      table: 'ActivitySegment',
      getters: [
        {
          column: 'startLatitude',
          path: '$.startLocation.latitudeE7'
        },
        {
          column: 'startLongitude',
          path: '$.startLocation.longitudeE7'
        },
        {
          column: 'startAddress',
          path: '$.startLocation.address'
        },
        {
          column: 'startName',
          path: '$.startLocation.name'
        },
        {
          column: 'startTimestamp',
          path: '$.duration.startTimestamp'
        },
        {
          column: 'endLatitude',
          path: '$.endLocation.latitudeE7'
        },
        {
          column: 'endLongitude',
          path: '$.endLocation.longitudeE7'
        },
        {
          column: 'endAddress',
          path: '$.endLocation.address'
        },
        {
          column: 'endName',
          path: '$.endLocation.name'
        },
        {
          column: 'endTimestamp',
          path: '$.duration.endTimestamp'
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
          path: '$.distance'
        },
        {
          column: 'activityType',
          path: '$.activityType'
        }
      ]
    },
    {
      fileId: 'LOCATION_HISTORY',
      path: '$.timelineObjects.[*].placeVisit',
      table: 'PlaceVisit',
      getters: [
        {
          column: 'latitude',
          path: '$.location.latitudeE7'
        },
        {
          column: 'longitude',
          path: '$.location.longitudeE7'
        },
        {
          column: 'address',
          path: '$.location.address'
        },
        {
          column: 'name',
          path: '$.location.name'
        },
        {
          column: 'startTimestamp',
          path: '$.duration.startTimestamp'
        },
        {
          column: 'endTimestamp',
          path: '$.duration.endTimestamp'
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
          path: '$.visitConfidence'
        },
        {
          column: 'semanticType',
          path: '$.location.semanticType'
        }
      ]
    },
    {
      fileId: 'LOCATION_HISTORY',
      path: '$.timelineObjects.[*].placeVisit',
      table: 'Winners',
      getters: [
        {
          column: 'winnerLatitude',
          path: '$.location.latitudeE7'
        },
        {
          column: 'winnerLongitude',
          path: '$.location.longitudeE7'
        },
        {
          column: 'winnerAddress',
          path: '$.location.address'
        },
        {
          column: 'winnerName',
          path: '$.location.name'
        },
        {
          column: 'winnerConfidence',
          path: '$.location.locationConfidence'
        },
        {
          column: 'winnerSemanticType',
          path: '$.location.semanticType'
        },
        {
          column: 'startTimestamp',
          path: '$.duration.startTimestamp'
        },
        {
          column: 'endTimestamp',
          path: '$.duration.endTimestamp'
        },
        {
          path: '$.otherCandidateLocations[*]',
          table: 'Losers',
          getters: [
            {
              column: 'loserId',
              reference: {
                table: 'Winners',
                column: 'id',
                autoincrementedId: true
              }
            },
            { column: 'loserLatitude', path: '$.latitudeE7' },
            { column: 'loserLongitude', path: '$.longitudeE7' },
            { column: 'loserAddress', path: '$.addres' },
            { column: 'loserName', path: '$.name' },
            { column: 'loserConfidence', path: '$.locationConfidence' },
            { column: 'loserSemanticType', path: '$.semanticType' }
          ]
        }
      ]
    },
    {
      fileId: 'LOCATION_HISTORY',
      path: '$.locations[*]',
      table: 'Records',
      getters: [
        { column: 'latitude', path: '$.latitudeE7' },
        { column: 'longitude', path: '$.longitudeE7' },
        { column: 'timestamp', path: '$.timestamp' },
        { column: 'accuracy', path: '$.accuracy' },
        { column: 'activityType', path: '$.activity[0].activity[0].type' },
        {
          column: 'activityConfidence',
          path: '$.activity[0].activity[0].confidence'
        },
        { column: 'source', path: '$.source' }
      ]
    },
    {
      fileId: 'LOCATION_HISTORY',
      path: '$.locations[*]',
      table: 'WifiScan',
      getters: [
        {
          column: 'latitude',
          path: '$.latitudeE7'
        },
        {
          column: 'longitude',
          path: '$.longitudeE7'
        },
        {
          column: 'timestamp',
          path: '$.timestamp'
        },
        {
          path: '$.activeWifiScan.accessPoints[*]',
          table: 'MacAdresses',
          getters: [
            {
              column: 'macId',
              reference: {
                table: 'WifiScan',
                column: 'id',
                autoincrementedId: true
              }
            },
            {
              column: 'mac',
              path: '$.mac'
            }
          ]
        }
      ]
    }
  ]
}

export default config
