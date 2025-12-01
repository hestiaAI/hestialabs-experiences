<template>
  <div class="earnings-view">
    <div class="header-row">
      <h2>Earnings Breakdown</h2>

      <label class="switch">
        <input type="checkbox" v-model="showAvg" />
        <span class="slider"></span>
      </label>

      <span class="toggle-label">
        {{ showAvg ? 'Earnings per Hour' : 'Total Earnings' }}
      </span>
    </div>

    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import dayjs from 'dayjs'
import { periodStore } from './store/periodStore'

export default {
  name: 'EarningsView',

  props: {
    data: { type: Array, required: false }
  },

  data() {
    return {
      showAvg: false
    }
  },

  computed: {
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

    periodStart() {
      return dayjs(periodStore.periodStart)
    },

    periodEnd() {
      return dayjs(periodStore.periodEnd)
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
        const start = dayjs(s.begin_timestamp_utc)
        const end = dayjs(s.end_timestamp_utc)

        if (!start.isValid() || !end.isValid() || end.isBefore(start)) return

        const date = start.format('DD.MM.YYYY')
        out[date] = (out[date] || 0) + end.diff(start, 'minute') / 60
      })

      return out
    },

    /** Earnings grouped per day */
    earningsByDay() {
      const out = {}

      console.log(this.allDays)
      this.allDays.forEach((d) => {
        out[d] = { tips: 0, nonTips: 0 }
      })

      console.log(this.payments)
      this.payments.forEach((p) => {
        const date = dayjs(p.recognize_timestamp_local).format('DD.MM.YYYY')
        if (!(date in out)) return

        const amount = Number(p.amount_local || 0)
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
    },
    'periodStore.periodStart'() {
      this.drawChart()
    },
    'periodStore.periodEnd'() {
      this.drawChart()
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
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
            .attr('fill', '#4caf50')

          g.append('rect')
            .attr('y', d => y(d.nonTips + d.tips))
            .attr('height', d => y(0) - y(d.tips))
            .attr('width', x.bandwidth())
            .attr('fill', '#2196f3')
        })
    }
  }
}
</script>

<style scoped>
.earnings-view {
  padding: 20px;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-container {
  overflow-x: auto;
}
</style>
