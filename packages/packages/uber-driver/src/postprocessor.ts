import { PostprocessorFunction } from '@/types'

function computeCrowDist(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in km
  return d
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}

function computeCrowRatio(crow_dist: number, dist: number) {
  return dist / crow_dist
}

export const driverTripsPostProcessor: PostprocessorFunction = result => {
  const items = result?.items || []
  if ('distance' in items[0]) {
    const results = items.map(
      // we want to remove the trip point as they are unreadable
      ({
        distance,
        dropoffTime,
        begintripPoint,
        dropoffPoint,
        begintripLatitude,
        begintripLongitude,
        dropoffLatitude,
        dropoffLongitude,
        ...rest
      }) => {
        return {
          begintripLatitude: begintripLatitude,
          begintripLongitude: begintripLongitude,
          dropoffLatitude: dropoffLatitude,
          dropoffLongitude: dropoffLongitude,
          distanceKm: (distance * 1.609344).toFixed(3),
          crowDistance: computeCrowDist(
            begintripLatitude,
            begintripLongitude,
            dropoffLatitude,
            dropoffLongitude
          ).toFixed(3),
          crowRatio: computeCrowRatio(
            computeCrowDist(
              begintripLatitude,
              begintripLongitude,
              dropoffLatitude,
              dropoffLongitude
            ),
            distance * 1.609344
          ).toFixed(3),

          dropoffTime: dropoffTime.replace(/\n/g, ''),
          ...rest
        }
      }
    )
    return { headers: Object.keys(results[0]), items: results }
  } else {
    const results = items.map(({ tripDistanceMiles, ...rest }) => {
      return {
        ...rest,
        tripDistanceKm: (tripDistanceMiles * 1.609344).toFixed(3)
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
        tripDistanceKm: (distanceMiles * 1.609344).toFixed(3)
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
