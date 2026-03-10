import dayjs from 'dayjs'
import { reactive } from 'vue'

export const periodStore = reactive({
  periodStart: null,
  periodEnd: null,
  mode: 'month',
  allTimeStart: null,
  allTimeEnd: null,

  // Set the period range (start and end dates)
  setPeriod(start, end) {
    this.periodStart = start
    this.periodEnd = end
  },

  // Set the period mode (week/month/total)
  setMode(newMode) {
    this.mode = newMode
  },

  // Initialize based on the latest available trip
  initFromTrips(trips) {
    if (!trips || !trips.length) return

    let earliest = null
    let latest = null

    trips.forEach((t) => {
      const d = dayjs(t.courierAcceptTimestampLocal || t.beginTimestampLocal)
      if (!d.isValid()) return

      if (!earliest || d.isBefore(earliest)) earliest = d
      if (!latest || d.isAfter(latest)) latest = d
    })

    if (!latest) return

    // Save alltime range
    this.allTimeStart = earliest.startOf('day').toISOString()
    this.allTimeEnd = latest.endOf('day').toISOString()

    // Set initial period to latest week
    let monday = latest.startOf('week') // Sunday = 0
    if (monday.day() !== 1) {
      monday = monday.add(1, 'day') // shift to Monday
    }

    const sunday = monday.add(6, 'day').endOf('day')
    this.setPeriod(monday.toISOString(), sunday.toISOString())
  }
})
