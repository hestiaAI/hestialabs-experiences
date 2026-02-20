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

    <div class="period-descriptions">
      <div v-if="mode === 'week'" class="period-desc">
        📅 Week view: See your shifts and key metrics for each day of the week
      </div>
      <div v-if="mode === 'month'" class="period-desc">
        📆 Month view: Click on any day to view that week
      </div>
      <div v-if="mode === 'total'" class="period-desc">
        📊 Total view: Your overall statistics and patterns across all time
      </div>
    </div>

    <div class="week-nav">
      <div class="week-nav-wrapper">
        <button
          class="nav-btn"
          v-if="mode !== 'total'"
          @click="prevPeriod"
        >
          ←
        </button>
        <div class="week-label" :class="`mode-${mode}`">{{ periodLabel }}</div>
        <button
          class="nav-btn"
          v-if="mode !== 'total'"
          @click="nextPeriod"
        >
          →
        </button>
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
          height="396"
          :options="timelineOptions"
          :series="timelineSeries"
        />
      </div>

      <div v-else-if="mode === 'month'">
        <MonthlyCalendar
          view-block-translation-prefix="uberEats.monthlyCalendar"
          :year="calendarYear"
          :month="calendarMonth"
          :dailyStats="dailyStatsByDate"
          :currency="currency"
          :selectedDate="selectedCalendarDate"
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
        <p class="metric-title">
          <strong>Distance travelled</strong>

          <button
            class="info-icon"
            type="button"
            @click.stop="toggleInfo('distance')"
            aria-label="Info about distance travelled"
          >
            i
          </button>

          <span v-if="openInfo === 'distance'" class="info-tooltip">
            Total for the selected period
          </span>
        </p>
        <p>{{ totalDistance }} km</p>
      </div>

      <div class="box box4">
        <p class="metric-title">
          <strong>Average delivery time</strong>

          <button
            class="info-icon"
            type="button"
            @click.stop="toggleInfo('avgTime')"
            aria-label="Info about average delivery time"
          >
            i
          </button>

          <span v-if="openInfo === 'avgTime'" class="info-tooltip">
            Average for the deliveries of the selected period
          </span>
        </p>
        <p>{{ avgDeliveryTimeFormatted }}</p>
      </div>

      <div class="box box5" v-if="mode === 'total'">
        <p class="box5-title"><strong>Most Used Devices</strong></p>
        <ApexChart
          type="bar"
          height="200"
          :options="deviceChartOptions"
          :series="deviceChartSeries"
        />
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
  data() {
    return {
      // GLOBAL CACHES (built once)
      shiftsByDayCache: {},
      paymentsByDayCache: {},

      // PERIOD CACHES (rebuilt on period change)
      shiftsThisPeriodCache: [],
      paymentsThisPeriodCache: [],
      dailyStatsCache: {},
      timelineSeriesCache: [],
      paymentsByDayTotalCache: [],
      top5DaysCache: [],

      periodReady: false,
      selectedCalendarDate: null,
      openInfo: null
    }
  },
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
      if (this.mode === 'total') {
        const { allTimeStart, allTimeEnd } = periodStore

        if (!allTimeStart || !allTimeEnd) {
          return 'All time'
        }

        return `${dayjs(allTimeStart).format('DD.MM.YYYY')} – ${dayjs(allTimeEnd).format('DD.MM.YYYY')}`
      }
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
      return this.paymentsThisPeriodCache
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
      return this.paymentsThisPeriodCache.reduce((s, p) => s + (Number(p.amountLocal) || 0), 0)
    },

    // total hours from shifts (skip offline)
    totalHours() {
      const minutes = this.shiftsThisPeriodCache.reduce((sum, s) => {
        if (s.earner_state === 'offline') return sum
        return sum + (s.endTs - s.beginTs) / 60000
      }, 0)
      return (minutes / 60).toFixed(1)
    },

    // payments & shifts grouped by day for calendar view
    dailyStatsByDate() {
      return this.dailyStatsCache
    },

    // shifts grouped by day (YYYY-MM-DD)
    shiftsByDay() {
      return this.shiftsByDayCache
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
      return this.paymentsByDayTotalCache
    },

    // 5 most earned days
    top5Days() {
      return this.top5DaysCache
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

      if (periodStore.mode === 'month') {
        const base = dayjs(periodStore.periodStart || dayjs())
        return {
          start: base.startOf('month'),
          end: base.endOf('month')
        }
      }

      const startStr = periodStore.periodStart
      const endStr = periodStore.periodEnd

      if (startStr && endStr) {
        return { start: dayjs(startStr), end: dayjs(endStr) }
      }

      // fallback: current week
      const now = dayjs()
      const monday = now.startOf('week').add(1, 'day')
      return {
        start: monday,
        end: monday.add(6, 'day').endOf('day')
      }
    },

    // Shifts filtered for the time period & split overnight
    shiftsThisPeriod() {
      return this.shiftsThisPeriodCache
    },

    // Timeline chart series data
    timelineSeries() {
      return this.timelineSeriesCache
    },

    // Timeline chart options
    timelineOptions() {
      return {
        chart: {
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            filter: {
              type: 'none'
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            rangeBarGroupRows: true
          }
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
          followCursor: false,
          shared: false,
          intersect: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const d = w.config.series[seriesIndex].data[dataPointIndex]
            const s = dayjs(d.meta.beginTs)
            const e = dayjs(d.meta.endTs)
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
    },

    // Count devices only for total mode
    deviceCounts() {
      if (!this.tripsParsed || !this.tripsParsed.length) return {}
      const counts = {}
      this.tripsParsed.forEach((t) => {
        const device = t.courierDevice || 'Unknown'
        counts[device] = (counts[device] || 0) + 1
      })
      return counts
    },

    // Prepare ApexChart series
    deviceChartSeries() {
      const top3 = Object.entries(this.deviceCounts)
        .sort((a, b) => b[1] - a[1]) // sort by count desc
        .slice(0, 3)
        .map(([_, count]) => count)

      return [
        { name: 'Deliveries', data: top3 }
      ]
    },

    // Prepare ApexChart options
    deviceChartOptions() {
      const top3 = Object.entries(this.deviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([device]) => device)
      return {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            filter: {
              type: 'none'
            }
          }
        },
        plotOptions: { bar: { horizontal: true, barHeight: '50%' } },
        dataLabels: {
          enabled: true,
          offsetX: 4,
          style: {
            colors: ['#000']
          },
          formatter: val => val,
          textAnchor: 'start'
        },
        xaxis: {
          categories: top3
        },
        yaxis: {}
      }
    }
  },
  watch: {
    itemsComputed: {
      immediate: true,
      handler(items) {
        const byDay = {}

        items.forEach((s) => {
          const beginTs = dayjs(
            s.begin_timestamp_utc || s.begin
          ).valueOf()
          const endTs = dayjs(
            s.end_timestamp_utc || s.end
          ).valueOf()
          if (!beginTs || !endTs || endTs <= beginTs) return

          const start = dayjs(beginTs)
          const end = dayjs(endTs)

          const parts = start.isSame(end, 'day')
            ? [{ beginTs, endTs }]
            : [
                { beginTs, endTs: start.endOf('day').valueOf() },
                { beginTs: end.startOf('day').valueOf(), endTs }
              ]

          parts.forEach((p) => {
            const key = dayjs(p.beginTs).format('YYYY-MM-DD')
            if (!byDay[key]) byDay[key] = []
            byDay[key].push({
              beginTs: p.beginTs,
              endTs: p.endTs,
              earner_state: s.state || 'open',
              raw: s
            })
          })
        })

        Object.keys(byDay).forEach((key) => {
          byDay[key] = this.filterEdgeOfflineShifts(byDay[key])
        })

        this.shiftsByDayCache = { ...byDay }
        if (this.periodReady) {
          this.recomputePeriodCaches()
        }
      }
    },

    payments: {
      immediate: true,
      handler(items) {
        const byDay = {}
        items.forEach((p) => {
          const key = dayjs(p.recognizeTimestampLocal).format('YYYY-MM-DD')
          if (!byDay[key]) byDay[key] = []
          byDay[key].push(p)
        })
        this.paymentsByDayCache = byDay
        this.recomputePeriodCaches()
      }
    },

    mode() {
      this.recomputePeriodCaches()
    },
    periodStart: 'recomputePeriodCaches',
    periodEnd: 'recomputePeriodCaches'
  },
  mounted() {
    // Continue tutorial if needed
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }
    periodStore.initFromTrips(this.tripsParsed)

    this.$nextTick(() => {
      this.periodReady = true
      this.recomputePeriodCaches()
    })

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
     * De-toggle info tooltip for a given key (e.g. 'distance' or 'avgTime')
     * @param key
     */
    toggleInfo(key) {
      this.openInfo = this.openInfo === key ? null : key
    },

    /**
     * Close any open info tooltip
     */
    closeInfo() {
      this.openInfo = null
    },

    /**
     * Handle day selection from MonthlyCalendar
     */
    onSelectDay(date) {
      periodStore.setMode('week')

      this.selectedCalendarDate = date

      // Compute the Monday–Sunday of that date
      const clicked = dayjs(date)
      const monday = clicked.startOf('week').add(1, 'day') // Monday
      const sunday = monday.add(6, 'day').endOf('day')

      // Update the store
      periodStore.setPeriod(monday.toISOString(), sunday.toISOString())

      // Optional: redraw chart immediately
      this.redraw()
    },

    filterEdgeOfflineShifts(shifts) {
      if (!shifts || !shifts.length) return []

      const sorted = [...shifts].sort((a, b) => a.beginTs - b.beginTs)

      // Find first non-offline shift
      let startIndex = 0
      while (startIndex < sorted.length && sorted[startIndex].earner_state === 'offline') {
        startIndex++
      }

      // Find last non-offline shift
      let endIndex = sorted.length - 1
      while (endIndex >= 0 && sorted[endIndex].earner_state === 'offline') {
        endIndex--
      }

      // Return only the shifts from first to last non-offline shift
      return sorted.slice(startIndex, endIndex + 1)
    },

    /**
     * Recompute all period caches
     */
    recomputePeriodCaches() {
      if (!this.periodReady) return
      const { start, end } = this.periodRange
      const startKey = start.format('YYYY-MM-DD')
      const endKey = end.format('YYYY-MM-DD')

      /* -------- shifts -------- */
      this.shiftsThisPeriodCache = Object.keys(this.shiftsByDayCache)
        .filter(d => d >= startKey && d <= endKey)
        .flatMap(d => this.shiftsByDayCache[d])

      /* -------- payments -------- */
      this.paymentsThisPeriodCache = Object.keys(this.paymentsByDayCache)
        .filter(d => d >= startKey && d <= endKey)
        .flatMap(d => this.paymentsByDayCache[d])

      /* -------- daily stats -------- */
      const stats = {}
      this.paymentsThisPeriodCache.forEach((p) => {
        const k = dayjs(p.recognizeTimestampLocal).format('YYYY-MM-DD')
        if (!stats[k]) stats[k] = { earnings: 0, minutes: 0 }
        stats[k].earnings += Number(p.amountLocal) || 0
      })

      this.shiftsThisPeriodCache.forEach((s) => {
        const k = dayjs(s.beginTs).format('YYYY-MM-DD')
        if (!stats[k]) stats[k] = { earnings: 0, minutes: 0 }
        if (s.earner_state !== 'offline') {
          stats[k].minutes += (s.endTs - s.beginTs) / 60000
        }
      })

      this.dailyStatsCache = { ...stats }

      // Prepare ranked payments by day
      const ranked = Object.entries(stats).map(([date, v]) => ({
        date,
        amount: v.earnings,
        hours: +(v.minutes / 60).toFixed(1)
      }))
      ranked.sort((a, b) => b.amount - a.amount)

      this.paymentsByDayTotalCache = ranked
      this.top5DaysCache = ranked.slice(0, 5)

      /* -------- timeline -------- */
      this.timelineSeriesCache = this.buildTimeline(this.shiftsThisPeriodCache)
    },

    /**
     * Build timeline chart series from shifts
     */
    buildTimeline(shifts) {
      const colors = {
        offline: '#ccc',
        open: '#4caf50',
        enroute: '#ff9800',
        ontrip: '#2196f3'
      }

      const map = {}
      Object.keys(colors).forEach((k) => {
        map[k] = { name: k, color: colors[k], data: [] }
      })

      // Collect data by day first
      const dayMap = {}
      shifts.forEach((s) => {
        const d = new Date(s.beginTs)
        const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
        const day = WEEKDAYS[dow]
        const state = (s.state || s.earner_state || 'open').toLowerCase()
        const start = d.getHours() * 60 + d.getMinutes()
        const end = start + (s.endTs - s.beginTs) / 60000

        if (!dayMap[day]) dayMap[day] = {}
        if (!dayMap[day][state]) dayMap[day][state] = []

        dayMap[day][state].push({
          x: day,
          y: [start, end],
          meta: s
        })
      })

      // Ensure every day has an array for each state
      WEEKDAYS.forEach((day) => {
        if (!dayMap[day]) dayMap[day] = {}
        Object.keys(colors).forEach((state) => {
          if (!dayMap[day][state]) dayMap[day][state] = []
          // Filter edge offline shifts for this state
          if (state === 'offline') {
            dayMap[day][state] = this.filterEdgeOfflineShifts(dayMap[day][state])
          }
        })
      })

      // Build series arrays
      Object.keys(map).forEach((state) => {
        WEEKDAYS.forEach((day) => {
          const data = dayMap[day][state]

          // If offline and there are no shifts left after filtering, add placeholder
          if (state === 'offline' && (!data || !data.length)) {
            map[state].data.push({
              x: day,
              y: [0, 0],
              meta: { empty: true }
            })
          } else {
            map[state].data.push(...data)
          }
        })
      })

      return Object.values(map)
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
      const startTs = s.beginTs
      const endTs = s.endTs

      if (!startTs || !endTs) return []

      const start = dayjs(startTs)
      const end = dayjs(endTs)

      // Same day → no split
      if (start.isSame(end, 'day')) {
        return [{ beginTs: startTs, endTs, raw }]
      }

      // Split into two parts
      const endOfDayTs = start.endOf('day').valueOf()
      const startOfNextDayTs = end.startOf('day').valueOf()

      return [
        { beginTs: startTs, endTs: endOfDayTs, raw },
        { beginTs: startOfNextDayTs, endTs, raw }
      ]
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: grid;
  width: 98%;
  grid-template-rows: auto 16% 1fr;
  grid-template-columns: 70% 1fr;
  gap: 16px;
  margin-left: 12px;
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
  border: 1px solid #bbb;
  border-radius: 0;
  background: #fff;
  color: #333;
  cursor: pointer;
  font-size: 0.85rem;
}

.switch-btn.active {
  background: #e6e6e6;
  font-weight: 600;
  box-shadow: inset 0 1px 2px rgba(0,0,0,.15);
}

.period-descriptions {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  padding-top: 45px;
  padding-left: 0;
  margin-top: 0;
}

.period-desc {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
  margin: 0;
}

.week-nav {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 32px;
}

.week-nav-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.nav-btn {
  padding: 4px 12px;
  border: 1px solid #bbb;
  border-radius: 0;
  background: #fff;
  cursor: pointer;
  font-size: 1rem;

  box-shadow: 0 1px 2px rgba(0,0,0,.15);

  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.05s ease;
}

.nav-btn:hover, .switch-btn:hover {
  background: #f2f2f2;
  box-shadow:
    0 3px 1px -2px rgba(0,0,0,.25),
    0 2px 4px 0 rgba(0,0,0,.20),
    0 1px 8px 0 rgba(0,0,0,.18);
  transform: translateY(-1px);
}

.week-label {
  width: 240px;
  padding: 4px 12px;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #bbb;
}

.week-label.mode-week {
  background: #e3f2fd;
  border-color: #2196f377;
  color: #0d47a1;
}

.week-label.mode-month {
  background: #e8f5e9;
  border-color: #4caf5077;
  color: #1b5e20;
}

.week-label.mode-total {
  width: 280px;
  background: #fff3e0;
  border-color: #ff9800bb;
  color: #e65100;
}

/* Base box style */
.box {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
            0 2px 2px 0 rgba(0,0,0,.19),
            0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
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
  padding-bottom: 16px;
}

/* TIMELINE CHART (bottom left) */
.box2 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
}

.box2 div {
  height: 100%;
}

/* RIGHT COLUMN (bottom right) */
.right-column {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
}

.box3,
.box4 {
  margin-bottom: 16px;
}

.box3,
.box4,
.box5 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-top: 16px;
}

.box3 p,
.box4 p {
  margin: 8px 0;
}

.box5-title {
  text-align: center;
  margin: 0;
  margin-top: 8px;
}

:deep(.apexcharts-rangebar-area:hover) {
  stroke: #00000066;
  stroke-width: 2px;
}

.metric-title {
  display: flex;
  gap: 8px;
  position: relative;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ccc;
  border: 1px solid #999;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  line-height: 1;
  margin-top: 5px;
  cursor: pointer;
  padding: 0;
  appearance: none;
}

.info-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  padding: 8px 10px;
  width: max-content;
  max-width: 220px;
  background: #333;
  color: #fff;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.2;
  text-align: center;
  z-index: 20;
}

.info-icon:hover {
  background-color: #999;
}

/* legend */
.legend { display:flex; gap:12px; margin-top: 10px; justify-content: center; }
.legend-item { display:flex; align-items:center; gap:8px; font-size: .9rem; }
.color-box { width: 14px; height: 14px; border-radius: 3px; display:inline-block; }
.color-box.offline { background-color: #ccc; }
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
    width: 94%;
  }

  .period-switch {
    position: static;
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 20px;
  }

  .period-descriptions {
    grid-column: 1 / 2;
    grid-row: auto;
    padding-top: 0;
    margin-top: 0;
    text-align: center;
  }

  .week-nav {
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 20px;
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

  .metric-title {
    justify-content: center;
  }
}
</style>
