import { PostprocessorFunction } from '@/types'

export const driverHeatMapPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items
    .filter(d => d.earnerState == 'ontrip')
    .map(d => {
      return {
        beginTimestampUtc: d.beginTimestampUtc,
        endTimestampUtc: d.endTimestampUtc,
        durationMs: d.durationMs,
        beginLat: d.beginLat,
        beginLng: d.beginLng,
        endLat: d.endLat,
        endLng: d.endLng
      }
    })

  if (results.length === 0) {
    return { headers: [], items: [] }
  } else {
    return { headers: Object.keys(results[0]), items: results }
  }
}

export const driverTripsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(d => {
    return {
      status: d.status,
      begin_date: d.begintripTimestampUtc || d.requestTimestampUtc,
      end_date: d.dropoffTimestampUtc,
      distance: (d.tripDistanceMiles * 1.609344).toFixed(3),
      duration: d.tripDurationSeconds,
      originalFareLocal: d.originalFareLocal
    }
  })
  if (results.length === 0) {
    return { headers: [], items: [] }
  } else {
    return { headers: Object.keys(results[0]), items: results }
  }
}

export const driverOnOffPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items
    .filter(d => d.earnerState !== 'offline')
    .map(d => {
      return {
        earnerState: d.earnerState,
        beginTimestampUtc: d.beginTimestampUtc,
        endTimestampUtc: d.endTimestampUtc,
        durationMs: d.durationMs,
        beginLat: d.beginLat,
        beginLng: d.beginLng,
        endLat: d.endLat,
        endLng: d.endLng
      }
    })

  if (results.length === 0) {
    return { headers: [], items: [] }
  } else {
    return { headers: Object.keys(results[0]), items: results }
  }
}

export const driverRestrictionsPostProcessor: PostprocessorFunction =
  result => {
    const items = result?.items || []
    const results = items.filter(
      d => !(d.msgLatitude == 0 && d.msgLongitude == 0)
    )
    if (results.length === 0) {
      return { headers: [], items: [] }
    } else {
      return { headers: Object.keys(results[0]), items: results }
    }
  }

export const driverPointsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []

  const results = items.slice(0, 50000).map(({ lat, lng, ...rest }) => {
    return {
      date: rest.eventTimeUtc,
      latitude: lat || rest.latitude,
      longitude: lng || rest.longitude,
      carrier: rest.cellularCarrier,
      city: rest.city,
      event_type: rest.analyticsEventType,
      speed: rest.speedGps
    }
  })

  if (results.length === 0) {
    return { headers: [], items: [] }
  } else {
    return { headers: Object.keys(results[0]), items: results }
  }
}
