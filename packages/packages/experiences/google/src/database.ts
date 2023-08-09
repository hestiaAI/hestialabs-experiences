import type { DatabaseConfig } from '@/types'
import { SQLType, JSONPathReturnObject } from '@/types/database-config'

const { TEXT, INTEGER, FLOAT } = SQLType

function convert_mac(address: number) {
  let s = String(address.toString(16))
  while (s.length < 12) {
    s = '0' + s
  }
  return chunk(s, 2).join(':')
}
function chunk(str: string, n: number) {
  const ret = []
  let i
  let len

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n))
  }

  return ret
}

function compute_duration(d1: string, d2: string) {
  const date1 = new Date(d1).getTime()
  const date2 = new Date(d2).getTime()
  const res = Math.floor(Math.abs(date1 - date2) / 1000)
  return res
}

function parseTransitPath(
  transitPath: { name: any; transitStops: string | any[] } | null
) {
  if (transitPath !== null) {
    const name = transitPath.name
    return (
      name +
      ': ' +
      transitPath.transitStops[0].name +
      ' -> ' +
      transitPath.transitStops[transitPath.transitStops.length - 1].name
    )
  } else {
    return null
  }
}

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
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          if (
            !o['startLocation'] ||
            !o['endLocation'] ||
            !o['startLocation']['latitudeE7'] ||
            !o['startLocation']['longitudeE7'] ||
            !o['endLocation']['latitudeE7'] ||
            !o['endLocation']['longitudeE7']
          ) {
            o['startLocation'] = { latitudeE7: null, longitudeE7: null }
            o['endLocation'] = { latitudeE7: null, longitudeE7: null }
          } else {
            o['startLocation']['latitudeE7'] *= 1e-7
            o['startLocation']['longitudeE7'] *= 1e-7
            o['endLocation']['latitudeE7'] *= 1e-7
            o['endLocation']['longitudeE7'] *= 1e-7
          }
          o['startLocation']['address'] =
            o.startLocation.address === 'undefined'
              ? null
              : o.startLocation.address
          o['endLocation']['address'] =
            o.endLocation.address === 'undefined' ? null : o.endLocation.address
          o['startLocation']['name'] =
            o.startLocation.name === 'undefined' ? null : o.startLocation.name
          o['endLocation']['name'] =
            o.endLocation.name === 'undefined' ? null : o.endLocation.name
          o['transitPath'] = o.transitPath
            ? parseTransitPath(o.transitPath)
            : null
        }
      },
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
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          if (
            !o['location'] ||
            !o['location']['latitudeE7'] ||
            !o['location']['longitudeE7']
          ) {
            o['location'] = { latitudeE7: null, longitudeE7: null }
          } else {
            o['location']['latitudeE7'] *= 1e-7
            o['location']['longitudeE7'] *= 1e-7
          }
          o['location']['semanticType'] =
            o.location.semanticType === 'undefined'
              ? null
              : o.location.semanticType
          o['duration']['time'] = compute_duration(
            o.duration.startTimestamp,
            o.duration.endTimestamp
          )
        }
      },
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
          path: '$.duration.time'
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
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          if (
            !o['location'] ||
            !o['location']['latitudeE7'] ||
            !o['location']['longitudeE7']
          ) {
            o['location'] = { latitudeE7: null, longitudeE7: null }
          } else {
            o['location']['latitudeE7'] *= 1e-7
            o['location']['longitudeE7'] *= 1e-7
          }
          o['location']['semanticType'] =
            o.location.semanticType === 'undefined'
              ? null
              : o.location.semanticType
          o['location']['address'] =
            o.location.address === 'undefined' ? null : o.location.address
          o['location']['name'] =
            o.location.name === 'undefined' ? null : o.location.name
        }
      },
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
          options: {
            callback: output => {
              const o = output as JSONPathReturnObject
              if (!o['latitudeE7'] || !o['longitudeE7']) {
                o['latitudeE7'] = null
                o['longitudeE7'] = null
              } else {
                o['latitudeE7'] *= 1e-7
                o['longitudeE7'] *= 1e-7
              }
              o['semanticType'] =
                o.semanticType === 'undefined' ? null : o.semanticType
              o['address'] = o.address === 'undefined' ? null : o.address
              o['name'] = o.name === 'undefined' ? null : o.name
            }
          },
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
            { column: 'loserAddress', path: '$.address' },
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
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          if (!o['latitudeE7'] || !o['longitudeE7']) {
            o['latitudeE7'] = null
            o['longitudeE7'] = null
          } else {
            o['latitudeE7'] *= 1e-7
            o['longitudeE7'] *= 1e-7
          }
        }
      },
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
      options: {
        callback: output => {
          const o = output as JSONPathReturnObject
          if (!o['latitudeE7'] || !o['longitudeE7']) {
            o['latitudeE7'] = null
            o['longitudeE7'] = null
          } else {
            o['latitudeE7'] *= 1e-7
            o['longitudeE7'] *= 1e-7
          }
        }
      },
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
          options: {
            callback: output => {
              const o = output as JSONPathReturnObject
              o['mac'] = convert_mac(o.mac)
            }
          },
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
