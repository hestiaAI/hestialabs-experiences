<template>
  <div class="layout-container">

    <!-- BOX 2 → Apex Timeline -->
    <div class="box box2">
      <h2 class="mb-4">Activity Types</h2>

      <div v-if="jobs.length">
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

      <p v-else>No job data found.</p>
    </div>

    <!-- BOX 4 → Filter -->
    <div class="box box4">
      <label for="jobTypeSelect" class="filter-label"><strong>Filter by Job Type</strong></label>
      <select id="jobTypeSelect" v-model="selectedJobType" class="filter-select">
        <option value="">All</option>
        <option v-for="type in jobTypes" :key="type" :value="type">{{ type }}</option>
      </select>
    </div>

  </div>
</template>

<script>
import mixin from '@/components/chart/view/mixin'
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

export default {
  name: 'BabysitsActivityTypes',
  components: { ApexChart: VueApexCharts },
  mixins: [mixin],

  data() {
    return {
      selectedJobType: ''
    }
  },

  computed: {
    // ---------- ORIGINAL JOBS ----------
    jobs() {
      return this.values || []
    },

    // ---------- FILTERED JOBS ----------
    filteredJobs() {
      if (!this.selectedJobType) return this.jobs
      return this.jobs.filter(job => job.job_type === this.selectedJobType)
    },

    // ---------- TOP STATS ----------
    totalEarnings() {
      return this.filteredJobs.reduce((s, j) => s + (parseFloat(j.earnings) || 0), 0)
    },

    totalHours() {
      let min = 0
      this.filteredJobs.forEach((j) => {
        const hours = parseFloat(
          j.nbHours ||
          j.duration ||
          j.duration_hours ||
          j.hours ||
          j.work_hours
        ) || 0
        min += hours * 60
      })
      return min / 60
    },

    currency() {
      return this.filteredJobs[0]?.currency || 'CHF'
    },

    // ---------- AVERAGE WORK TIME ----------
    averageWorkTime() {
      if (!this.filteredJobs.length) return '0h 0m'
      const durations = this.filteredJobs.map(j =>
        parseFloat(
          j.nbHours ||
          j.duration ||
          j.duration_hours ||
          j.hours ||
          j.work_hours
        ) || 0
      )
      const avg = durations.reduce((a, b) => a + b, 0) / durations.length
      const h = Math.floor(avg)
      const m = Math.round((avg - h) * 60)
      return `${h}h ${m}m`
    },

    // ---------- CHART DATA ----------
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
        chart: { type: 'rangeBar', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, rangeBarGroupRows: true } },
        xaxis: {
          type: 'datetime',
          labels: { format: 'HH:mm' },
          min: dayjs('2025-01-01T00:00').valueOf(),
          max: dayjs('2025-01-01T23:59').valueOf()
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

    // ---------- STATUS ITEMS ----------
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

    // ---------- UNIQUE JOB TYPES ----------
    jobTypes() {
      const types = new Set(this.jobs.map(j => j.job_type))
      return Array.from(types)
    },

    // ---------- STATUS COLORS ----------
    statusColors() {
      return {
        completed: '#1e8449',
        cancelled: '#c0392b',
        booked: '#9b59b6',
        postulated: '#FFC107',
        paid: '#2ecc71',
        unknown: '#888'
      }
    }
  }
}
</script>

<style scoped>
/* --- LAYOUT --- */
.layout-container {
  display: grid;
  width: 94%;
  grid-template-rows: 20% 1fr;
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

/* TIMELINE */
.box2 {
  grid-column: 1 / 2;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

/* RIGHT COLUMN BOX 4 */
.box4 {
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  height: auto;
  align-self: start;
  max-width: 300px;
}

.avg-value {
  font-size: 1.6rem;
  margin-top: 8px;
}

/* Legend */
.legend {
  display: flex;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
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

/* Tooltip */
.tooltip-box {
  padding: 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-label {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: #333;
}

/* Select styling */
.filter-select {
  margin-top: 4px;
  padding: 8px 12px;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.filter-select:hover {
  border-color: #888;
}
.filter-select:focus {
  border-color: #1e88e5;
  box-shadow: 0 0 4px rgba(30, 136, 229, 0.5);
  outline: none;
}
</style>
