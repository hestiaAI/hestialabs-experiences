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
        <svg ref="svg" class="timeline-svg"></svg>
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
import * as d3 from 'd3'
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

/**
 * OverView.vue
 * - expects pipeline output: this.values[0] = { online, payments, trips, props }
 * - uses this.itemsComputed (derived from values[0].online.items)
 */
export default {
  name: 'OverView',
  components: { MonthlyCalendar, TopDays },
  mixins: [mixin],
  data() {
    return {
      svgSize: { width: 800, height: 450 },
      resizeObserver: null
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
      if (this.mode === 'total') return 'All time'
      if (this.mode === 'month') {
        return this.periodStart.format('MMMM YYYY')
      }

      return `${this.periodStart.format('DD.MM')} – ${this.periodEnd.format('DD.MM.YYYY')}`
    },

    // block is the wrapper object from the combined pipeline
    block() {
      console.log(this.values)
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
    }
  },
  watch: {
    // watch for pipeline values changing
    values: {
      handler() {
        // small debounce
        if (typeof this.redraw === 'function') {
          this.redraw()
        }
      },
      deep: true
    },

    // watch mode change
    mode() {
      this.$nextTick(() => this.redraw())
    },

    // watch period start change
    periodStart() {
      this.$nextTick(() => this.redraw())
    },

    // watch period end change
    periodEnd() {
      this.$nextTick(() => this.redraw())
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

    // initial draw
    this.redraw()

    // Resize observer to detect tab visibility changes
    this.resizeObserver = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect

      // If width > 0, the tab is now visible → redraw
      if (width > 0) {
        this.$nextTick(() => this.redraw())
      }
    })

    this.resizeObserver.observe(this.$el)

    // resize observer
    window.addEventListener('resize', this.onResize)
  },
  activated() {
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
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
    },

    // Draw the week timeline using D3
    drawChart() {
      if (this.mode !== 'week') return
      const svg = d3.select(this.$refs.svg)
      svg.selectAll('*').remove()

      const container = this.$refs.svg.parentElement
      const width = container.getBoundingClientRect().width
      const height = 400
      this.svgSize = { width, height }
      svg.attr('width', width).attr('height', height)

      const margin = { top: 20, right: 20, bottom: 30, left: 40 }
      const innerWidth = width - margin.left - margin.right
      const innerHeight = height - margin.top - margin.bottom

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      // weekdays labels 0..6 -> Mon..Sun
      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      // x scale: time from 00:00 to 24:00 (we normalize to an arbitrary date)
      const xScale = d3.scaleLinear()
        .domain([0, 24 * 60])
        .range([0, innerWidth])

      // y scale: map weekday index to vertical position
      const yScale = d3.scaleBand()
        .domain(d3.range(0, 7))
        .range([0, innerHeight])
        .padding(0.3)

      // Draw weekday labels
      g.selectAll('.weekday-label')
        .data(weekdays)
        .enter()
        .append('text')
        .attr('class', 'weekday-label')
        .attr('x', -10)
        .attr('y', (_, i) => yScale(i) + yScale.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .style('font-size', '14px')
        .text(d => d)

      // Prepare shifts grouped by weekday index
      const shifts = this.shiftsThisPeriod.map((s) => {
        const start = dayjs(s.begin_timestamp_utc)
        const end = dayjs(s.end_timestamp_utc)
        const dow = start.day() === 0 ? 6 : start.day() - 1 // Mon=0..Sun=6
        // preserve state
        return {
          startMinutes: start.hour() * 60 + start.minute(),
          endMinutes: end.hour() * 60 + end.minute(),
          dow,
          state: (s.state || 'open').toLowerCase(),
          meta: s
        }
      })

      // color map
      const stateColors = { offline: '#cccccc', open: '#4caf50', enroute: '#ff9800', ontrip: '#2196f3' }

      // Draw bars
      g.selectAll('.shift-bar')
        .data(shifts)
        .enter()
        .append('rect')
        .attr('class', 'shift-bar')
        .attr('x', d => xScale(d.startMinutes))
        .attr('width', d => Math.max(0, xScale(d.endMinutes) - xScale(d.startMinutes)))
        .attr('y', d => yScale(d.dow))
        .attr('height', yScale.bandwidth())
        .attr('fill', d => stateColors[d.state] || '#888')
        .attr('rx', 3)
        .attr('ry', 3)
        .on('mousemove', (event, d) => {
          const bounds = this.$el.getBoundingClientRect()

          const localX = event.clientX - bounds.left
          const localY = event.clientY - bounds.top

          // show tooltip
          const tooltip = d3.select(this.$el).selectAll('.ov-tooltip').data([d])
          const tEnter = tooltip.enter().append('div').attr('class', 'ov-tooltip')
          tEnter.merge(tooltip)
            .style('position', 'absolute')
            .style('pointer-events', 'none')
            .style('background', 'white')
            .style('border', '1px solid #ccc')
            .style('padding', '6px')
            .style('border-radius', '6px')
            .style('font-size', '12px')
            .html(() => {
              const s = dayjs(d.meta.begin_timestamp_utc)
              const e = dayjs(d.meta.end_timestamp_utc)
              const dateFormatted = s.format('DD.MM.YY')
              const timeRange = `${s.format('HH:mm')} - ${e.format('HH:mm')}`
              const cap = s => typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : ''
              const stateLabel = cap(d.state)
              return `<div style="color: green;"><strong>${stateLabel}</strong></div>
                      <div>${dateFormatted}: ${timeRange}</div>`
            })
            .style('left', `${localX + 24}px`)
            .style('top', `${localY + 116}px`)
        })
        .on('mouseleave', () => {
          d3.select(this.$el).selectAll('.ov-tooltip').remove()
        })

      // Create ticks at [0, 180, 360, ..., 1440] minutes
      const tickValues = d3.range(0, 24 * 60 + 1, 180) // 180 min = 3h

      const xAxis = d3.axisBottom(xScale)
        .tickValues(tickValues)
        .tickFormat((d) => {
          const h = Math.floor(d / 60)
          const m = d % 60
          return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
        })

      g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
    },

    // redraw on data changes or resize
    redraw() {
      this.drawChart()
    },

    // handle window resize
    onResize() {
      this.redraw()
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

.chart-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
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
