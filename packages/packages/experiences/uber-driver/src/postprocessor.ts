import { PostprocessorFunction } from '@/types'

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

export const driverOnOffPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(d => {
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
