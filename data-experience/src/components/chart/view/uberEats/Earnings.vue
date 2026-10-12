<template>
  <div class="earnings-view">
    <PeriodToolbar
      :mode="mode"
      :label="periodLabel"
      :descriptions="periodDescriptions"
      @mode="periodStore.setMode($event)"
      @prev="prevPeriod"
      @next="nextPeriod"
    />

    <ViewCard class="header-row mt-3" title="Earnings Breakdown">
      <template #actions>
        <VSwitch
          v-model="showAvg"
          class="toggle-wrapper mt-0"
          label="Avg / hour"
          dense
          hide-details
        />
      </template>

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
    </ViewCard>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { periodStore } from './store/periodStore'
import mixin from '@/components/chart/view/mixin'
import PeriodToolbar from '../shared/PeriodToolbar.vue'
import ViewCard from '../shared/ViewCard.vue'

dayjs.extend(customParseFormat)

export default {
  name: 'EarningsView',
  components: {
    ApexChart: VueApexCharts,
    PeriodToolbar,
    ViewCard
  },
  mixins: [mixin],
  props: {
    data: { type: Array, required: false }
  },

  data() {
    return {
      periodStore,
      showAvg: false,
      normalizedPaymentsCache: [],
      earningsByDayCache: {},
      earningsByYearCache: {},
      avgEarningsByDayCache: {},
      avgEarningsByYearCache: {}
    }
  },

  computed: {
    periodDescriptions() {
      return {
        week: '📅 Weekly earnings: Your total and average earnings per day for this week',
        month: '📆 Monthly earnings: Daily earnings overview for the selected month',
        total: '📊 All-time earnings: Your earnings history grouped by year'
      }
    },

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

    // Date of the latest payment (for onboarding tour targeting)
    latestPaymentDate() {
      if (!this.payments.length) return null

      return this.payments
        .map(p => dayjs(p.recognizeTimestampLocal))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0] || null
    },

    // Base date for onboarding tour targeting (prefer period start, then latest payment, then latest trip)
    baseDate() {
      const start = dayjs(periodStore.periodStart)
      if (start.isValid()) return start

      const allTimeEnd = dayjs(periodStore.allTimeEnd)
      if (allTimeEnd.isValid()) return allTimeEnd

      return this.latestPaymentDate
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

        this.normalizedPaymentsCache = this.payments.map((p) => {
          const ts = Date.parse(p.recognizeTimestampLocal)
          return {
            day: this.formatDay(ts),
            year: new Date(ts).getFullYear(),
            amount: Number(p.amountLocal || 0),
            isTip: (p.category || '').toLowerCase() === 'tip'
          }
        })

        this.precomputeData()
      }
    },

    'periodStore.mode': function(newVal) {
      const base = this.baseDate
      if (!base || !base.isValid()) return

      if (newVal === 'month') {
        const start = base.startOf('month')
        const end = base.endOf('month')
        periodStore.setPeriod(start.toISOString(), end.toISOString())
        return
      }

      if (newVal === 'total') {
        return
      }

      const monday = this.getMondayOf(base)
      periodStore.setPeriod(
        monday.toISOString(),
        monday.add(6, 'day').endOf('day').toISOString()
      )
    },

    'periodStore.periodStart'() {
      this.precomputeData()
    },

    'periodStore.periodEnd'() {
      this.precomputeData()
    }
  },
  mounted() {
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    if (this.values?.length) {
      this.precomputeData()
    }

    if (this.latestPaymentDate) {
      if (periodStore.mode === 'month') {
        periodStore.setPeriod(
          this.latestPaymentDate.startOf('month').toISOString(),
          this.latestPaymentDate.endOf('month').toISOString()
        )
      } else if (periodStore.mode === 'week') {
        const monday = this.getMondayOf(this.latestPaymentDate)
        periodStore.setPeriod(
          monday.toISOString(),
          monday.add(6, 'day').endOf('day').toISOString()
        )
      }
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
     * Get Monday of the week for a given dayjs date
     * @param d
     */
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    /**
     * Navigate to previous period
     */
    prevPeriod() {
      if (this.mode === 'total') return

      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)

      if (!currentStart.isValid() || !currentEnd.isValid()) return

      if (this.mode === 'month') {
        const newStart = currentStart.subtract(1, 'month')
        const newEnd = currentEnd.subtract(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
        return
      }

      const newStart = currentStart.subtract(7, 'day')
      const newEnd = currentEnd.subtract(7, 'day')
      periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
    },

    /**
     * Navigate to next period
     */
    nextPeriod() {
      if (this.mode === 'total') return

      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)

      if (!currentStart.isValid() || !currentEnd.isValid()) return

      if (this.mode === 'month') {
        const newStart = currentStart.add(1, 'month')
        const newEnd = currentEnd.add(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
        return
      }

      const newStart = currentStart.add(7, 'day')
      const newEnd = currentEnd.add(7, 'day')
      periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
    }
  }
}
</script>

<style scoped>

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
.chart-overlay, .chart-overlay * {
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
</style>
