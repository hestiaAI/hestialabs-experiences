<template>
  <div class="layout-container">
    <div class="period-switch">
      <button
        v-for="p in ['week','month','total']"
        :key="p"
        :class="['switch-btn', { active: currentPeriod === p }]"
        @click="currentPeriod = p"
      >
        {{ p.toUpperCase() }}
      </button>
    </div>

    <div class="week-nav">
      <button class="nav-btn" @click="prevWeek">←</button>
      <div class="week-label">{{ weekLabel }}</div>
      <button class="nav-btn" @click="nextWeek">→</button>
    </div>

    <!-- BOX 2 → Bubble Chart -->
    <div class="box box2 tour-earnings-chart">
      <div class="header-controls">
        <h2 class="chart-title">Earnings Distribution</h2>
      </div>

      <div class="chart-wrapper" v-if="currentPeriod !== 'total'">
        <ApexChart
          type="bubble"
          height="450"
          :options="chartOptions"
          :series="chartSeries"
        />

        <div v-if="legendItems.length" class="legend mt-4">
          <div v-for="item in legendItems" :key="item.name" class="legend-item">
            <span class="legend-swatch" :style="{ backgroundColor: item.color }" />
            {{ item.label }} ({{ item.count }})
          </div>
        </div>

        <div v-if="filteredJobs.length === 0" class="no-data-overlay">
          <p>No job data for this period</p>
        </div>
      </div>

      <div v-else-if="currentPeriod === 'total'">
        <ApexChart
          type="bubble"
          height="450"
          :series="totalScatterSeries"
          :options="totalScatterOptions"
        />
      </div>

      <p v-else>
        No job data found.
      </p>
    </div>
  </div>
</template>

<script>
import mixin from '@/components/chart/view/mixin'
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(weekday)
dayjs.extend(isBetween)

export default {
  name: 'BabysitsEarningsDistribution',
  components: { ApexChart: VueApexCharts },
  mixins: [mixin],

  data() {
    return {
      currentWeekStart: this.getMondayOf(dayjs()),
      currentPeriod: 'week'
    }
  },

  computed: {

    TIME_BUCKETS: {
      Morning: { from: '08:00', to: '12:00' },
      Day: { from: '12:00', to: '17:00' },
      Evening: { from: '17:00', to: '22:00' },
      Night: { from: '22:00', to: '08:00' }
    },

    monthDays() {
      const daysInMonth = this.weekStart.daysInMonth()
      return Array.from({ length: daysInMonth }, (_, i) => i + 1)
    },

    jobs() {
      return this.values || []
    },

    currency() {
      return this.jobs[0]?.currency || 'CHF'
    },

    weekStart() {
      return this.currentWeekStart
    },

    weekEnd() {
      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    weekLabel() {
      if (this.currentPeriod === 'total') return 'All time'
      if (this.currentPeriod === 'month') return this.weekStart.format('MMMM YYYY')

      return `${this.weekStart.format('DD.MM')} - ${this.weekEnd.format('DD.MM.YYYY')}`
    },

    filteredJobs() {
      const jobs = this.jobs.filter(j => j.status !== 'cancelled')

      if (this.currentPeriod === 'total') {
        return jobs
      }

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')

        return jobs.filter(j =>
          j.date && dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]')
        )
      }

      return jobs.filter(j =>
        j.date && dayjs(j.date).isBetween(this.weekStart, this.weekEnd, 'day', '[]')
      )
    },

    timeBucketColors() {
      return {
        Morning: '#36A2EB',
        Day: '#4BC0C0',
        Evening: '#FF6384',
        Night: '#6A9BE8'
      }
    },

    xLabels() {
      return this.currentPeriod === 'month'
        ? this.monthDays.map(d => d.toString())
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },

    aggregatedData() {
      const data = {}

      this.filteredJobs.forEach((job) => {
        const jobDate = dayjs(job.date)

        const dayIndex =
          this.currentPeriod === 'month'
            ? jobDate.date() - 1
            : (jobDate.day() === 0 ? 6 : jobDate.day() - 1)

        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)

        if (!data[dayIndex]) data[dayIndex] = {}
        if (!data[dayIndex][bucket]) {
          data[dayIndex][bucket] = { totalEarnings: 0, totalDuration: 0, count: 0 }
        }

        data[dayIndex][bucket].totalEarnings += Number(job.earnings) || 0
        data[dayIndex][bucket].totalDuration += Number(
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours
        ) || 0
        data[dayIndex][bucket].count += 1
      })

      return data
    },

    chartSeries() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night']
      const seriesMap = {}

      bucketKeys.forEach(b => (seriesMap[b] = { name: b, data: [] }))

      const maxIndex =
        this.currentPeriod === 'month'
          ? this.monthDays.length - 1
          : 6

      Object.entries(this.aggregatedData).forEach(([idx, buckets]) => {
        Object.entries(buckets).forEach(([bucket, metrics]) => {
          const series = seriesMap[bucket] || seriesMap.Other

          series.data.push([
            Number(idx),
            Number(metrics.totalEarnings.toFixed(2)),
            Number(metrics.totalDuration.toFixed(1)),
            metrics.count
          ])
        })
      })

      const dataSeries = bucketKeys
        .map(k => seriesMap[k])
        .filter(s => s.data.length)

      const placeholder = {
        name: 'Placeholder',
        data: Array.from({ length: maxIndex + 1 }, (_, i) => [i, null, 0])
      }

      return dataSeries.length
        ? [...dataSeries, placeholder]
        : [placeholder]
    },

    chartOptions() {
      const seriesColors = this.chartSeries.map(s =>
        s.name === 'Placeholder' ? 'transparent' : (this.timeBucketColors[s.name] || this.timeBucketColors.Other)
      )

      return {
        chart: {
          type: 'bubble',
          height: 450,
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          },
          pan: {
            enabled: false
          }
        },
        colors: seriesColors,
        dataLabels: {
          enabled: false
        },
        fill: {
          opacity: 0.8
        },
        xaxis: {
          type: 'numeric',
          min: 0.0,
          max: this.xLabels.length,
          tickAmount: this.xLabels.length,
          labels: {
            rotate: 0,
            formatter: v => this.xLabels[Math.round(v)] || '',
            style: {
              fontSize: '11px',
              textAnchor: 'middle'
            }
          }
        },
        yaxis: {
          title: {
            text: `Earnings (${this.currency})`
          },
          min: 0,
          forceNiceScale: true
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        plotOptions: {
          bubble: {
            maxBubbleRadius: 40,
            minBubbleRadius: 5
          }
        },
        tooltip: {
          enabled: this.filteredJobs.length > 0,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const point = w.config.series[seriesIndex].data[dataPointIndex]
            const seriesName = w.config.series[seriesIndex].name

            // Don't show tooltip for placeholder series
            if (seriesName === 'Placeholder' || !point || point[1] === null || point[1] === 0) return ''

            const dayIndex = Math.round(point[0])
            const dayName =
              this.currentPeriod === 'month'
                ? dayIndex + 1
                : this.xLabels[dayIndex]
            const totalEarnings = point[1]
            const totalDuration = point[2]
            const jobCount = point[3] || 1
            const bucketName = seriesName
            const range = this.TIME_BUCKETS[bucketName]

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">
                  ${dayName} – ${bucketName} (${range.from}–${range.to})
                </div>
                <p>Total Income: <strong>${totalEarnings.toFixed(2)} ${this.currency}</strong></p>
                <p>Jobs: <strong>${jobCount}</strong></p>
                <p>Total Duration: <strong>${totalDuration.toFixed(1)} h</strong></p>
              </div>
            `
          }
        },
        legend: {
          show: false
        },
        noData: {
          text: 'No data available for this week',
          align: 'center',
          verticalAlign: 'middle',
          style: {
            color: '#888',
            fontSize: '16px'
          }
        }
      }
    },

    legendItems() {
      const keys = Object.keys(this.timeBucketColors)
      return keys.map((type) => {
        const count = Object.values(this.aggregatedData).reduce((sum, buckets) => {
          return sum + (buckets[type]?.count || 0)
        }, 0)
        const range = this.TIME_BUCKETS[type]
        return {
          name: type,
          label: `${type} (${range.from}–${range.to})`,
          color: this.timeBucketColors[type],
          count
        }
      }).filter(item => item.count > 0)
    },

    totalScatterData() {
      const buckets = {}

      this.filteredJobs.forEach((job) => {
        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)

        if (!buckets[bucket]) {
          buckets[bucket] = {
            totalEarnings: 0,
            totalDuration: 0,
            count: 0
          }
        }

        buckets[bucket].totalEarnings += Number(job.earnings) || 0
        buckets[bucket].totalDuration += Number(
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours
        ) || 0

        buckets[bucket].count += 1
      })

      return buckets
    },

    totalScatterSeries() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night']

      const data = bucketKeys.map((bucket, i) => {
        const b = this.totalScatterData[bucket]

        if (!b || b.count === 0 || b.totalDuration === 0) {
          return [i, null, 0]
        }

        const avgPerHour = b.totalEarnings / b.totalDuration

        return [
          i,
          Number(avgPerHour.toFixed(2)),
          b.count
        ]
      })

      return [{
        name: 'Total Summary',
        data
      }]
    },

    totalScatterOptions() {
      const categories = ['Morning', 'Day', 'Evening', 'Night']

      return {
        chart: {
          type: 'bubble',
          toolbar: { show: false },
          zoom: { enabled: false }
        },

        colors: categories.map(
          b => this.timeBucketColors[b] || this.timeBucketColors.Other
        ),

        xaxis: {
          type: 'numeric',
          min: 0,
          max: categories.length - 1,
          tickAmount: categories.length - 1,
          labels: {
            formatter: v => categories[Math.round(v)] || ''
          },
          title: {
            text: 'Time Bucket'
          }
        },

        yaxis: {
          min: 0,
          title: {
            text: `Average earnings per hour (${this.currency})`
          }
        },

        plotOptions: {
          bubble: {
            minBubbleRadius: 6,
            maxBubbleRadius: 50
          }
        },

        dataLabels: {
          enabled: false
        },

        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const point = w.config.series[seriesIndex].data[dataPointIndex]

            if (!point || point[1] == null || point[1] === 0) return ''

            const bucketIndex = Math.round(point[0])
            const bucket = categories[bucketIndex]
            const avg = point[1]
            const shifts = point[2]

            const stats = this.totalScatterData[bucket]
            if (!stats) return ''

            const totalIncome = stats.totalEarnings.toFixed(2)
            const totalHours = stats.totalDuration.toFixed(1)

            const range = this.TIME_BUCKETS[bucket]

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">${bucket} (${range.from}-${range.to})</div>
                <p>Avg hourly income:<br>
                <strong>${avg.toFixed(2)} ${this.currency}</strong></p>

                <p>Shifts (bubble size): <strong>${shifts}</strong></p>

                <p>Total income: <strong>${totalIncome} ${this.currency}</strong></p>
                <p>Total hours: <strong>${totalHours} h</strong></p>
              </div>
            `
          }
        },

        legend: {
          show: false
        }
      }
    }
  },

  watch: {
    currentPeriod(newVal) {
      if (!this.latestJobDate) return

      if (newVal === 'month') {
        this.currentWeekStart = this.latestJobDate.startOf('month')
      } else if (newVal === 'week') {
        this.currentWeekStart = this.getMondayOf(this.latestJobDate)
      }
    }
  },

  mounted() {
    if (this.latestJobDate) {
      this.currentWeekStart = this.getMondayOf(this.latestJobDate)
    }

    if (window.__continueBabysitterTour) {
      window.__continueBabysitterTour()
      window.__continueBabysitterTour = null
    }
  },

  methods: {
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    getTimeBucketFromHour(h) {
      if (h == null || isNaN(h)) return 'Other'
      if (h >= 8 && h < 12) return 'Morning'
      if (h >= 12 && h < 17) return 'Day'
      if (h >= 17 && h < 22) return 'Evening'
      return 'Night'
    },

    prevWeek() {
      if (this.currentPeriod === 'month') {
        this.currentWeekStart = this.currentWeekStart.subtract(1, 'month')
      } else if (this.currentPeriod === 'week') {
        this.currentWeekStart = this.currentWeekStart.subtract(7, 'day')
      }
    },

    nextWeek() {
      if (this.currentPeriod === 'month') {
        this.currentWeekStart = this.currentWeekStart.add(1, 'month')
      } else if (this.currentPeriod === 'week') {
        this.currentWeekStart = this.currentWeekStart.add(7, 'day')
      }
    }
  }
}
</script>

<style scoped>
/* --- LAYOUT --- */
.layout-container {
  width: 94%;
  gap: 16px;
  margin-left: 16px;
}

/* Base box style */
.box {
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  font-size: 1.2rem;
}

/* BUBBLE CHART */
.box2 {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 1.5rem;
  color: #333;
  font-weight: 700;
  margin: 0;
}

.chart-wrapper {
  margin-top: 10px;
  position: relative;
}

.no-data-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  pointer-events: none;
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

/* Legend */
.legend {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .9rem;
}

.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

/* Tooltip styling */
.tooltip-box {
  padding: 12px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tooltip-title {
  font-weight: 700;
  margin-bottom: 6px;
  font-size: 1rem;
  color: #333;
}

.tooltip-box p {
  margin: 4px 0;
  color: #555;
}

.tooltip-box strong {
  color: #333;
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
</style>
