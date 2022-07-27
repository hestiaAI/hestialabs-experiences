import { PostprocessorFunction } from '@/types'

function parse_date(v: Record<string, any>) {
  if ('gpsTimeMs' in v) {
    return new Date(parseInt(v.gpsTimeMs)).toISOString()
  } else if ('time' in v) {
    return v.time
  } else if ('occurredAt' in v) {
    return new Date(parseInt(v.occurredAt)).toISOString()
  } else {
    return null
  }
}

export const driverPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      latitude: v.lat,
      longitude: v.lng,
      date: parse_date(v),
      speed: v.speed,
      driverStatus: 'driverStatus' in v ? v.driverStatus : 'null',
      horizontalAccuracy: v.horizontalAccuracy,
      verticalAccuracy: v.verticalAccuracy,
      batteryLevel: v.batteryLevel,
      altitude: 'altitude' in v ? v.altitude : null,
      type: 'type' in v ? v.type : null
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}

export const riderPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(v => {
    return {
      latitude: v.lat,
      longitude: v.lng,
      date: parse_date(v),
      speed: v.speed,
      driverStatus: 'driverStatus' in v ? v.driverStatus : 'null',
      riderStatus: v.riderStatus,
      horizontalAccuracy: v.horizontalAccuracy,
      verticalAccuracy: v.verticalAccuracy,
      batteryLevel: v.batteryLevel,
      altitude: v.altitude,
      type: v.type
    }
  })
  return { headers: Object.keys(results[0]), items: results }
}
