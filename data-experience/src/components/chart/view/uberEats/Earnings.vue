<template>
  <div class="earnings-view">

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
      <button class="nav-btn" @click="prevPeriod">←</button>
      <div class="week-label">{{ periodLabel }}</div>
      <button class="nav-btn" @click="nextPeriod">→</button>
    </div>

    <!-- ORIGINAL HEADER -->
    <div class="header-row">
      <h2>Earnings Breakdown</h2>

      <div class="earnings-adjusted">
        <label class="switch">
          <input type="checkbox" v-model="showAvg" />
          <span class="slider"></span>
        </label>

        <span class="toggle-label">
          {{ showAvg ? 'Earnings per Hour' : 'Total Earnings' }}
        </span>
      </div>
    </div>

    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { watch } from 'vue'
import { periodStore } from './store/periodStore'
import mixin from '@/components/chart/view/mixin'

export default {
  name: 'EarningsView',
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
    mode: {
      get() { return periodStore.mode },
      set(v) { periodStore.mode = v }
    },

    periodStart() {
      return dayjs(periodStore.periodStart)
    },
    periodEnd() {
      return dayjs(periodStore.periodEnd)
    },

    periodLabel() {
      if (this.mode === 'total') return 'All Time'
      if (this.mode === 'month') return this.periodStart.format('MMMM YYYY')
      return `${this.periodStart.format('DD.MM')} – ${this.periodEnd.format('DD.MM.YYYY')}`
    },

    // Top-level pipeline block
    pipelineBlock() {
      return this.data?.[0] ?? {}
    },

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

    /** All days in range */
    allDays() {
      const days = []
      let current = this.periodStart
      const end = this.periodEnd

      while (current.isSameOrBefore(end, 'day')) {
        days.push(current.format('DD.MM.YYYY'))
        current = current.add(1, 'day')
      }

      return days
    },

    /** Hours worked grouped per day */
    hoursPerDay() {
      const out = {}

      this.shifts.forEach((s) => {
        const start = dayjs(s.begin)
        const end = dayjs(s.end)

        if (!start.isValid() || !end.isValid() || end.isBefore(start)) return

        const date = start.format('DD.MM.YYYY')
        out[date] = (out[date] || 0) + end.diff(start, 'minute') / 60
      })

      return out
    },

    /** Earnings grouped per day */
    earningsByDay() {
      const out = {}

      this.allDays.forEach((d) => {
        out[d] = { tips: 0, nonTips: 0 }
      })

      this.payments.forEach((p) => {
        const date = dayjs(p.recognizeTimestampLocal).format('DD.MM.YYYY')
        if (!(date in out)) return

        const amount = Number(p.amountLocal || 0)
        const isTip = (p.category || '').toLowerCase() === 'tip'

        if (isTip) out[date].tips += amount
        else out[date].nonTips += amount
      })

      return out
    },

    /** Avg earnings per hour */
    avgEarningsPerDay() {
      const out = {}

      this.allDays.forEach((date) => {
        const hours = this.hoursPerDay[date] || 0
        const e = this.earningsByDay[date]

        out[date] =
          hours > 0
            ? { tips: e.tips / hours, nonTips: e.nonTips / hours }
            : { tips: 0, nonTips: 0 }
      })

      return out
    },

    /** Final chart dataset */
    chartData() {
      return this.allDays.map((d) => {
        const src = this.showAvg
          ? this.avgEarningsPerDay[d]
          : this.earningsByDay[d]

        return { date: d, tips: src.tips, nonTips: src.nonTips }
      })
    }
  },
  watch: {
    showAvg() {
      this.drawChart()
    },
    chartData() {
      this.drawChart()
    }
  },
  mounted() {
    if (window.__continueRoutesTour) {
      window.__continueRoutesTour()
      window.__continueRoutesTour = null
    }

    watch(
      () => periodStore.periodStart,
      () => {
        this.redraw()
      }
    )

    watch(
      () => periodStore.periodEnd,
      () => {
        this.redraw()
      }
    )

    this.drawChart()
  },
  methods: {
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
    },
    drawChart() {
      const el = this.$refs.chartRef
      if (!el) return

      const data = this.chartData

      const width = 700
      const height = 350
      const margin = { top: 20, right: 20, bottom: 40, left: 50 }

      d3.select(el).selectAll('*').remove()

      const svg = d3
        .select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const x = d3
        .scaleBand()
        .domain(data.map(d => d.date))
        .range([margin.left, width - margin.right])
        .padding(0.2)

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d.nonTips + d.tips)])
        .nice()
        .range([height - margin.bottom, margin.top])

      // X axis
      svg
        .append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')

      // Y axis
      svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))

      // Bars (stacked)
      svg
        .selectAll('g.bar')
        .data(data)
        .join('g')
        .attr('transform', d => `translate(${x(d.date)},0)`)
        .call((g) => {
          g.append('rect')
            .attr('y', d => y(d.nonTips))
            .attr('height', d => y(0) - y(d.nonTips))
            .attr('width', x.bandwidth())
            .attr('fill', '#2196f3')

          g.append('rect')
            .attr('y', d => y(d.nonTips + d.tips))
            .attr('height', d => y(0) - y(d.tips))
            .attr('width', x.bandwidth())
            .attr('fill', '#4caf50')
        })
    }
  }
}
</script>

<style scoped>
.earnings-view {
  padding: 20px;
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 12px;
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
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

.header-row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
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
  overflow-x: auto;
}
</style>
