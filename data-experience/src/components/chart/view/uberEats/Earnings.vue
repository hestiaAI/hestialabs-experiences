<template>
  <div class="earnings-view">
    <div class="controls-bar">
      <!-- PERIOD MODE SWITCH -->
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
          📅 Weekly earnings: Your total and average earnings per day for this week
        </div>
        <div v-if="mode === 'month'" class="period-desc">
          📆 Monthly earnings: Daily earnings overview for the selected month
        </div>
        <div v-if="mode === 'total'" class="period-desc">
          📊 All-time earnings: Your earnings history grouped by year
        </div>
      </div>

      <!-- WEEK / MONTH NAVIGATION -->
      <div class="week-nav">
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

    <div class="box header-row">
      <div class="earnings-adjusted">
        <h2>Earnings Breakdown</h2>
        <div class="toggle-wrapper">
          <span class="switch-label" :class="{ active: !showAvg }">
            Total
          </span>

          <label class="switch">
            <input type="checkbox" v-model="showAvg" />
            <span class="slider"></span>
          </label>

          <span class="switch-label" :class="{ active: showAvg }">
            Avg / Hour
          </span>
        </div>
      </div>
      <div class="chart-container">
        <!-- Overlay if no earnings in current view -->
        <div v-if="!hasEarningsData" class="chart-overlay">
          <div class="overlay-box">
            <div class="overlay-title">No earnings data</div>
            <div class="overlay-text">
              Check whether your dataset is empty, or select another period.
            </div>
          </div>
        </div>

        <ApexChart
          type="bar"
          height="350"
          :options="chartOptions"
          :series="chartSeries"
        />
      </div>
      <div class="legend legend-earnings">
        <div class="legend-item">
          <span class="color-box earnings"></span> Earnings (no tips)
        </div>
        <div class="legend-item">
          <span class="color-box tips"></span> Tips
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { periodStore } from './store/periodStore'
import mixin from '@/components/chart/view/mixin'

dayjs.extend(customParseFormat)

export default {
  name: 'EarningsView',
  components: {
    ApexChart: VueApexCharts
  },
  mixins: [mixin],
  props: {
    data: { type: Array, required: false }
  },

  data() {
    return {
      showAvg: false,
      normalizedPaymentsCache: [],
      earningsByDayCache: {},
      earningsByYearCache: {},
      avgEarningsByDayCache: {},
      avgEarningsByYearCache: {}
    }
  },

  computed: {
    // Period mode metadata
    mode: {
      get() { return periodStore.mode },
      set(v) { periodStore.mode = v }
    },

    // Period start as dayjs object
    periodStart() {
      return dayjs(periodStore.periodStart)
    },

    // Period end as dayjs object
    periodEnd() {
      return dayjs(periodStore.periodEnd)
    },

    // Period label for display
    periodLabel() {
      if (this.mode === 'total') {
        const { allTimeStart, allTimeEnd } = periodStore

        if (!allTimeStart || !allTimeEnd) {
          return 'All time'
        }

        return `${dayjs(allTimeStart).format('DD.MM.YYYY')} – ${dayjs(allTimeEnd).format('DD.MM.YYYY')} (All time)`
      }
      if (this.mode === 'month') return this.periodStart.format('MMMM YYYY')
      return `${this.periodStart.format('DD.MM')} – ${this.periodEnd.format('DD.MM.YYYY')}`
    },

    // Uber Eats specific block
    block() {
      return this.values?.[0] ?? {}
    },

    // online shifts array (raw objects from CSV)
    shifts() {
      return this.block.online?.items ?? []
    },

    // payments/trips from pipeline
    payments() {
      return this.block.payments?.items ?? []
    },

    // true if at least one day has earnings > 0
    hasEarningsData() {
      return this.chartData.some(d => (d.tips ?? 0) > 0 || (d.nonTips ?? 0) > 0)
    },

    // Earnings grouped per day (cached)
    chartData() {
      if (this.mode === 'total') {
        const src = this.showAvg ? this.avgEarningsByYearCache : this.earningsByYearCache
        return Object.keys(src).map((year) => {
          const entry = src[year] || { tips: 0, nonTips: 0 } // fallback
          return { date: year, tips: entry.tips, nonTips: entry.nonTips }
        })
      }

      return this.allDays.map((day) => {
        const entry = this.showAvg
          ? this.avgEarningsByDayCache[day]
          : this.earningsByDayCache[day]
        const safeEntry = entry || { tips: 0, nonTips: 0 } // fallback
        return { date: day, tips: safeEntry.tips, nonTips: safeEntry.nonTips }
      })
    },

    // Chart series data
    chartSeries() {
      return [
        { name: 'Earnings (no tips)', data: this.chartData.map(d => Number(d.nonTips.toFixed(2))) },
        { name: 'Tips', data: this.chartData.map(d => Number(d.tips.toFixed(2))) }
      ]
    },

    // Chart options
    chartOptions() {
      const currency = this.payments[0]?.currencyCode || 'CHF'
      return {
        chart: { stacked: true, toolbar: { show: false }, animations: { enabled: true }, dropShadow: { enabled: false } },
        states: { hover: { filter: { type: 'none' } }, active: { filter: { type: 'none' } } },
        dataLabels: { enabled: false },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
        xaxis: {
          categories: this.chartData.map((d) => {
            // if total mode → years only
            if (this.mode === 'total') return d.date

            const parsed = dayjs(d.date, 'DD.MM.YYYY')
            return parsed.format('ddd DD.MM.YY') // e.g. "Mon 01.03.21"
          }),
          labels: { rotate: -45 }
        },
        yaxis: { labels: { formatter: val => `${currency} ${val.toFixed(0)}` } },
        tooltip: { y: { formatter: val => `${currency} ${val.toFixed(2)}` } },
        legend: { show: false },
        colors: ['#2196f3', '#4caf50']
      }
    },

    // All days in the selected period as DD.MM.YYYY strings
    allDays() {
      const days = []
      let curTs = this.periodStart.valueOf()
      const endTs = this.periodEnd.valueOf()

      const ONE_DAY = 86400000

      while (curTs <= endTs) {
        const d = new Date(curTs)
        const dd = String(d.getDate()).padStart(2, '0')
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const yyyy = d.getFullYear()
        days.push(`${dd}.${mm}.${yyyy}`)
        curTs += ONE_DAY
      }

      return days
    },

    // Hours worked grouped per day
    hoursPerDay() {
      const out = {}

      this.shifts.forEach((s) => {
        const startTs = Date.parse(s.begin)
        const endTs = Date.parse(s.end)
        if (!startTs || !endTs || endTs <= startTs) return

        const key = this.formatDay(startTs)
        out[key] = (out[key] || 0) + (endTs - startTs) / 3600000
      })

      return out
    },

    // Earnings grouped per day
    earningsByDay() {
      const out = {}

      this.allDays.forEach((d) => {
        out[d] = { tips: 0, nonTips: 0 }
      })

      this.normalizedPaymentsCache.forEach((p) => {
        const bucket = out[p.day]
        if (!bucket) return

        if (p.isTip) bucket.tips += p.amount
        else bucket.nonTips += p.amount
      })

      return out
    },

    // Earnings grouped per year
    earningsByYear() {
      const out = {}

      this.normalizedPaymentsCache.forEach((p) => {
        if (!out[p.year]) out[p.year] = { tips: 0, nonTips: 0 }

        if (p.isTip) out[p.year].tips += p.amount
        else out[p.year].nonTips += p.amount
      })

      return out
    },

    // Avg earnings per hour
    avgEarningsPerDay() {
      const out = {}

      this.allDays.forEach((date) => {
        const hours = this.hoursPerDay[date] || 0
        const e = this.earningsByDay[date]

        out[date] = hours > 0
          ? {
              tips: e.tips / hours,
              nonTips: e.nonTips / hours
            }
          : { tips: 0, nonTips: 0 }
      })

      return out
    },

    // Avg earnings per year
    avgEarningsByYear() {
      const hoursByYear = {}

      this.shifts.forEach((s) => {
        const startTs = Date.parse(s.begin)
        const endTs = Date.parse(s.end)
        if (!startTs || !endTs || endTs <= startTs) return

        const year = new Date(startTs).getFullYear()
        hoursByYear[year] = (hoursByYear[year] || 0) + (endTs - startTs) / 3600000
      })

      const out = {}

      for (const year in this.earningsByYear) {
        const h = hoursByYear[year] || 0
        const e = this.earningsByYear[year]

        out[year] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      }

      return out
    }
  },
  watch: {
    values: {
      immediate: true,
      handler() {
        if (!this.values?.length) return

        // Normalize payments
        this.normalizedPaymentsCache = this.payments.map((p) => {
          const ts = Date.parse(p.recognizeTimestampLocal)
          return {
            day: this.formatDay(ts), // make sure to format day
            year: new Date(ts).getFullYear(),
            amount: Number(p.amountLocal || 0),
            isTip: (p.category || '').toLowerCase() === 'tip'
          }
        })

        // Precompute earnings and averages
        this.precomputeData()

        // Redraw chart
        this.drawChart()
      }
    }
  },
  mounted() {
    // Continue tutorial if applicable
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    this.setPeriodMode(this.mode)

    if (this.values?.length) {
      this.precomputeData()
      this.drawChart()
    }
  },
  methods: {
    /**
     * Transform timestamp to DD.MM.YYYY format
     * @param ts {number}
     */
    formatDay(ts) {
      const d = new Date(ts)
      return (
        String(d.getDate()).padStart(2, '0') + '.' +
        String(d.getMonth() + 1).padStart(2, '0') + '.' +
        d.getFullYear()
      )
    },

    /**
     * Compute hours worked caches
     */
    computeHoursCache() {
      const hoursDay = {}
      const hoursYear = {}
      this.shifts.forEach((s) => {
        const startTs = Date.parse(s.begin)
        const endTs = Date.parse(s.end)
        if (!startTs || !endTs || endTs <= startTs) return
        const day = this.formatDay(startTs)
        const year = new Date(startTs).getFullYear()
        hoursDay[day] = (hoursDay[day] || 0) + (endTs - startTs) / 3600000
        hoursYear[year] = (hoursYear[year] || 0) + (endTs - startTs) / 3600000
      })
      this.hoursPerDayCache = hoursDay
      this.hoursPerYearCache = hoursYear
    },

    /**
     * Precompute earnings and averages caches
     */
    precomputeData() {
      // Normalize payments
      if (!this.normalizedPaymentsCache.length) {
        this.normalizedPaymentsCache = this.payments.map((p) => {
          const ts = Date.parse(p.recognizeTimestampLocal)
          return {
            day: this.formatDay(ts),
            year: new Date(ts).getFullYear(),
            amount: Number(p.amountLocal || 0),
            isTip: (p.category || '').toLowerCase() === 'tip'
          }
        })
      }

      // Earnings by day/year
      this.earningsByDayCache = {}
      this.earningsByYearCache = {}

      this.allDays.forEach((d) => { this.earningsByDayCache[d] = { tips: 0, nonTips: 0 } })

      this.normalizedPaymentsCache.forEach((p) => {
        if (!this.earningsByDayCache[p.day]) this.earningsByDayCache[p.day] = { tips: 0, nonTips: 0 }
        if (!this.earningsByYearCache[p.year]) this.earningsByYearCache[p.year] = { tips: 0, nonTips: 0 }

        if (p.isTip) {
          this.earningsByDayCache[p.day].tips += p.amount
          this.earningsByYearCache[p.year].tips += p.amount
        } else {
          this.earningsByDayCache[p.day].nonTips += p.amount
          this.earningsByYearCache[p.year].nonTips += p.amount
        }
      })

      this.computeHoursCache()

      // Avg earnings caches
      this.avgEarningsByDayCache = {}
      this.avgEarningsByYearCache = {}

      for (const d in this.earningsByDayCache) {
        const e = this.earningsByDayCache[d]
        const h = this.hoursPerDayCache[d] || 0
        this.avgEarningsByDayCache[d] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      }

      for (const y in this.earningsByYearCache) {
        const e = this.earningsByYearCache[y]
        const h = this.hoursPerYearCache[y] || 0
        this.avgEarningsByYearCache[y] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      }
    },

    /**
     * Set the period mode (week, month, total)
     * @param mode {string}
     */
    setPeriodMode(mode) {
      periodStore.setMode(mode)

      if (mode === 'total') return

      if (mode === 'month') {
        const start = this.periodStart.startOf('month')
        const end = this.periodStart.endOf('month')
        return periodStore.setPeriod(start.toISOString(), end.toISOString())
      }

      // WEEK MODE
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
        const start = this.periodStart.subtract(1, 'month').startOf('month')
        const end = start.endOf('month')
        return periodStore.setPeriod(start.toISOString(), end.toISOString())
      }

      const start = this.periodStart.subtract(7, 'day')
      const end = start.add(6, 'day').endOf('day')
      periodStore.setPeriod(start.toISOString(), end.toISOString())
    },

    /**
     * Navigate to next period
     */
    nextPeriod() {
      if (this.mode === 'total') return

      if (this.mode === 'month') {
        const start = this.periodStart.add(1, 'month').startOf('month')
        const end = start.endOf('month')
        return periodStore.setPeriod(start.toISOString(), end.toISOString())
      }

      const start = this.periodStart.add(7, 'day')
      const end = start.add(6, 'day').endOf('day')
      periodStore.setPeriod(start.toISOString(), end.toISOString())
    }
  }
}
</script>

<style scoped>
.earnings-view {
  margin: 8px;
}

.controls-bar {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 16px;
}

.period-switch {
  grid-column: 1 / 2;
  grid-row: 1;
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
  grid-column: 1 / -1;
  grid-row: 2;
  padding-top: 0;
  padding-left: 0;
  margin-bottom: 16px;
}

.period-desc {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
  margin: 0;
}

.week-nav {
  grid-column: 3 / 4;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  width: 324;
  background: #fff3e0;
  border-color: #ff9800bb;
  color: #e65100;
}

.box {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.19),
              0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
  padding: 20px;
  font-size: 1.2rem;
}

.chart-container {
  width: 100%;
  height: 350px;
  margin-bottom: 4px;
  position: relative; /* important for overlay */
}

.chart-overlay {
  position: absolute;
  inset: 0;
  background: rgba(240, 240, 240, 0.6);
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Fix: avoid stretching due to parent rules */
.chart-overlay,
.chart-overlay * {
  height: auto !important;
}

.chart-overlay .overlay-box {
  pointer-events: auto;
  text-align: center;
  margin: 4px;
}

.chart-overlay .overlay-title {
  font-weight: 700;
}

.chart-overlay .overlay-text {
  font-size: 13px;
  opacity: 0.85;
}

.header-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.earnings-adjusted {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
}

.toggle-label {
  width: 120px;
}

.switch-label {
  font-size: 0.9rem;
  color: #888;
  margin: 0 8px;
  transition: color 0.2s ease, font-weight 0.2s ease;
}

.switch-label.active {
  color: #2196f3;
  font-weight: 600;
}

/* Simple toggle switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px; width: 18px;
  left: 3px; bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.toggle-label {
  margin-left: 8px;
  font-size: 0.9rem;
  color: #333;
}

.chart-container {
  width: 100%;
  height: 350px;
  margin-bottom: 4px;
}

:deep(.apexcharts-bar-area:hover) {
  stroke: #00000066;
  stroke-width: 2px;
}

:deep(.apexcharts-xaxis-hover) {
  display: none;
}

.legend {
  display: flex;
  width: 100%;
  gap: 12px;
  margin-top: 10px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .9rem;
}

.color-box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
}

/* Colors for earnings legend */
.color-box.earnings { background-color: #2196f3; }
.color-box.tips { background-color: #4caf50; }

/* Mobile layout */
@media (max-width: 768px) {
  .earnings-adjusted {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .controls-bar > * {
    grid-column: 1 / -1;
  }

  .controls-bar {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    margin-bottom: 20px;
  }

  .period-switch {
    grid-row: 1;
    justify-content: center;
  }

  .period-descriptions {
    grid-row: 2;
    padding-top: 20px;
  }

  .period-desc {
    text-align: center;
  }

  .week-nav {
    grid-row: 3;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
