<template>
  <div class="layout-container">
    <div class="period-switch">
      <button
        v-for="p in ['week', 'month', 'total']"
        :key="p"
        :class="['switch-btn', { active: mode === p }]"
        @click="periodStore.setMode(p)"
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
        <div>{{ totalHours }}</div>
      </div>

      <div>
        <strong>Number of Deliveries</strong>
        <div>{{ deliveryCount }}</div>
      </div>
    </div>

    <!-- BOX 2 → Timeline chart -->
    <div class="box box2">
      <TimelineChart
        v-if="mode === 'week'"
        :height="396"
        :shifts="shiftsThisPeriodCache"
        :showEmptyOverlay="!shiftsThisPeriodCache || shiftsThisPeriodCache.length === 0"
        :showLegend="true"
      />

      <div v-else-if="mode === 'month' && periodReady && periodStart.isValid()">
        <MonthlyCalendar
          :key="`ue-${calendarYear}-${calendarMonth}-${periodStore.periodStart}-${periodStore.periodEnd}`"
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
          <strong>Distance per trip</strong>
          <button class="info-icon" type="button" @click.stop="toggleInfo('distTrip')" aria-label="Info about distance per trip">i</button>
          <span v-if="openInfo === 'distTrip'" class="info-tooltip">
            Min / average / max distance of one completed trip in the selected period.
          </span>
        </p>

        <TripRangeChart
          label="Distance per trip"
          unit="km"
          :min="Number(tripDistanceStats.min.toFixed(2))"
          :avg="Number(tripDistanceStats.avg.toFixed(2))"
          :max="Number(tripDistanceStats.max.toFixed(2))"
          :height="120"
        />
      </div>

      <div class="box box5">
        <p class="metric-title">
          <strong>Delivery time per trip</strong>
          <button class="info-icon" type="button" @click.stop="toggleInfo('timeTrip')" aria-label="Info about delivery time per trip">i</button>
          <span v-if="openInfo === 'timeTrip'" class="info-tooltip">
            Min / average / max delivery time (pickup → dropoff) for completed trips in the selected period.
          </span>
        </p>

        <TripRangeChart
          label="Delivery time per trip"
          unit="min"
          :min="Math.round(tripDeliveryTimeStats.min)"
          :avg="Math.round(tripDeliveryTimeStats.avg)"
          :max="Math.round(tripDeliveryTimeStats.max)"
          :height="120"
        />
      </div>

      <div class="box box6" v-if="mode === 'total'">
        <p class="box5-title"><strong>Most Used Devices</strong></p>
        <DeviceChart
          :height="200"
          :categories="deviceTop3Categories"
          :counts="deviceTop3Counts"
        />
      </div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isoWeek from 'dayjs/plugin/isoWeek'
import MonthlyCalendar from './MonthlyCalendar.vue'
import TimelineChart from './charts/TimelineChart.vue'
import TripRangeChart from './charts/TripRangeChart.vue'
import DeviceChart from './charts/DeviceChart.vue'
import TopDays from './TopDays.vue'
import mixin from '@/components/chart/view/mixin'
import { periodStore } from './store/periodStore'
import { createTour } from './onboarding/tour'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(isoWeek)

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
    TimelineChart,
    TripRangeChart,
    DeviceChart
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
      paymentsByDayTotalCache: [],
      top5DaysCache: [],

      periodReady: false,
      selectedCalendarDate: null,
      openInfo: null,
      fromCalendarClick: false,
      periodStore
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

        return `${dayjs(allTimeStart).format('DD.MM.YYYY')} – ${dayjs(allTimeEnd).format('DD.MM.YYYY')} (All time)`
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

    // currency guess: fallback 'CHF'
    currency() {
      // Try to infer from payments if present
      if (this.payments.length > 0 && this.payments[0].currencyCode) {
        return this.payments[0].currencyCode
      }
      return this.block.currency ?? 'CHF'
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

      return this.formatMinutesAsHoursMin(minutes)
    },

    // distance stats for trips in the selected period
    tripDistanceStats() {
      const values = this.tripsInPeriod
        .map(t => Number(t.dropoffDeliveryDistanceKm))
        .filter(v => Number.isFinite(v) && v >= 0)

      if (!values.length) return { min: 0, avg: 0, max: 0 }

      const min = Math.min(...values)
      const max = Math.max(...values)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      return { min, avg, max }
    },

    // delivery time stats for trips in the selected period
    tripDeliveryTimeStats() {
      const values = this.tripsInPeriod
        .map((t) => {
          const start = dayjs(t.courierBegintripTimestampLocal)
          const end = dayjs(t.courierDropoffTimestampLocal)
          if (!start.isValid() || !end.isValid() || end.isBefore(start)) return null
          return end.diff(start, 'minute')
        })
        .filter(v => Number.isFinite(v) && v >= 0)

      if (!values.length) return { min: 0, avg: 0, max: 0 }

      const min = Math.min(...values)
      const max = Math.max(...values)
      const avg = values.reduce((a, b) => a + b, 0) / values.length
      return { min, avg, max }
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
      const monday = now.startOf('isoWeek')
      return {
        start: monday,
        end: monday.add(6, 'day').endOf('day')
      }
    },

    // Shifts filtered for the time period & split overnight
    shiftsThisPeriod() {
      return this.shiftsThisPeriodCache
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

    // Top 3 devices by count
    deviceTop3() {
      return Object.entries(this.deviceCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    },

    // Categories (device names) for the top 3 devices
    deviceTop3Categories() {
      return this.deviceTop3.map(([device]) => device)
    },

    // Counts for the top 3 devices
    deviceTop3Counts() {
      return this.deviceTop3.map(([_, count]) => count)
    },

    // Date of the latest trip (for onboarding tour targeting)
    latestTripDate() {
      if (!this.tripsParsed.length) return null

      return this.tripsParsed
        .map(t => dayjs(t.courierAcceptTimestampLocal || t.beginTimestampLocal || t.courierBegintripTimestampLocal))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0] || null
    }
  },
  watch: {
    itemsComputed: {
      immediate: true,
      handler(items) {
        const byDay = {}

        items.forEach((s) => {
          const _begin = s.begin || s.begin_timestamp_local || s.begin_timestamp_utc
          const _end = s.end || s.end_timestamp_local || s.end_timestamp_utc

          const beginTs = this.parseMaybeLocalTimestamp(_begin).valueOf()
          const endTs = this.parseMaybeLocalTimestamp(_end).valueOf()
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

    'periodStore.mode': function(newVal) {
      if (this.fromCalendarClick) {
        this.fromCalendarClick = false
        this.recomputePeriodCaches()
        return
      }

      const currentDate = dayjs(periodStore.periodStart)
      const base = currentDate.isValid()
        ? currentDate
        : this.latestTripDate

      if (!base || !base.isValid()) return

      if (newVal === 'month') {
        const monthStart = base.startOf('month')
        const monthEnd = base.endOf('month')
        periodStore.setPeriod(monthStart.toISOString(), monthEnd.toISOString())
        return
      }

      if (newVal === 'total') {
        this.recomputePeriodCaches()
        return
      }

      const monday = this.getMondayOf(base)
      periodStore.setPeriod(
        monday.toISOString(),
        monday.add(6, 'day').endOf('day').toISOString()
      )
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

    if (this.latestTripDate) {
      if (periodStore.mode === 'month') {
        periodStore.setPeriod(
          this.latestTripDate.startOf('month').toISOString(),
          this.latestTripDate.endOf('month').toISOString()
        )
      } else if (periodStore.mode === 'week') {
        const monday = this.getMondayOf(this.latestTripDate)
        periodStore.setPeriod(
          monday.toISOString(),
          monday.add(6, 'day').endOf('day').toISOString()
        )
      }
    }

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
     * Parse a timestamp that may be in local time (without timezone) or UTC (with 'Z'), returning a dayjs object.
     * If the timestamp ends with 'Z', it's treated as UTC. Otherwise, it's treated as local time.
     * @param ts
     */
    parseMaybeLocalTimestamp(ts) {
      if (!ts) return dayjs('')

      return dayjs(String(ts).replace(/Z$/, ''))
    },

    /**
     * Get the Monday of the week for a given date
     * @param d
     */
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    /**
     * Handle day selection from MonthlyCalendar
     */
    onSelectDay(date) {
      const d = dayjs(date)
      if (!d.isValid()) return

      this.fromCalendarClick = true
      this.selectedCalendarDate = date

      const monday = this.getMondayOf(d)
      periodStore.setPeriod(
        monday.toISOString(),
        monday.add(6, 'day').endOf('day').toISOString()
      )
      periodStore.setMode('week')
    },

    /**
     * Format total minutes as "Xh YYmin"
     * @param totalMinutes
     */
    formatMinutesAsHoursMin(totalMinutes) {
      const mins = Math.max(0, Math.round(totalMinutes || 0))
      const hours = Math.floor(mins / 60)
      const minutes = mins % 60
      return `${hours}h ${minutes.toString().padStart(2, '0')}min`
    },

    /**
     * Filter out leading and trailing offline shifts, keeping only those between the first and last non-offline shift.
     * This helps clean up the timeline chart by removing irrelevant offline periods at the edges.
     * @param shifts
     */
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
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: grid;
  width: 98%;
  grid-template-rows: auto 108px 1fr;
  grid-template-columns: 70% 1fr;
  gap: 16px;
  margin-left: 12px;
  margin-bottom: 24px;
}

.layout-container > * {
  min-width: 0;
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
  width: 324px;
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
  height: 100%;
  min-height: 0;

  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-column > .box:last-child {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.box3 {
  padding: 6px 20px;
}

.box4,
.box5 {
  padding: 12px 14px 4px 6px;
}

.box4,
.box5,
.right-column {
  min-width: 0;
}

.box4 p,
.box5 p {
  padding-left: 14px;
  padding-right: 20px;
  margin: 0 !important;
}

.box4 div,
.box5 div {
  margin-top: -12px;
}

.box3,
.box4,
.box5,
.box6 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  overflow: hidden;
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

.box5 {
  min-width: 0;
  overflow: hidden;
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
