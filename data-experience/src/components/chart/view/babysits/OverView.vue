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

    <!-- BOX 1 → Top Stats -->
    <div class="box box1">
      <div>
        <strong>Total Earnings</strong>
        <div>{{ totalEarnings.toFixed(2) }} {{ currency }}</div>
      </div>

      <div>
        <strong>Total Hours Worked</strong>
        <div>{{ totalHours.toFixed(1) }} h</div>
      </div>

      <div>
        <strong>Number of Jobs</strong>
        <div>{{ totalJobs.toFixed(1) }}</div>
      </div>
    </div>

    <!-- BOX 2 → Apex Timeline -->
    <div class="box box2">
      <h2 class="mb-4">Shift Timeline</h2>

      <div v-if="currentPeriod === 'week' && jobs.length">
        <ApexChart
          type="rangeBar"
          height="450"
          :options="chartOptions"
          :series="chartSeries"
        />

        <div class="legend mt-4">
          <div v-for="item in statusItems" :key="item.name" class="legend-item">
            <span class="legend-swatch" :style="{ background: item.color }" />
            {{ item.label }} ({{ item.count }})
          </div>
        </div>
      </div>

      <div v-else-if="currentPeriod == 'month'">
        <MonthlyCalendar
          :year="calendarYear"
          :month="calendarMonth"
          :shifts="shiftsThisPeriod"
          :payments="paymentsInRange"
          @select-day="onSelectDay"
        />
      </div>

      <div v-else-if="currentPeriod === 'total'">
        <ApexChart
        type="heatmap"
        height="450"
        :key="'heatmap-total'"
        :series="heatmapSeries"
        :options="heatmapOptions"
      />
      </div>

      <p v-else>No job data found.</p>
    </div>

    <!-- BOX 4 → Average Work Time -->
    <div class="box box4">
      <p><strong>Average Work Time</strong></p>
      <p class="avg-value">{{ averageWorkTime }}</p>
    </div>

  </div>
</template>

<script>
import { createBabysitterTour } from './onboarding/babysitterTour'
import MonthlyCalendar from './MonthlyCalendar.vue'
import mixin from '@/components/chart/view/mixin'
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)
dayjs.extend(weekday)

export default {
  name: 'BabysitsShiftTimeline',
  components: {
    ApexChart: VueApexCharts,
    MonthlyCalendar
  },
  mixins: [mixin],

  data() {
    return {
      currentWeekStart: this.getMondayOf(dayjs()),
      currentPeriod: 'week'
    }
  },

  computed: {
    jobs() {
      return this.values || []
    },

    calendarYear() {
      return this.weekStart.year()
    },

    calendarMonth() {
      return this.weekStart.month()
    },

    shiftsThisPeriod() {
      return this.filteredJobs
    },

    paymentsInRange() {
      return []
    },

    filteredJobs() {
      if (this.currentPeriod === 'total') {
        return this.jobs
      }

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')

        return this.jobs.filter((j) => {
          if (!j.date) return false
          return dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]')
        })
      }

      return this.jobs.filter((j) => {
        if (!j.date) return false
        const d = dayjs(j.date)
        return d.isBetween(this.weekStart, this.weekEnd, 'day', '[]')
      })
    },

    weekLabel() {
      if (this.currentPeriod === 'total') {
        return 'All time'
      }

      if (this.currentPeriod === 'month') {
        return this.weekStart.format('MMMM YYYY')
      }

      const s = this.weekStart
      const e = this.weekEnd
      return `${s.format('DD.MM')} - ${e.format('DD.MM.YYYY')}`
    },

    weekStart() {
      if (this.currentPeriod === 'month') {
        return this.currentWeekStart.startOf('month')
      }

      return this.currentWeekStart
    },

    weekEnd() {
      if (this.currentPeriod === 'month') {
        return this.currentWeekStart.endOf('month')
      }

      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    /* ---------- TOP STATS ---------- */

    totalEarnings() {
      return this.filteredJobs.reduce(
        (s, j) => s + (parseFloat(j.earnings) || 0),
        0
      )
    },

    totalJobs() {
      return this.filteredJobs.length
    },

    totalHours() {
      let min = 0

      this.filteredJobs.forEach((j) => {
        const h = parseFloat(
          j.nbHours ||
          j.duration ||
          j.duration_hours ||
          j.hours ||
          j.work_hours
        ) || 0

        min += h * 60
      })

      return min / 60
    },

    currency() {
      return this.jobs[0]?.currency || 'CHF'
    },

    /* ---------- AVERAGE WORK TIME ---------- */

    averageWorkTime() {
      if (!this.filteredJobs.length) return '0h 0m'

      const avg =
        this.filteredJobs.reduce((s, j) => {
          return s + (
            parseFloat(
              j.nbHours ||
              j.duration ||
              j.duration_hours ||
              j.hours ||
              j.work_hours
            ) || 0
          )
        }, 0) / this.filteredJobs.length

      const h = Math.floor(avg)
      const m = Math.round((avg - h) * 60)

      return `${h}h ${m}m`
    },

    /* ---------- CHART DATA ---------- */

    chartSeries() {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      const jobsByDay = Array.from({ length: 7 }, () => [])

      this.filteredJobs.forEach((j) => {
        if (!j.date) return
        let wd = dayjs(j.date).day()
        wd = wd === 0 ? 6 : wd - 1
        jobsByDay[wd].push(j)
      })

      const seriesData = []

      days.forEach((dayName, idx) => {
        const dayJobs = jobsByDay[idx]

        if (dayJobs.length === 0) {
          seriesData.push({
            x: dayName,
            y: [dayjs('2025-01-01T00:00').valueOf(), dayjs('2025-01-01T00:00').valueOf()],
            fillColor: 'transparent',
            meta: { status: 'none' }
          })
        } else {
          dayJobs.forEach((j) => {
            const [sh, sm] = (j.start_time || '00:00').split(':').map(Number)
            const [eh, em] = (j.end_time || '00:00').split(':').map(Number)
            const start = dayjs('2025-01-01').hour(sh).minute(sm).valueOf()
            const end = dayjs('2025-01-01').hour(eh).minute(em).valueOf()
            const statusKey = (j.status || 'unknown').toLowerCase()
            const color = this.statusColors[statusKey] || this.statusColors.unknown

            seriesData.push({
              x: dayName,
              y: [start, end],
              fillColor: color,
              meta: j
            })
          })
        }
      })

      return [{ name: 'Shift', data: seriesData }]
    },

    chartOptions() {
      return {
        chart: {
          type: 'rangeBar',
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
        plotOptions: { bar: { horizontal: true, rangeBarGroupRows: true } },
        xaxis: {
          type: 'datetime',
          labels: { format: 'HH:mm' },
          min: dayjs('2025-01-01T00:00').valueOf(),
          max: dayjs('2025-01-02T00:00').valueOf(),

          tickAmount: 24
        },
        yaxis: {
          type: 'category',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          reversed: true
        },
        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const item = w.config.series[seriesIndex].data[dataPointIndex].meta
            if (item.status === 'none') return null
            return `
              <div class="tooltip-box">
                <strong>${item.date}</strong><br>
                ${item.start_time} - ${item.end_time}<br>
                Earnings: ${item.earnings || '-'}
              </div>
            `
          }
        }
      }
    },

    statusItems() {
      const counts = {}
      this.filteredJobs.forEach((j) => {
        counts[j.status] = (counts[j.status] || 0) + 1
      })

      return Object.keys(counts).map(s => ({
        name: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        count: counts[s],
        color: this.statusColors[s] || '#888'
      }))
    },

    statusColors() {
      return {
        completed: '#1e8449',
        cancelled: '#c0392b',
        booked: '#9b59b6',
        postulated: '#FFC107',
        paid: '#2ecc71',
        unknown: '#888'
      }
    },

    heatmapSeries() {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      const matrix = Array.from({ length: 7 }, () =>
        Array.from({ length: 24 }, () => 0)
      )

      this.jobs.forEach((j) => {
        if (!j.date || !j.start_time || !j.end_time) return

        let wd = dayjs(j.date).day()
        wd = wd === 0 ? 6 : wd - 1

        const [sh, sm] = j.start_time.split(':').map(Number)
        const [eh, em] = j.end_time.split(':').map(Number)

        const start = sh + sm / 60
        let end = eh + em / 60

        if (end < start) end = 24

        for (let h = Math.floor(start); h < Math.ceil(end); h++) {
          if (h >= 0 && h < 24) {
            matrix[wd][h] += 1
          }
        }
      })

      return days.map((day, dIdx) => ({
        name: day,
        data: matrix[dIdx].map((val, h) => ({
          x: `${h}:00`,
          y: Number(val.toFixed(2))
        }))
      }))
    },

    heatmapOptions() {
      return {
        chart: {
          type: 'heatmap',
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          type: 'category',
          title: {
            text: 'Hour of Day'
          }
        },
        yaxis: {
          reversed: true,
          title: {
            text: 'Day of Week'
          }
        },
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                { from: 0, to: 0.1, color: '#eeeeee', name: 'None' },
                { from: 0.1, to: 1, color: '#b3d9ff', name: 'Low' },
                { from: 1, to: 3, color: '#4da3ff', name: 'Medium' },
                { from: 3, to: 100, color: '#003f8c', name: 'High' }
              ]
            }
          }
        },
        tooltip: {
          y: {
            formatter: v => `${v} h total`
          }
        }
      }
    }

  },

  watch: {
    currentPeriod(newVal) {
      if (!this.latestJobDate) return

      if (newVal === 'month') {
        this.currentWeekStart = this.latestJobDate.startOf('month')
        return
      }

      if (newVal === 'total') {
        return
      }

      this.currentWeekStart = this.getMondayOf(this.latestJobDate)
    }
  },

  mounted() {
    if (!this.latestJobDate) return

    if (this.currentPeriod === 'month') {
      this.currentWeekStart = this.latestJobDate.startOf('month')
    } else {
      this.currentWeekStart = this.getMondayOf(this.latestJobDate)
    }

    const alreadyShown = localStorage.getItem('babysitterTourShown')

    if (!alreadyShown) {
      const tour = createBabysitterTour()
      tour.start()
      localStorage.setItem('babysitterTourShown', 'yes')
    }
  },

  methods: {
    prevWeek() {
      if (this.currentPeriod === 'month') {
        this.currentWeekStart = this.currentWeekStart.subtract(1, 'month')
      } else {
        this.currentWeekStart = this.currentWeekStart.subtract(7, 'day')
      }
    },

    nextWeek() {
      if (this.currentPeriod === 'month') {
        this.currentWeekStart = this.currentWeekStart.add(1, 'month')
      } else {
        this.currentWeekStart = this.currentWeekStart.add(7, 'day')
      }
    },

    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    onSelectDay(date) {
      console.log('Selected day:', date)
    }
  }
}
</script>

<style scoped>
/* --- LAYOUT --- */
.layout-container {
  display: grid;
  width: 94%;
  grid-template-rows: auto 20% 1fr;
  grid-template-columns: 70% 1fr;
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

/* TOP BAR */
.box1 {
  grid-column: 1 / 3;
  grid-row: 2 / 3;

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  justify-items: center;
  align-items: center;
}

/* TIMELINE */
.box2 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

/* RIGHT COLUMN BOX 4 */
.box4 {
  grid-column: 2 / 3;
  grid-row: 3 / 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  height: auto;
  align-self: start;
}

.avg-value {
  font-size: 1.6rem;
  margin-top: 8px;
}

/* Legend */
.legend {
  display:flex;
  gap:12px;
  margin-top: 10px;
  flex-wrap: wrap;
}
.legend-item {
  display:flex;
  align-items:center;
  gap:8px;
  font-size: .9rem;
}
.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}

/* Tooltip */
.tooltip-box {
  padding: 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.dev-placeholder{
  text-align:center;
  margin-top:120px;
  color:#777;
  font-size:1.1rem;
}
</style>
