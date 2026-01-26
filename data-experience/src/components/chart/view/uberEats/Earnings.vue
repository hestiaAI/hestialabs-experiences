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

      <!-- WEEK / MONTH NAVIGATION -->
      <div class="week-nav">
        <button
          class="nav-btn"
          v-if="mode !== 'total'"
          @click="prevPeriod"
        >
          ←
        </button>
        <div class="week-label">{{ periodLabel }}</div>
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
      showAvg: false
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

        return `${dayjs(allTimeStart).format('DD.MM.YYYY')} – ${dayjs(allTimeEnd).format('DD.MM.YYYY')}`
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

      // Pre-fill from allDays (authoritative keys)
      this.allDays.forEach((d) => {
        out[d] = { tips: 0, nonTips: 0 }
      })

      this.payments.forEach((p) => {
        const ts = Date.parse(p.recognizeTimestampLocal)
        if (!ts) return

        const key = this.formatDay(ts)
        const bucket = out[key]
        if (!bucket) return

        const amount = Number(p.amountLocal || 0)
        if ((p.category || '').toLowerCase() === 'tip') {
          bucket.tips += amount
        } else {
          bucket.nonTips += amount
        }
      })

      return out
    },

    // Earnings grouped per year
    earningsByYear() {
      const out = {}

      this.payments.forEach((p) => {
        const ts = Date.parse(p.recognizeTimestampLocal)
        if (!ts) return

        const year = new Date(ts).getFullYear()
        const amount = Number(p.amountLocal || 0)
        const isTip = (p.category || '').toLowerCase() === 'tip'

        if (!out[year]) out[year] = { tips: 0, nonTips: 0 }

        if (isTip) out[year].tips += amount
        else out[year].nonTips += amount
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
    },

    // Final chart dataset
    chartData() {
      if (this.mode === 'total') {
        const src = this.showAvg
          ? this.avgEarningsByYear
          : this.earningsByYear

        return Object.keys(src).map(year => ({
          date: year, // X-axis label
          tips: src[year].tips,
          nonTips: src[year].nonTips
        }))
      }

      return this.allDays.map((d) => {
        const src = this.showAvg
          ? this.avgEarningsPerDay[d]
          : this.earningsByDay[d]

        return { date: d, tips: src.tips, nonTips: src.nonTips }
      })
    },

    // Chart series for ApexCharts
    chartSeries() {
      return [
        {
          name: 'Earnings (no tips)',
          data: this.chartData.map(d => Number(d.nonTips.toFixed(2)))
        },
        {
          name: 'Tips',
          data: this.chartData.map(d => Number(d.tips.toFixed(2)))
        }
      ]
    },

    // Chart options for ApexCharts
    chartOptions() {
      const currency = this.payments[0]?.currencyCode || 'CHF'

      return {
        chart: {
          stacked: true,
          toolbar: { show: false },
          animations: { enabled: true }
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        xaxis: {
          categories: this.chartData.map(d => d.date),
          labels: {
            rotate: -45
          }
        },
        yaxis: {
          labels: {
            formatter: val => `${currency} ${val.toFixed(0)}`
          }
        },
        tooltip: {
          y: {
            formatter: val => `${currency} ${val.toFixed(2)}`
          }
        },
        legend: {
          show: false
        },
        colors: ['#2196f3', '#4caf50']
      }
    }
  },
  mounted() {
    // Continue tutorial if applicable
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    this.drawChart()
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.period-switch {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
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

.week-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
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
  font-weight: 700;
  color: #333;
  font-size: 1rem;
  width: 240px;
  text-align: center;
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

.chart-container {
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

  .period-switch {
    justify-content: center;
    margin-bottom: 20px;
  }

  .week-nav {
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
