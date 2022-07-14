import { PostprocessorFunction } from '@/types'

function parse_date(v: Record<string, any>) {
  if ('gpsTimeMs' in v) {
    return new Date(parseInt(v.gpsTimeMs)).toISOString()
  } else if ('gpsTime' in v) {
    return new Date(parseInt(v.gpsTime) * 1000).toISOString()
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
      driverStatus: v.driverStatus,
      horizontalAccuracy: v.horizontalAccuracy,
      verticalAccuracy: v.verticalAccuracy,
      batteryLevel: v.batteryLevel,
      altitude: v.altitude,
      type: v.type
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
      driverStatus: v.driverStatus,
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
