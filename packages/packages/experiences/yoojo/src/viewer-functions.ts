import type { FileManager } from '@/types/utils'

async function csv_yoojo_jobs({ fileManager }: { fileManager: FileManager }) {
  const csv = (await fileManager.getCsvItemsFromId('jobs'))[0] ?? {
    headers: [],
    items: []
  }

  const rows = csv.items

  const parseEuropeanDateSafe = (d: string): Date | null => {
    if (!d) return null
    const parts = d.split('.').map(Number)
    if (parts.length !== 3 || parts.some(isNaN)) return null
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  const hourToTime = (h: number) => {
    const hours = Math.floor(h)
    const minutes = Math.round((h - hours) * 60)
    return { hours, minutes }
  }

  const formatTime = (d: Date) => {
    const hh = d.getHours().toString().padStart(2, '0')
    const mm = d.getMinutes().toString().padStart(2, '0')
    return `${hh}:${mm}`
  }

  const formatDateLocal = (d: Date) => {
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const items: Record<string, any>[] = []

  for (const r of rows) {
    const dateObj = parseEuropeanDateSafe(r.date)
    if (!dateObj) continue

    const startHour = parseFloat(r.startHour)
    const duration = parseFloat(r.nbHours)
    const price = parseFloat(r.pricePerHour)

    if (isNaN(startHour) || isNaN(duration)) continue

    // compute begin/end timestamps
    const start = hourToTime(startHour)
    const begin = new Date(dateObj)
    begin.setHours(start.hours, start.minutes, 0, 0)

    const endT = hourToTime(startHour + duration)
    const end = new Date(dateObj)
    end.setHours(endT.hours, endT.minutes, 0, 0)

    items.push({
      job_id: r.id,
      date: formatDateLocal(dateObj),
      start_time: formatTime(begin),
      end_time: formatTime(end),
      duration_hours: duration,
      earnings: Number.isFinite(price) ? price * duration : null,
      location: r.cityName || '',
      job_type: r.title || '',
      status: (r.state || '').toLowerCase(),
      category: r.category || ''
    })
  }

  return {
    headers: [
      'job_id',
      'date',
      'start_time',
      'end_time',
      'duration_hours',
      'earnings',
      'location',
      'job_type',
      'status',
      'category'
    ],
    items
  }
}

const isSet = (value: unknown) =>
  value !== undefined && value !== null && value !== '' && value !== 'NULL'

// Effective work: jobs (and hours) applied for vs booked, by category and in
// total. Every row of the export is a job the worker applied for (each has
// accepted_at). A job is booked when booked_at is set, including jobs
// cancelled afterwards (counted apart in jobsBookedCanceled). Hours are
// nb_hours; jobs without it count in jobsWithoutHours, not in the hours.
async function yoojo_effective_work({
  fileManager
}: {
  fileManager: FileManager
}) {
  const csv = (await fileManager.getCsvItemsFromId('jobs'))[0] ?? {
    headers: [],
    items: []
  }
  type Counts = {
    jobsApplied: number
    jobsBooked: number
    jobsBookedCanceled: number
    hoursApplied: number
    hoursBooked: number
    jobsWithoutHours: number
  }
  const empty = (): Counts => ({
    jobsApplied: 0,
    jobsBooked: 0,
    jobsBookedCanceled: 0,
    hoursApplied: 0,
    hoursBooked: 0,
    jobsWithoutHours: 0
  })
  const byCategory = new Map<string, Counts>()
  const total = empty()
  for (const row of csv.items) {
    const category = isSet(row.category) ? String(row.category) : ''
    const hours = isSet(row.nbHours) ? Number(row.nbHours) : NaN
    const booked = isSet(row.bookedAt)
    const counts = byCategory.get(category) ?? empty()
    byCategory.set(category, counts)
    for (const entry of [counts, total]) {
      entry.jobsApplied += 1
      if (Number.isFinite(hours)) {
        entry.hoursApplied += hours
      } else {
        entry.jobsWithoutHours += 1
      }
      if (booked) {
        entry.jobsBooked += 1
        if (Number.isFinite(hours)) {
          entry.hoursBooked += hours
        }
        if (isSet(row.canceledAt)) {
          entry.jobsBookedCanceled += 1
        }
      }
    }
  }
  const round = (value: number) => Math.round(value * 100) / 100
  const item = (scope: string, category: string, counts: Counts) => ({
    scope,
    category,
    ...counts,
    hoursApplied: round(counts.hoursApplied),
    hoursBooked: round(counts.hoursBooked),
    bookingRate: counts.jobsApplied
      ? round(counts.jobsBooked / counts.jobsApplied)
      : 0
  })
  const categories = [...byCategory.entries()]
    .sort(
      ([a, x], [b, y]) => y.jobsApplied - x.jobsApplied || a.localeCompare(b)
    )
    .map(([category, counts]) => item('category', category, counts))
  return {
    headers: [
      'scope',
      'category',
      'jobsApplied',
      'jobsBooked',
      'jobsBookedCanceled',
      'hoursApplied',
      'hoursBooked',
      'jobsWithoutHours',
      'bookingRate'
    ],
    items: [item('total', '', total), ...categories]
  }
}

const viewerFunctions = {
  postprocessors: {},
  customPipelines: {
    csv_yoojo_jobs,
    yoojo_effective_work
  }
}

export default viewerFunctions
