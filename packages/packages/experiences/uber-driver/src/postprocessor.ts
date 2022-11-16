import { PostprocessorFunction } from '@/types'

export const driverTripsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  if ('distance' in items[0]) {
    const results = items.map(
      // we want to remove the trip point as they are unreadable
      ({ distance, dropoffTime, begintripPoint, dropoffPoint, ...rest }) => {
        return {
          dropoffTime: dropoffTime.replace(/\n/g, ''),
          ...rest,
          distance: (distance * 1.609344).toFixed(3)
        }
      }
    )
    return { headers: Object.keys(results[0]), items: results }
  } else {
    const results = items.map(({ tripDistanceMiles, ...rest }) => {
      return {
        ...rest,
        tripDistance: (tripDistanceMiles * 1.609344).toFixed(3)
      }
    })
    return { headers: Object.keys(results[0]), items: results }
  }
}

export const driverPointsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  if ('lat' in items[0]) {
    const results = items.map(({ lat, lng, gpsTimeMs, ...rest }) => {
      return {
        latitude: lat,
        longitude: lng,
        gpsTimeMs:
          'gpsTimeMs' in items[0]
            ? new Date(parseInt(gpsTimeMs)).toISOString()
            : null,
        ...rest
      }
    })
    return { headers: Object.keys(results[0]), items: results }
  }
  return { headers: Object.keys(items[0]), items: items }
}

export const riderTripsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  const results = items.map(
    ({ distanceMiles, requestTime, beginTripTime, dropoffTime, ...rest }) => {
      return {
        requestTime: requestTime.replace(' +0000 UTC', ''),
        beginTripTime: beginTripTime.replace(' +0000 UTC', ''),
        dropoffTime: dropoffTime.replace(' +0000 UTC', ''),
        ...rest,
        tripDistance: (distanceMiles * 1.609344).toFixed(3)
      }
    }
  )
  return { headers: Object.keys(results[0]), items: results }
}

export const riderPointsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  if ('lat' in items[0]) {
    const results = items.map(({ lat, lng, gpsTimeMs, ...rest }) => {
      return {
        latitude: lat,
        longitude: lng,
        gpsTimeMs:
          'gpsTimeMs' in items[0]
            ? new Date(parseInt(gpsTimeMs)).toISOString()
            : null,
        ...rest
      }
    })
    return { headers: Object.keys(results[0]), items: results }
  }
  return { headers: Object.keys(items[0]), items: items }
}
