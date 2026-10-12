import type { FileManager } from '@/types/utils'
import { isoWeekday, parseLocalTime, weekStart } from './local-time'

async function combined_data_pipeline({
  fileManager
}: {
  fileManager: FileManager
}) {
  const driverOnlineCsv = (
    await fileManager.getCsvItemsFromId('DriverOnlineOffline')
  )[0] ?? {
    headers: [],
    items: []
  }

  const onlineItems = driverOnlineCsv.items.map(row => {
    const begin = row.beginTimestampLocal
    const end = row.endTimestampLocal
    const hours = row.durationMs ? Number(row.durationMs) / 1000 / 3600 : null
    const state = row.earnerState

    return { begin, end, hours, state }
  })

  // Get driver payments
  const payments = (
    await fileManager.getCsvItemsFromId('DriverPayments')
  )[0] ?? {
    headers: [],
    items: []
  }

  // Get trip data
  const trips = (
    await fileManager.getCsvItemsFromId('CourierLifetimeTripData')
  )[0] ?? {
    headers: [],
    items: []
  }

  return {
    headers: ['online', 'payments', 'trips'],
    items: [
      {
        online: { headers: ['begin', 'end', 'hours'], items: onlineItems },
        payments,
        trips
      }
    ]
  }
}

// courier trips for kepler (return rawCsv + kepler config)
async function csv_courier_trips({
  fileManager
}: {
  fileManager: FileManager
}) {
  const csv = (
    await fileManager.getCsvItemsFromId('CourierLifetimeTripData')
  )[0] ?? { headers: [], items: [] }

  return {
    headers: ['trips'],
    items: [
      {
        trips: csv
      }
    ]
  }
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Completed trips by weekday and hour of acceptance (courier_accept_timestamp_local),
// with all 7 x 24 cells. `trips` is the total over the export; `perActiveWeek`
// divides it by the number of weeks (Monday to Sunday) with at least one
// completed trip, so people with different periods can be compared.
async function trips_by_weekday_hour({
  fileManager
}: {
  fileManager: FileManager
}) {
  const csv = (
    await fileManager.getCsvItemsFromId('CourierLifetimeTripData')
  )[0] ?? { headers: [], items: [] }

  const counts = Array.from({ length: 7 }, () => new Array(24).fill(0))
  const activeWeeks = new Set<string>()
  for (const trip of csv.items) {
    if (trip.deliveryStatus !== 'completed') {
      continue
    }
    const time = parseLocalTime(trip.courierAcceptTimestampLocal)
    if (!time) {
      continue
    }
    counts[isoWeekday(time) - 1][time.hour] += 1
    activeWeeks.add(weekStart(time))
  }

  const weeks = activeWeeks.size
  const items = counts.flatMap((hours, index) =>
    hours.map((trips, hour) => ({
      weekday: index + 1,
      day: WEEKDAYS[index],
      hour,
      trips,
      perActiveWeek: weeks ? Math.round((trips / weeks) * 100) / 100 : 0,
      activeWeeks: weeks
    }))
  )
  return {
    headers: [
      'weekday',
      'day',
      'hour',
      'trips',
      'perActiveWeek',
      'activeWeeks'
    ],
    items
  }
}

const viewerFunctions = {
  postprocessors: {
    // add named postprocessors if needed
  },
  customPipelines: {
    combined_data_pipeline,
    csv_courier_trips,
    trips_by_weekday_hour
  }
}

export default viewerFunctions
