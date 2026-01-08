<template>
  <div class="layout-container">
    <div class="period-switch">
      <button
        v-for="p in ['week', 'month', 'total']"
        :key="p"
        :class="['switch-btn', { active: mode === p }]"
        @click="setPeriodMode(p)"
      >
        {{ p.toUpperCase() }}
      </button>
    </div>

    <div class="week-nav">
      <div class="week-nav-wrapper">
        <button class="nav-btn" @click="prevPeriod">←</button>
        <div class="week-label">{{ periodLabel }}</div>
        <button class="nav-btn" @click="nextPeriod">→</button>
      </div>
    </div>

    <!-- BOX 1 → Top full width stats -->
    <div class="box box1">
      <div>
        <strong>Total Earnings</strong>
        <div>{{ currency }} {{ totalEarnings.toFixed(2) }}</div>
      </div>

      <div>
        <strong>Total Hours Worked</strong>
        <div>{{ totalHours }} h</div>
      </div>

      <div>
        <strong>Number of Deliveries</strong>
        <div>{{ deliveryCount }}</div>
      </div>
    </div>

    <!-- BOX 2 → Timeline chart -->
    <div class="box box2">
      <div v-if="mode === 'week'" class="timeline-wrapper">
        <ApexChart
          type="rangeBar"
          height="400"
          :options="timelineOptions"
          :series="timelineSeries"
        />
      </div>

      <div v-else-if="mode === 'month'">
        <MonthlyCalendar
          view-block-translation-prefix="uberEats.monthlyCalendar"
          :year="calendarYear"
          :month="calendarMonth"
          :shifts="shiftsThisPeriod"
          :payments="paymentsInRange"
          @select-day="onSelectDay"
        />
      </div>

      <div v-else>
        <TopDays :days="top5Days" :currency="currency" />
      </div>

      <div class="legend" v-if="mode === 'week'">
        <div class="legend-item"><span class="color-box offline"></span> Offline</div>
        <div class="legend-item"><span class="color-box open"></span> Open</div>
        <div class="legend-item"><span class="color-box enroute"></span> Enroute</div>
        <div class="legend-item"><span class="color-box ontrip"></span> On Trip</div>
      </div>
    </div>

    <!-- BOX 3 + BOX 4 → Distance + Avg Time -->
    <div class="right-column">
      <div class="box box3">
        <p><strong>Distance travelled</strong></p>
        <p>{{ totalDistance }} km</p>
      </div>

      <div class="box box4">
        <p><strong>Average delivery time</strong></p>
        <p>{{ avgDeliveryTimeFormatted }}</p>
      </div>
    </div>

  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import MonthlyCalendar from './MonthlyCalendar.vue'
import TopDays from './TopDays.vue'
import mixin from '@/components/chart/view/mixin'
import { periodStore } from './store/periodStore'
import { createTour } from './onboarding/tour'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

/**
 * OverView.vue
 * - expects pipeline output: this.values[0] = { online, payments, trips, props }
 * - uses this.itemsComputed (derived from values[0].online.items)
 */
export default {
  name: 'OverView',
  components: {
    MonthlyCalendar,
    TopDays,
    ApexChart: VueApexCharts
  },
  mixins: [mixin],
  computed: {
    // periodStore period mode bindings
    mode: {
      get() { return periodStore.mode },
      set(v) { periodStore.mode = v }
    },

    // period start as dayjs object
    periodStart() {
      return dayjs(periodStore.periodStart)
    },

    // period end as dayjs object
    periodEnd() {
      return dayjs(periodStore.periodEnd)
    },

    // calendar year for MonthlyCalendar
    calendarYear() {
      return this.periodStart.year()
    },

    // calendar month for MonthlyCalendar
    calendarMonth() {
      return this.periodStart.month() // 0–11
    },

    // human-readable period label
    periodLabel() {
      if (this.mode === 'total') return 'All time'
      if (this.mode === 'month') {
        return this.periodStart.format('MMMM YYYY')
      }

      return `${this.periodStart.format('DD.MM')} – ${this.periodEnd.format('DD.MM.YYYY')}`
    },

    // block is the wrapper object from the combined pipeline
    block() {
      return this.values?.[0] ?? {}
    },

    // online shifts array (raw objects from CSV)
    itemsComputed() {
      return this.block.online?.items ?? []
    },

    // payments/trips from pipeline
    payments() {
      return this.block.payments?.items ?? []
    },

    // payments between start and end date
    paymentsInRange() {
      return this.filterByPeriod(
        this.payments,
        p => p.recognizeTimestampLocal
      )
    },

    // raw trips CSV string
    tripsRaw() {
      return this.block.trips?.rawCsv ?? ''
    },

    // currency guess: fallback '$'
    currency() {
      // Try to infer from payments if present
      if (this.payments.length > 0 && this.payments[0].currencyCode) {
        return this.payments[0].currencyCode
      }
      return this.block.currency ?? '$'
    },

    // total earnings summed up
    totalEarnings() {
      return this.paymentsInRange.reduce((s, p) => s + (Number(p.amountLocal) || 0), 0)
    },

    // total hours from shifts (skip offline)
    totalHours() {
      const minutes = this.shiftsThisPeriod.reduce((sum, s) => {
        if (!s.begin_timestamp_utc || !s.end_timestamp_utc) return sum
        if (s.earner_state === 'offline') return sum
        const start = dayjs(s.begin_timestamp_utc)
        const end = dayjs(s.end_timestamp_utc)
        if (!start.isValid() || !end.isValid() || end.isBefore(start)) return sum
        return sum + end.diff(start, 'minute')
      }, 0)
      return (minutes / 60).toFixed(1)
    },

    // shifts grouped by day (YYYY-MM-DD)
    shiftsByDay() {
      const map = {}

      this.itemsComputed.forEach((s) => {
        const begin = s.begin_timestamp_utc || s.beginTimestampUtc || s.begin_timestamp || s.begin
        const end = s.end_timestamp_utc || s.endTimestampUtc || s.end_timestamp || s.end
        if (!begin || !end) return

        const start = dayjs(begin)
        const finish = dayjs(end)
        if (!start.isValid() || !finish.isValid()) return

        // split overnight shifts
        const parts = this.splitOvernightShift({ begin: start, end: finish, raw: s })

        parts.forEach((p) => {
          const d = dayjs(p.begin)
          const key = d.format('YYYY-MM-DD')

          if (!map[key]) map[key] = []

          map[key].push({
            begin_timestamp_utc: p.begin,
            end_timestamp_utc: p.end,
            earner_state: p.raw?.state || p.raw?.earner_state
          })
        })
      })

      return map
    },

    // filtered trips in the selected period
    tripsInPeriod() {
      return this.filterByPeriod(
        this.tripsParsed,
        t => t.courierBegintripTimestampLocal || t.beginTimestampLocal
      )
    },

    // Number of completed deliveries
    deliveryCount() {
      // trips who were completed
      return this.tripsInPeriod.length
    },

    // Complete distance summed up
    totalDistance() {
      const km = this.tripsInPeriod.reduce((sum, t) => sum + (Number(t.dropoffDeliveryDistanceKm) || 0), 0)
      return km.toFixed(2)
    },

    // Average time per delivery calculated
    avgDeliveryTimeFormatted() {
      const trips = this.tripsInPeriod
      if (!trips.length) return '0 min'
      const totalMinutes = trips.reduce((sum, t) => {
        const start = dayjs(t.courierBegintripTimestampLocal)
        const end = dayjs(t.courierDropoffTimestampLocal)
        if (!start.isValid() || !end.isValid() || end.isBefore(start)) return sum
        return sum + end.diff(start, 'minute')
      }, 0)
      const avg = totalMinutes / trips.length
      const hours = Math.floor(avg / 60)
      const minutes = Math.round(avg % 60)
      return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
    },

    // payments grouped by day with total amount and hours
    paymentsByDayTotal() {
      // Ignore periodStore completely (full payments)
      const map = {}

      this.payments.forEach((p) => {
        const d = dayjs(p.recognizeTimestampLocal)
        if (!d.isValid()) return
        const key = d.format('YYYY-MM-DD')
        const amt = Number(p.amountLocal) || 0
        if (!map[key]) {
          map[key] = { amount: 0, hours: 0 }
        }

        map[key].amount += amt
      })

      Object.keys(map).forEach((date) => {
        const shifts = this.shiftsByDay[date] || []
        map[date].hours = this.calcHoursFromShifts(shifts)
      })

      // Convert to array sorted desc
      return Object.entries(map)
        .map(([date, v]) => ({
          date,
          amount: v.amount,
          hours: v.hours
        }))
        .sort((a, b) => b.amount - a.amount)
    },

    // 5 most earned days
    top5Days() {
      return this.paymentsByDayTotal.slice(0, 5)
    },

    // trips parsed from raw CSV if available (best-effort)
    tripsParsed() {
      // if pipeline already parsed trips into items, prefer that
      if (Array.isArray(this.block.trips?.items) && this.block.trips.items.length) {
        return this.block.trips.items
      }
      // otherwise try to parse raw CSV simply (very lightweight parser)
      if (!this.tripsRaw) return []
      const lines = this.tripsRaw.split(/\r?\n/).filter(Boolean)
      const header = lines[0]?.split(',').map(h => h.trim())
      if (!header) return []
      return lines.slice(1).map((line) => {
        const parts = line.split(',')
        const obj = {}
        header.forEach((h, i) => { obj[h] = parts[i] })
        return obj
      })
    },

    // Determine the week period (start = Monday)
    periodRange() {
      if (periodStore.mode === 'total') {
        return {
          start: dayjs('2000-01-01').startOf('day'),
          end: dayjs().endOf('day')
        }
      }

      const startStr = periodStore.periodStart
      const endStr = periodStore.periodEnd

      if (startStr && endStr) {
        return { start: dayjs(startStr), end: dayjs(endStr) }
      }
      // default: current week (Monday..Sunday)
      const now = dayjs()
      const monday = now.startOf('week').add(1, 'day')
      const mon = monday.day() === 1 ? monday : now.startOf('week').add(1, 'day')
      const start = mon
      const end = start.add(6, 'day').endOf('day')
      return { start, end }
    },

    // Shifts filtered for the time period & split overnight
    shiftsThisPeriod() {
      const res = []
      const { start, end } = this.periodRange
      this.itemsComputed.forEach((s) => {
        const begin = s.begin_timestamp_utc || s.beginTimestampUtc || s.begin_timestamp || s.begin
        const finish = s.end_timestamp_utc || s.endTimestampUtc || s.end_timestamp || s.end
        if (!begin || !finish) return
        const startD = dayjs(begin)
        const endD = dayjs(finish)
        if (!startD.isValid() || !endD.isValid()) return

        // split overnight
        const parts = this.splitOvernightShift({ begin: startD, end: endD, raw: s })
        parts.forEach((p) => {
          // only include parts whose start lies inside the selected week
          const st = dayjs(p.begin)
          if (st.isSameOrAfter(start) && st.isSameOrBefore(end)) {
            // attach original meta
            res.push(Object.assign({}, p.raw || p, { begin_timestamp_utc: p.begin, end_timestamp_utc: p.end, earner_state: p.raw?.state }))
          }
        })
      })
      return res
    },

    // Timeline chart series data
    timelineSeries() {
      const colors = {
        offline: '#cccccc',
        open: '#4caf50',
        enroute: '#ff9800',
        ontrip: '#2196f3'
      }

      const states = Object.keys(colors)

      // Initialize structure with ALL weekdays
      const seriesMap = {}
      states.forEach((state) => {
        seriesMap[state] = {
          name: state,
          color: colors[state],
          data: WEEKDAYS.map(day => ({
            x: day,
            y: null // placeholder → forces category to exist
          }))
        }
      })

      this.shiftsThisPeriod.forEach((s) => {
        const start = dayjs(s.begin_timestamp_utc)
        const end = dayjs(s.end_timestamp_utc)

        const dow = start.day() === 0 ? 6 : start.day() - 1
        const dayLabel = WEEKDAYS[dow]

        const state = (s.state || s.earner_state || 'open').toLowerCase()

        seriesMap[state].data.push({
          x: dayLabel,
          y: [
            start.hour() * 60 + start.minute(),
            end.hour() * 60 + end.minute()
          ],
          meta: s
        })
      })

      return Object.values(seriesMap)
    },

    // Timeline chart options
    timelineOptions() {
      return {
        chart: {
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        plotOptions: {
          bar: { horizontal: true, rangeBarGroupRows: true }
        },
        xaxis: {
          min: 0,
          max: 1440,
          tickAmount: 8,
          labels: {
            formatter: (v) => {
              const h = Math.floor(v / 60)
              return `${h}:00`
            }
          }
        },
        yaxis: { categories: WEEKDAYS },
        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const d = w.config.series[seriesIndex].data[dataPointIndex]
            const s = dayjs(d.meta.begin_timestamp_utc)
            const e = dayjs(d.meta.end_timestamp_utc)
            return `
              <div style="padding:8px;font-size:12px">
                <strong>${w.config.series[seriesIndex].name.toUpperCase()}</strong><br/>
                ${s.format('DD.MM.YY')}<br/>
                ${s.format('HH:mm')} – ${e.format('HH:mm')}
              </div>`
          }
        },
        legend: { show: false }
      }
    }
  },
  mounted() {
    // Continue tutorial if needed
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }
    periodStore.initFromTrips(this.tripsParsed)

    // Check if we need to start the tutorial
    const alreadyShown = localStorage.getItem('uberEatsTourShown')
    if (!alreadyShown) {
      this.startOverviewTour()
    }
  },
  activated() {
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }
  },
  methods: {
    /**
     * Start the overview tutorial tour
     */
    startOverviewTour() {
      // Create tour instance with callback to switch tabs
      const tour = createTour({
        onGoToRoutes: () => {
          // Emit event to parent to switch tab (no Shepherd logic in parent)
          this.$emit('switch-tab', 'routes')

          // Wait for new tab to render before continuing
          setTimeout(() => tour.next(), 350)
        }
      })

      // Mark as shown so it doesn't repeat
      localStorage.setItem('uberEatsTourShown', 'yes')

      // Start the tour
      tour.start()
    },

    /**
     * Handle day selection from MonthlyCalendar
     */
    onSelectDay(date) {
      periodStore.setMode('week')

      // 2. Compute the Monday–Sunday of that date
      const clicked = dayjs(date)
      const monday = clicked.startOf('week').add(1, 'day') // Monday
      const sunday = monday.add(6, 'day').endOf('day')

      // 3. Update the store
      periodStore.setPeriod(monday.toISOString(), sunday.toISOString())

      // Optional: redraw chart immediately
      this.redraw()
    },

    /**
     * Calculate total hours from shifts array
     */
    calcHoursFromShifts(shifts) {
      const minutes = shifts.reduce((sum, s) => {
        if (!s.begin_timestamp_utc || !s.end_timestamp_utc) return sum
        if (s.earner_state === 'offline') return sum

        const start = dayjs(s.begin_timestamp_utc)
        const end = dayjs(s.end_timestamp_utc)
        if (!start.isValid() || !end.isValid() || end.isBefore(start)) return sum

        return sum + end.diff(start, 'minute')
      }, 0)

      return Number((minutes / 60).toFixed(1))
    },

    /**
     * Set the period mode (week, month, total)
     */
    setPeriodMode(mode) {
      periodStore.setMode(mode)

      if (mode === 'total') return

      if (mode === 'month') {
        const start = this.periodStart.startOf('month')
        const end = this.periodStart.endOf('month')
        periodStore.setPeriod(start.toISOString(), end.toISOString())
        return
      }

      // week mode
      const monday = this.periodStart.startOf('week').add(1, 'day')
      const sunday = monday.add(6, 'day').endOf('day')

      periodStore.setPeriod(monday.toISOString(), sunday.toISOString())
    },

    /**
     * Navigate to previous period
     */
    prevPeriod() {
      if (this.mode === 'total') return

      if (this.mode === 'month') {
        const newStart = this.periodStart.subtract(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
        return
      }

      // week mode
      const newStart = this.periodStart.subtract(7, 'day')
      const newEnd = newStart.add(6, 'day').endOf('day')
      periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
    },

    /**
     * Navigate to next period
     */
    nextPeriod() {
      if (this.mode === 'total') return

      if (this.mode === 'month') {
        const newStart = this.periodStart.add(1, 'month').startOf('month')
        const newEnd = newStart.endOf('month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
        return
      }

      // week mode
      const newStart = this.periodStart.add(7, 'day')
      const newEnd = newStart.add(6, 'day').endOf('day')
      periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
    },

    /**
     * Filter items by current period range
     */
    filterByPeriod(items, getDateFn) {
      const { start, end } = this.periodRange
      return items.filter((i) => {
        const d = dayjs(getDateFn(i))
        return d.isValid() && d.isSameOrAfter(start) && d.isSameOrBefore(end)
      })
    },

    // Splits a shift object if it crosses midnight.
    splitOvernightShift(s) {
      const raw = s.raw || s
      const start = dayjs(s.begin)
      const end = dayjs(s.end)
      if (end.isAfter(start) && start.isSame(end, 'day')) {
        return [{ begin: start.toISOString(), end: end.toISOString(), raw }]
      }
      // split
      const endOfDay = start.endOf('day')
      const startOfNext = end.startOf('day')
      return [
        { begin: start.toISOString(), end: endOfDay.toISOString(), raw },
        { begin: startOfNext.toISOString(), end: end.toISOString(), raw }
      ]
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: grid;
  width: 94%;
  grid-template-rows: auto 16% 1fr;
  grid-template-columns: 70% 1fr;
  gap: 16px;
  margin-left: 16px;
  margin-bottom: 24px;
}

.period-switch {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  position: absolute;
  display: flex;
  gap: 6px;
}

.switch-btn {
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: #e0e0e0;
  color: #333;
  cursor: pointer;
  font-size: 0.85rem;
}

.switch-btn.active {
  background: #bcbcbc;
  font-weight: 700;
}

.switch-btn:hover {
  background: #d2d2d2;
}

.week-nav {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
}

.week-nav-wrapper {
  width: 240px;
  display: flex;
  flex-direction: row;
}

.nav-btn {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: white;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 1rem;
}

.nav-btn:hover {
  background: #f3f3f3;
}

.week-label {
  width: 180px;
  font-weight: 700;
  color: #333;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
}

/* Base box style */
.box {
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  font-size: 1.2rem;
}

/* TOP BAR */
.box1 {
  grid-column: 1 / 3;
  grid-row: 2 / 3;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
}

/* TIMELINE CHART (bottom left) */
.box2 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  display: flex;
  flex-direction: column;
  padding-bottom: 16px;
}

/* RIGHT COLUMN (bottom right) */
.right-column {
  grid-column: 2 / 3;
  grid-row: 3 / 4;

  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

.box3,
.box4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
}

/* legend */
.legend { display:flex; gap:12px; margin-top: 10px; justify-content: center; }
.legend-item { display:flex; align-items:center; gap:8px; font-size: .9rem; }
.color-box { width: 14px; height: 14px; border-radius: 3px; display:inline-block; }
.color-box.offline { background-color: #cccccc; }
.color-box.open { background-color: #4caf50; }
.color-box.enroute { background-color: #ff9800; }
.color-box.ontrip { background-color: #2196f3; }

/* tooltip (will be appended to component root) */
.ov-tooltip { z-index: 50; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

/* small active button */
.v-btn.active { background-color: #2e7d32 !important; color: white !important; }

/* Mobile layout */
@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .period-switch {
    position: static;
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 8px;
  }

  .week-nav {
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 12px;
  }

  .box1 {
    grid-column: 1 / 2;
    grid-row: auto;
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .box2 {
    grid-column: 1 / 2;
    grid-row: auto;
  }

  .right-column {
    grid-column: 1 / 2;
    grid-row: auto;
    grid-template-rows: auto;
  }

  .box3,
  .box4 {
    text-align: center;
  }
}
</style>
