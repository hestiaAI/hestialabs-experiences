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
      <button class="nav-btn" @click="prevWeek" v-if="currentPeriod !== 'total'">←</button>
      <div class="week-label">{{ weekLabel }}</div>
      <button class="nav-btn" @click="nextWeek" v-if="currentPeriod !== 'total'">→</button>
    </div>

    <div v-if="currentPeriod === 'total'" class="total-layout">
      <!-- BOX 2 → Bubble Chart -->
      <div class="box box2 tour-earnings-chart">
        <div class="header-controls">
          <h2 class="chart-title">Earnings Distribution</h2>
        </div>

        <ApexChart
          type="bubble"
          height="450"
          :series="totalScatterSeries"
          :options="totalScatterOptions"
        />
      </div>

      <!-- BOX 4 → Job List Panel -->
      <div class="box box4 tour-jobtype-filter">
        <div class="panel-header">
          <h3 v-if="selectedTotalBucket">
            {{ selectedTotalBucket }} jobs
          </h3>
          <h3 v-else>
            Select a bubble
          </h3>
        </div>

        <div
          v-for="activity in totalPanelActivities"
          :key="activity.type"
          class="job-item"
        >
          <div class="activity-row">
            <span
              class="activity-dot"
              :style="{ backgroundColor: activity.color }"
            />
            <strong>{{ activity.type }}</strong>
          </div>

          <div class="activity-summary">
            {{ activity.earnings.toFixed(2) }} {{ currency }}
            {{ activity.hours.toFixed(1) }} h
            {{ activity.count }} jobs
          </div>

          <div class="activity-jobs">
            <div
              v-for="job in activity.jobs"
              :key="job.job_id || job.date + job.start_time"
              class="activity-job"
            >
              <strong>{{ formatDate(job.date) }}</strong>
              <div>
                {{ job.job_type }} · {{ job.start_time }} ·
                {{ job.duration_hours || job.nbHours }} h
              </div>
            <div>
              {{ job.earnings }} {{ currency }}
            </div>
          </div>
        </div>
      </div>

      </div>
    </div>

    <div v-else>
      <!-- BOX 2 → Bubble Chart for week/month -->
      <div class="box box2 tour-earnings-chart">
        <div class="header-controls">
          <h2 class="chart-title">Earnings Distribution</h2>
        </div>

        <div class="chart-wrapper">
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
      </div>
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

const TIME_BUCKETS = {
  Morning: { from: '08:00', to: '12:00' },
  Day: { from: '12:00', to: '17:00' },
  Evening: { from: '17:00', to: '22:00' },
  Night: { from: '22:00', to: '08:00' }
}

export default {
  name: 'BabysitsEarningsDistribution',
  components: { ApexChart: VueApexCharts },
  mixins: [mixin],

  data() {
    return {
      currentWeekStart: this.getMondayOf(dayjs()),
      currentPeriod: 'week',
      selectedTotalBucket: null
    }
  },

  computed: {
    totalPanelActivities() {
      if (this.currentPeriod !== 'total') return []
      if (!this.selectedTotalBucket) return []

      const bucket = this.selectedTotalBucket

      const jobs = this.filteredJobs
        .filter((job) => {
          const [h] = (job.start_time || '0:00').split(':').map(Number)
          return this.getTimeBucketFromHour(h) === bucket
        })
        .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf())

      if (!jobs.length) return []

      const earnings = jobs.reduce((s, j) => s + (+j.earnings || 0), 0)
      const hours = jobs.reduce(
        (s, j) =>
          s +
          (j.nbHours ||
            j.duration ||
            j.duration_hours ||
            j.hours ||
            j.work_hours ||
            0),
        0
      )

      return [{
        type: bucket,
        color: this.timeBucketColors[bucket],
        earnings,
        hours,
        count: jobs.length,
        jobs
      }]
    },

    baseHourSize() {
      return 10
    },

    baseShiftSize() {
      return 8
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
      if (this.currentPeriod === 'total') {
        const earliest = this.earliestJobDate
        const latest = this.latestJobDate
        if (!earliest || !latest) return 'Entire Period'
        return `${earliest.format('DD.MM.YYYY')} - ${latest.format('DD.MM.YYYY')}`
      }
      if (this.currentPeriod === 'month') return this.weekStart.format('MMMM YYYY')

      return `${this.weekStart.format('DD.MM')} - ${this.weekEnd.format('DD.MM.YYYY')}`
    },

    earliestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
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
          data[dayIndex][bucket] = {
            totalEarnings: 0,
            totalDuration: 0,
            count: 0,
            startTimes: [],
            endTimes: []
          }
        }

        const [sh, sm] = (job.start_time || '0:00').split(':').map(Number)
        const startMinutes = sh * 60 + sm

        const durationHours =
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours ||
          0

        const endMinutes = startMinutes + durationHours * 60

        data[dayIndex][bucket].startTimes.push(startMinutes)
        data[dayIndex][bucket].endTimes.push(endMinutes)

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

      bucketKeys.forEach((b) => {
        seriesMap[b] = { name: b, data: [] }
      })

      Object.entries(this.aggregatedData).forEach(([idx, buckets]) => {
        Object.entries(buckets).forEach(([bucket, metrics]) => {
          if (!seriesMap[bucket]) return

          seriesMap[bucket].data.push({
            x: Number(idx),
            y: Number(metrics.totalEarnings.toFixed(2)),
            z: Number((metrics.totalDuration * this.baseHourSize).toFixed(1)),
            count: metrics.count,
            start: Math.min(...metrics.startTimes),
            end: Math.max(...metrics.endTimes)
          })
        })
      })

      return bucketKeys
        .map(k => seriesMap[k])
        .filter(s => s.data.length > 0)
    },

    maxEarnings() {
      let max = 0

      this.chartSeries.forEach((series) => {
        series.data.forEach((p) => {
          if (p.y > max) max = p.y
        })
      })

      return max
    },

    chartOptions() {
      const seriesColors = this.chartSeries.map(s =>
        this.timeBucketColors[s.name] || this.timeBucketColors.Other
      )

      return {
        chart: {
          type: 'bubble',
          height: 450,
          toolbar: { show: false },
          zoom: { enabled: false },
          pan: { enabled: false }
        },
        colors: seriesColors,
        dataLabels: { enabled: false },
        fill: {
          opacity: 0.8,
          colors: ['#36A2EB', '#4BC0C0', '#FF6384', '#6A9BE8']
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
          max: this.maxEarnings * 1.15
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
            maxBubbleRadius: 45,
            minBubbleRadius: 8
          }
        },
        tooltip: {
          enabled: this.filteredJobs.length > 0,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const series = w.config.series[seriesIndex]
            const point = series.data[dataPointIndex]
            if (!point) return ''

            const day = this.xLabels[Math.round(point.x)]

            const fmt = m =>
              `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">
                  ${day} - ${series.name} (${fmt(point.start)}-${fmt(point.end)})
                </div>
                <p>Total income: <strong>${point.y.toFixed(2)} ${this.currency}</strong></p>
                <p>Jobs: <strong>${point.count}</strong></p>
                <p>Duration (bubble size): <strong>${(point.z / this.baseHourSize).toFixed(1)} h</strong></p>
              </div>
            `
          }
        },
        legend: {
          show: false
        },
        noData: {
          text: 'No data available for this period',
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
        const range = TIME_BUCKETS[type]
        return {
          name: type,
          label: `${type} (${range.from}-${range.to})`,
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
          b.count * this.baseShiftSize
        ]
      })

      return [{
        name: 'Total Summary',
        data
      }]
    },

    totalScatterOptions() {
      const bucketKeys = Object.keys(TIME_BUCKETS)
      const categories = bucketKeys.map(
        key => `${key}\n(${TIME_BUCKETS[key].from}-${TIME_BUCKETS[key].to})`
      )

      return {
        chart: {
          type: 'bubble',
          toolbar: { show: false },
          zoom: { enabled: false },
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const index = config.dataPointIndex
              const bucket = bucketKeys[index] || null
              this.selectedTotalBucket = bucket
            }
          }
        },

        colors: bucketKeys.map(b => this.timeBucketColors[b] || '#ccc'),

        xaxis: {
          type: 'numeric',
          min: -0.5,
          max: categories.length - 0.5,
          tickAmount: categories.length,
          labels: {
            rotate: -45,
            rotateAlways: true,
            offsetX: 25,
            formatter: v => categories[Math.round(v)] || ''
          },
          title: {
            text: 'Time of Day',
            offsetY: 50
          }
        },

        grid: {
          padding: {
            bottom: 50
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
            minBubbleRadius: 12,
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
            const bucketKey = bucketKeys[bucketIndex]
            const range = TIME_BUCKETS[bucketKey]
            const avg = point[1]

            const bubbleZ = point[2]
            const shifts = Math.round(bubbleZ / this.baseShiftSize)

            const stats = this.totalScatterData[bucketKey]
            if (!stats) return ''

            const totalIncome = stats.totalEarnings.toFixed(2)
            const totalHours = stats.totalDuration.toFixed(1)

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">${bucketKey} (${range.from}-${range.to})</div>
                <p>Avg hourly income:<br><strong>${avg.toFixed(2)} ${this.currency}</strong></p>
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
      this.selectedTotalBucket = null

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
    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY')
    },

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

/* Total layout - chart + panel side by side */
.total-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.total-layout .box2 {
  flex: 0 0 65%;
  margin-bottom: 0;
}

.total-layout .box4 {
  flex: 1;
  max-height: 500px;
  overflow-y: auto;
}

/* Job list panel */
.panel-header {
  margin-bottom: 16px;
}

.panel-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-item {
  background: white;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid #ddd;
}

.job-item:hover {
  background: #f3f3f3;
}

.job-item strong {
  display: block;
  margin-bottom: 4px;
  color: #333;
}

.job-item div {
  font-size: 0.9rem;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-style: italic;
}

.activity-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.activity-summary {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
}

.activity-jobs {
  border-top: 1px dashed #ddd;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.activity-job {
  font-size: 0.85rem;
  color: #666;
}

/* --- MEDIA QUERIES --- */
@media (max-width: 768px) {
  .layout-container { width: 100%; margin-left: 8px; gap: 12px; }
  .period-switch { position: static; justify-content: center; margin-bottom: 12px; }
  .week-nav { justify-content: center; margin-bottom: 12px; }
  .total-layout { flex-direction: column; align-items: stretch; }
  .total-layout .box2 { flex: 1 1 100%; order: 1; margin-bottom: 12px; }
  .total-layout .box4 { flex: 1 1 100%; order: 2; max-height: none; overflow: visible; }
  .box { padding: 12px; }
  .chart-wrapper { margin-top: 8px; }
  .legend { justify-content: center; }
}
</style>
