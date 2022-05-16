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
        ['waypoints', TEXT],
        ['source', TEXT],
        ['distanceMeters', FLOAT],
        ['travelMode', TEXT],
        ['editConfirmationStatus', TEXT]
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
        ['placeVisitType', TEXT],
        ['placeVisitImportance', FLOAT],
        ['visitConfidence', FLOAT],
        ['locationConfidence', FLOAT],
        ['editConfirmationStatus', TEXT],
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
        ['timestamp', TEXT]
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
      path: '$.timelineObjects.[*].activitySegment',
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
          column: 'waypoints',
          path: '$.waypointPath.waypoints'
        },
        {
          column: 'source',
          path: '$.waypointPath.source'
        },
        {
          column: 'distanceMeters',
          path: '$.waypointPath.distanceMeters'
        },
        {
          column: 'travelMode',
          path: '$.waypointPath.travelMode'
        },
        {
          column: 'editConfirmationStatus',
          path: '$.editConfirmationStatus'
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
          column: 'placeVisitType',
          path: '$.placeVisitType'
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
          column: 'editConfirmationStatus',
          path: '$.editConfirmationStatus'
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
          column: 'timestamp',
          path: '$.duration.startTimestamp'
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
          path: '$.locationMetadata[*].wifiScan.accessPoints[*]',
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
