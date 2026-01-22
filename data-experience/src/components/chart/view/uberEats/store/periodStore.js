import dayjs from 'dayjs'
import { reactive } from 'vue'

export const periodStore = reactive({
  periodStart: null,
  periodEnd: null,
  mode: 'month',

  setPeriod(start, end) {
    this.periodStart = start
    this.periodEnd = end
  },

  setMode(newMode) {
    this.mode = newMode
  },

  /** Initialize based on the latest available trip */
  initFromTrips(trips) {
    if (!trips || !trips.length) return

    // find most recent trip date
    const latestTrip = trips.reduce((latest, t) => {
      const d = dayjs(t.courierAcceptTimestampLocal || t.beginTimestampLocal)
      return (!latest || d.isAfter(latest)) ? d : latest
    }, null)

    if (!latestTrip) return

    // Align to Monday–Sunday week
    let monday = latestTrip.startOf('week') // Sunday = 0
    // adjust because `startOf('week')` = Sunday
    if (monday.day() !== 1) {
      monday = monday.add(1, 'day') // shift to Monday
    }
    const sunday = monday.add(6, 'day').endOf('day')

    this.setPeriod(monday.toISOString(), sunday.toISOString())
  }
})
