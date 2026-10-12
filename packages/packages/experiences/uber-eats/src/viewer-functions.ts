import type { FileManager } from '@/types/utils'
import {
  isoWeekday,
  localMillis,
  parseLocalTime,
  weekStart
} from './local-time'

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

const HOUR_MS = 3600 * 1000
const DAY_MS = 24 * HOUR_MS
const ONLINE_STATES = ['open', 'enroute', 'ontrip'] // P1, P2, P3
const ACTIVE_STATES = ['enroute', 'ontrip'] // P2, P3

type Granularity = 'month' | 'week'

// Period key and end (exclusive), in local milliseconds, of the period containing `ms`
function periodOf(ms: number, granularity: Granularity) {
  const date = new Date(ms)
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  if (granularity === 'month') {
    const key = `${year}-${String(month + 1).padStart(2, '0')}`
    return { key, end: Date.UTC(year, month + 1, 1) }
  }
  const weekday = (date.getUTCDay() + 6) % 7 // 0 = Monday
  const start = Date.UTC(year, month, date.getUTCDate() - weekday)
  return {
    key: new Date(start).toISOString().slice(0, 10),
    end: start + 7 * DAY_MS
  }
}

// Completed trips per hour online (P1 + P2 + P3) and per hour active
// (P2 + P3), by month and by week (starting Monday). State periods are split
// at period boundaries; trips are counted at courier_accept_timestamp_local.
async function trips_per_hour({ fileManager }: { fileManager: FileManager }) {
  const online = (
    await fileManager.getCsvItemsFromId('DriverOnlineOffline')
  )[0] ?? {
    headers: [],
    items: []
  }
  const trips = (
    await fileManager.getCsvItemsFromId('CourierLifetimeTripData')
  )[0] ?? {
    headers: [],
    items: []
  }

  type Totals = { trips: number; onlineMs: number; activeMs: number }
  const totals: Record<Granularity, Map<string, Totals>> = {
    month: new Map(),
    week: new Map()
  }
  const bucket = (granularity: Granularity, key: string) => {
    let entry = totals[granularity].get(key)
    if (!entry) {
      entry = { trips: 0, onlineMs: 0, activeMs: 0 }
      totals[granularity].set(key, entry)
    }
    return entry
  }

  for (const row of online.items) {
    const state = row.earnerState
    if (!ONLINE_STATES.includes(state)) {
      continue
    }
    const begin = parseLocalTime(row.beginTimestampLocal)
    const end = parseLocalTime(row.endTimestampLocal)
    if (!begin || !end) {
      continue
    }
    const active = ACTIVE_STATES.includes(state)
    for (const granularity of ['month', 'week'] as Granularity[]) {
      let from = localMillis(begin)
      const to = localMillis(end)
      while (from < to) {
        const period = periodOf(from, granularity)
        const until = Math.min(to, period.end)
        const entry = bucket(granularity, period.key)
        entry.onlineMs += until - from
        if (active) {
          entry.activeMs += until - from
        }
        from = until
      }
    }
  }

  for (const trip of trips.items) {
    if (trip.deliveryStatus !== 'completed') {
      continue
    }
    const time = parseLocalTime(trip.courierAcceptTimestampLocal)
    if (!time) {
      continue
    }
    for (const granularity of ['month', 'week'] as Granularity[]) {
      bucket(
        granularity,
        periodOf(localMillis(time), granularity).key
      ).trips += 1
    }
  }

  const round = (value: number) => Math.round(value * 100) / 100
  const items = (['month', 'week'] as Granularity[]).flatMap(granularity =>
    [...totals[granularity].entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, { trips, onlineMs, activeMs }]) => {
        const onlineHours = onlineMs / HOUR_MS
        const activeHours = activeMs / HOUR_MS
        return {
          period,
          granularity,
          tphOnline: onlineHours ? round(trips / onlineHours) : null,
          tphActive: activeHours ? round(trips / activeHours) : null,
          trips,
          onlineHours: round(onlineHours),
          activeHours: round(activeHours)
        }
      })
  )
  return {
    headers: [
      'period',
      'granularity',
      'tphOnline',
      'tphActive',
      'trips',
      'onlineHours',
      'activeHours'
    ],
    items
  }
}

type RevenueKind = 'base' | 'tips' | 'vat' | 'other'

// How "23a - Driver Payments.csv" lines are grouped. VAT is collected for the
// tax authority, so it is reported apart from what the deliveries earned.
function revenueKind(classification: string, category: string): RevenueKind {
  if (classification === 'transport.misc.tip' || category === 'tip') {
    return 'tips'
  }
  if (classification === 'delivery.courier.tax.vat' || category === 'tax') {
    return 'vat'
  }
  if (
    classification.startsWith('delivery.fare.') ||
    category === 'driver_payment_fares'
  ) {
    return 'base'
  }
  return 'other'
}

// Service revenues (payments for services, not necessarily what the courier
// earns) by month and by week, split into base revenue, tips, VAT and other
// items, per currency, dated by recognize_timestamp_local.
async function service_revenues({ fileManager }: { fileManager: FileManager }) {
  const payments = (
    await fileManager.getCsvItemsFromId('DriverPayments')
  )[0] ?? {
    headers: [],
    items: []
  }
  type Sums = Record<RevenueKind, number>
  const sums = new Map<string, Sums>()
  for (const row of payments.items) {
    const time = parseLocalTime(row.recognizeTimestampLocal)
    const amount = Number(row.amountLocal)
    if (!time || !Number.isFinite(amount)) {
      continue
    }
    const kind = revenueKind(row.classification ?? '', row.category ?? '')
    const currency = row.currencyCode || ''
    for (const granularity of ['month', 'week'] as Granularity[]) {
      const key = [
        granularity,
        periodOf(localMillis(time), granularity).key,
        currency
      ].join('|')
      const entry = sums.get(key) ?? { base: 0, tips: 0, vat: 0, other: 0 }
      entry[kind] += amount
      sums.set(key, entry)
    }
  }
  const round = (value: number) => Math.round(value * 100) / 100
  const order = { month: 0, week: 1 } as Record<string, number>
  const items = [...sums.entries()]
    .map(([key, entry]) => {
      const [granularity, period, currency] = key.split('|')
      return {
        period,
        granularity,
        base: round(entry.base),
        tips: round(entry.tips),
        vat: round(entry.vat),
        other: round(entry.other),
        currency
      }
    })
    .sort(
      (a, b) =>
        order[a.granularity] - order[b.granularity] ||
        a.period.localeCompare(b.period) ||
        a.currency.localeCompare(b.currency)
    )
  return {
    headers: [
      'period',
      'granularity',
      'base',
      'tips',
      'vat',
      'other',
      'currency'
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
    trips_by_weekday_hour,
    trips_per_hour,
    service_revenues
  }
}

export default viewerFunctions
