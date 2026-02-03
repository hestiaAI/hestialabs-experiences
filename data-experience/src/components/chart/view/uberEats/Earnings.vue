<template>
  <div class="earnings-view">
    <div class="controls-bar">
      <!-- FILTERS BUTTON -->
      <button
        class="switch-btn filters-btn"
        :class="{ open: showFilters }"
        @click="showFilters = !showFilters"
      >
        Filters
        <span class="chevron">▾</span>
      </button>
    </div>

    <div v-if="showFilters" class="filters-panel">
      <div class="filter-group">
        <div class="filter-title">Time range</div>

        <label>
          From
          <input
            type="date"
            v-model="filters.from"
            :min="minDate"
            :max="maxDate"
          />
        </label>

        <label>
          To
          <input
            type="date"
            v-model="filters.to"
            :min="minDate"
            :max="maxDate"
          />
        </label>
      </div>
    </div>

    <div class="box header-row">
      <div class="earnings-adjusted">
        <h2>Earnings Breakdown</h2>
        <div class="toggle-wrapper">
          <label class="switch">
            <input type="checkbox" v-model="showAvg" />
            <span class="slider"></span>
          </label>

          <span class="toggle-label">
            {{ showAvg ? 'Earnings per Hour' : 'Total Earnings' }}
          </span>
        </div>
      </div>
      <div class="chart-container">
        <div
          v-if="chartData.every(d => d.tips === 0 && d.nonTips === 0)"
          class="no-data-box"
        >
          No data available in the selected period. Please adjust the filters.
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
import { periodStore } from './store/periodStore'
import mixin from '@/components/chart/view/mixin'

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

      showFilters: false,
      filters: {
        from: null,
        to: null
      },

      normalizedPaymentsCache: [],
      earningsByDayCache: {},
      earningsByMonthCache: {},
      earningsByYearCache: {},
      avgEarningsByDayCache: {},
      avgEarningsByMonthCache: {},
      avgEarningsByYearCache: {}
    }
  },

  computed: {
    // Start of the selected period
    activeFromTs() {
      if (this.filters.from) {
        return dayjs(this.filters.from).startOf('day').valueOf()
      }
      return null
    },

    // End of the selected period
    activeToTs() {
      if (this.filters.to) {
        return dayjs(this.filters.to).endOf('day').valueOf()
      }
      return null
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

    // Payments filtered by date range
    filteredPayments() {
      const { activeFromTs, activeToTs } = this
      if (!activeFromTs && !activeToTs) return this.payments

      return this.payments.filter((p) => {
        const ts = Date.parse(p.recognizeTimestampLocal)
        if (activeFromTs && ts < activeFromTs) return false
        if (activeToTs && ts > activeToTs) return false
        return true
      })
    },

    // Shifts filtered by date range
    filteredShifts() {
      const { activeFromTs, activeToTs } = this
      if (!activeFromTs && !activeToTs) return this.shifts

      return this.shifts.filter((s) => {
        const ts = Date.parse(s.begin)
        if (activeFromTs && ts < activeFromTs) return false
        if (activeToTs && ts > activeToTs) return false
        return true
      })
    },

    // Minimum selectable date for filters
    minDate() {
      return periodStore.allTimeStart
        ? dayjs(periodStore.allTimeStart).format('YYYY-MM-DD')
        : null
    },

    // Maximum selectable date for filters
    maxDate() {
      return periodStore.allTimeEnd
        ? dayjs(periodStore.allTimeEnd).format('YYYY-MM-DD')
        : null
    },

    // Range in days for the selected period
    rangeInDays() {
      if (!this.activeFromTs || !this.activeToTs) return 0
      return Math.ceil((this.activeToTs - this.activeFromTs) / 86400000)
    },

    // Yearly view (>366 days)
    isYearlyView() {
      return this.rangeInDays > 366
    },

    // Monthly view (31-366 days)
    isMonthlyView() {
      return this.rangeInDays > 30 && this.rangeInDays <= 366
    },

    // Earnings grouped per day/month/year for chart
    chartData() {
      const from = this.activeFromTs
      const to = this.activeToTs

      // Helper: only include entries within filter
      const inRange = (tsOrKey) => {
        if (!from || !to) return true

        // tsOrKey can be YYYY-MM-DD string, YYYY-MM, or YYYY
        if (typeof tsOrKey === 'string') {
          if (tsOrKey.includes('-')) {
            // month
            const monthStart = dayjs(tsOrKey, 'YYYY-MM').startOf('month').valueOf()
            const monthEnd = dayjs(tsOrKey, 'YYYY-MM').endOf('month').valueOf()
            return monthEnd >= from && monthStart <= to
          } else {
            // year
            const yearStart = dayjs(tsOrKey, 'YYYY').startOf('year').valueOf()
            const yearEnd = dayjs(tsOrKey, 'YYYY').endOf('year').valueOf()
            return yearEnd >= from && yearStart <= to
          }
        }

        // fallback: tsOrKey is day string DD.MM.YYYY
        const ts = dayjs(tsOrKey, 'DD.MM.YYYY').valueOf()
        return ts >= from && ts <= to
      }

      // YEARLY
      if (this.isYearlyView) {
        const src = this.showAvg ? this.avgEarningsByYearCache : this.earningsByYearCache
        return Object.keys(src)
          .filter(inRange)
          .sort()
          .map((year) => {
            const e = src[year] || { tips: 0, nonTips: 0 }
            return {
              date: String(year),
              tips: e.tips,
              nonTips: e.nonTips
            }
          })
      }

      // MONTHLY
      if (this.isMonthlyView) {
        const src = this.showAvg ? this.avgEarningsByMonthCache : this.earningsByMonthCache
        return this.allMonths
          .filter(inRange)
          .map((m) => {
            const e = src[m] || { tips: 0, nonTips: 0 }
            return {
              date: dayjs(m, 'YYYY-MM').format('MMM YYYY'),
              tips: e.tips,
              nonTips: e.nonTips
            }
          })
      }

      // DAILY
      return this.allDays
        .filter(inRange)
        .map((day) => {
          const e = this.showAvg ? this.avgEarningsByDayCache[day] : this.earningsByDayCache[day]
          const safe = e || { tips: 0, nonTips: 0 }
          return {
            date: day,
            tips: safe.tips,
            nonTips: safe.nonTips
          }
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
        chart: { stacked: true, toolbar: { show: false }, animations: { enabled: true } },
        dataLabels: { enabled: false },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
        xaxis: { categories: this.chartData.map(d => d.date), labels: { rotate: -45 } },
        yaxis: { labels: { formatter: val => `${currency} ${val.toFixed(0)}` } },
        tooltip: { y: { formatter: val => `${currency} ${val.toFixed(2)}` } },
        legend: { show: false },
        colors: ['#2196f3', '#4caf50']
      }
    },

    // All months in the selected period as YYYY-MM strings
    allMonths() {
      let start = dayjs(this.activeFromTs).startOf('month')
      const end = dayjs(this.activeToTs).endOf('month')

      const months = []

      while (start.isBefore(end) || start.isSame(end, 'month')) {
        months.push(start.format('YYYY-MM'))
        start = start.add(1, 'month')
      }

      return months
    },

    // All days in the selected period as DD.MM.YYYY strings
    allDays() {
      let startTs = this.activeFromTs
      let endTs = this.activeToTs

      // fallback: full data range
      if (!startTs || !endTs) {
        const ts = this.normalizedPaymentsCache.map(p =>
          dayjs(p.day, 'DD.MM.YYYY').valueOf()
        )

        if (!ts.length) return []

        startTs = Math.min(...ts)
        endTs = Math.max(...ts)
      }

      const days = []
      const ONE_DAY = 86400000

      let cur = dayjs(startTs).startOf('day').valueOf()
      const end = dayjs(endTs).endOf('day').valueOf()

      while (cur <= end) {
        days.push(this.formatDay(cur))
        cur += ONE_DAY
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
        this.normalizedPaymentsCache = this.filteredPayments.map((p) => {
          const ts = Date.parse(p.recognizeTimestampLocal)
          return {
            day: this.formatDay(ts), // make sure to format day
            year: new Date(ts).getFullYear(),
            amount: Number(p.amountLocal || 0),
            isTip: (p.category || '').toLowerCase() === 'tip'
          }
        })

        // Clear hours cache
        this.normalizedPaymentsCache = []

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
      this.filteredShifts.forEach((s) => {
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
      this.normalizedPaymentsCache = this.filteredPayments.map((p) => {
        const ts = Date.parse(p.recognizeTimestampLocal)

        return {
          ts,
          day: this.formatDay(ts),
          month: dayjs(ts).format('YYYY-MM'),
          year: new Date(ts).getFullYear(),
          amount: Number(p.amountLocal || 0),
          isTip: (p.category || '').toLowerCase() === 'tip'
        }
      })

      this.earningsByDayCache = {}
      this.earningsByMonthCache = {}
      this.earningsByYearCache = {}

      this.avgEarningsByDayCache = {}
      this.avgEarningsByMonthCache = {}
      this.avgEarningsByYearCache = {}

      const hoursByDay = {}
      const hoursByMonth = {}
      const hoursByYear = {}

      this.filteredShifts.forEach((s) => {
        const startTs = Date.parse(s.begin)
        const endTs = Date.parse(s.end)
        if (!startTs || !endTs || endTs <= startTs) return

        const hours = (endTs - startTs) / 3600000

        const day = this.formatDay(startTs)
        const month = dayjs(startTs).format('YYYY-MM')
        const year = new Date(startTs).getFullYear()

        hoursByDay[day] = (hoursByDay[day] || 0) + hours
        hoursByMonth[month] = (hoursByMonth[month] || 0) + hours
        hoursByYear[year] = (hoursByYear[year] || 0) + hours
      })

      this.normalizedPaymentsCache.forEach((p) => {
        // DAY
        if (!this.earningsByDayCache[p.day]) {
          this.earningsByDayCache[p.day] = { tips: 0, nonTips: 0 }
        }

        // MONTH
        if (!this.earningsByMonthCache[p.month]) {
          this.earningsByMonthCache[p.month] = { tips: 0, nonTips: 0 }
        }

        // YEAR
        if (!this.earningsByYearCache[p.year]) {
          this.earningsByYearCache[p.year] = { tips: 0, nonTips: 0 }
        }

        if (p.isTip) {
          this.earningsByDayCache[p.day].tips += p.amount
          this.earningsByMonthCache[p.month].tips += p.amount
          this.earningsByYearCache[p.year].tips += p.amount
        } else {
          this.earningsByDayCache[p.day].nonTips += p.amount
          this.earningsByMonthCache[p.month].nonTips += p.amount
          this.earningsByYearCache[p.year].nonTips += p.amount
        }
      })

      Object.keys(this.earningsByDayCache).forEach((day) => {
        const e = this.earningsByDayCache[day]
        const h = hoursByDay[day] || 0

        this.avgEarningsByDayCache[day] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      })

      Object.keys(this.earningsByMonthCache).forEach((month) => {
        const e = this.earningsByMonthCache[month]
        const h = hoursByMonth[month] || 0

        this.avgEarningsByMonthCache[month] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      })

      Object.keys(this.earningsByYearCache).forEach((year) => {
        const e = this.earningsByYearCache[year]
        const h = hoursByYear[year] || 0

        this.avgEarningsByYearCache[year] = h > 0
          ? { tips: e.tips / h, nonTips: e.nonTips / h }
          : { tips: 0, nonTips: 0 }
      })
    }
  }
}
</script>

<style scoped>
.earnings-view {
  margin: 8px;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.filters-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filters-btn .chevron {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

/* Rotate chevron when open */
.filters-btn.open .chevron {
  transform: rotate(180deg);
}

.filters-panel {
  margin: 8px 0 16px 0;
  padding: 12px 16px;
  border: 1px solid #bbbbbb99;
  background: #fff;
  box-shadow:
    0 3px 1px -2px rgba(0,0,0,.2),
    0 2px 2px 0 rgba(0,0,0,.19),
    0 1px 5px 0 rgba(0,0,0,.17);
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
  margin-right: 24px;
}

.filter-group:first-child label {
  justify-content: space-between;
}

.filter-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #444;
  cursor: pointer;
}

/* Date inputs */
.filter-group input[type="date"] {
  margin-left: 6px;
  padding: 3px 6px;
  border: 1px solid #bbb;
  font-size: 0.8rem;
}

/* Checkbox alignment */
.filter-group input[type="checkbox"] {
  cursor: pointer;
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

.switch-btn:hover {
  background: #f2f2f2;
  box-shadow:
    0 3px 1px -2px rgba(0,0,0,.25),
    0 2px 4px 0 rgba(0,0,0,.20),
    0 1px 8px 0 rgba(0,0,0,.18);
  transform: translateY(-1px);
}

.box {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.19),
              0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
  padding: 20px;
  font-size: 1.2rem;
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
  background-color: #4caf50;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.toggle-label {
  margin-left: 8px;
  font-size: 0.9rem;
  color: #333;
}

.no-data-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(240, 240, 240, 0.55); /* semi-transparent grey */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666666;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  padding: 12px;
  border-radius: 4px;
  z-index: 10; /* ensure it sits above the chart */
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
  margin-bottom: 4px;
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

  .controls-bar {
    flex-direction: column;
  }
}
</style>
