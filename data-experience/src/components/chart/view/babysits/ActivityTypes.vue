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

    <!-- BOX 2 → Heatmap for Week/Month or Bar for Total -->
    <div
      class="box box2 tour-activity-chart"
      :class="{ 'box2--fullwidth': true }"
    >
      <h2 class="mb-4">Activity Types</h2>

      <!-- WEEK VIEW: Heatmap -->
      <div v-if="currentPeriod === 'week' && filteredJobs.length">
        <ApexChart
          :key="'week-heatmap-' + currentWeekStart.format('YYYY-MM-DD')"
          type="heatmap"
          height="450"
          :options="weekHeatmapOptions"
          :series="weekHeatmapSeries"
        />
      </div>

      <!-- MONTH VIEW: Heatmap -->
      <div v-else-if="currentPeriod === 'month' && filteredJobs.length">
        <ApexChart
          :key="'month-heatmap-' + currentWeekStart.format('YYYY-MM')"
          type="heatmap"
          height="450"
          :options="monthHeatmapOptions"
          :series="monthHeatmapSeries"
        />
      </div>

      <!-- TOTAL VIEW: Bar chart -->
      <div v-else-if="currentPeriod === 'total' && filteredJobs.length">
        <div class="total-sort">
          <label><strong>Sort activities by time worked</strong></label>
          <select v-model="totalSortDirection" class="filter-select">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        <ApexChart
          :key="'total-' + totalSortDirection"
          type="bar"
          height="450"
          :options="totalBarOptions"
          :series="totalTypeSeries.series"
        />
      </div>

      <p v-else>No job data found for this {{ currentPeriod }}.</p>
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
dayjs.extend(isBetween)
dayjs.extend(weekday)

export default {
  name: 'BabysitsActivityTypes',
  components: {
    ApexChart: VueApexCharts
  },
  mixins: [mixin],

  data() {
    return {
      currentWeekStart: this.getMondayOf(dayjs()),
      currentPeriod: 'week',
      totalSortDirection: 'desc'
    }
  },

  computed: {
    pageJobTypes() {
      const jobs = this.jobs

      if (this.currentPeriod === 'total') {
        return Array.from(new Set(jobs.map(j => j.job_type)))
      }

      let periodJobs = jobs.filter(j => j.date && dayjs(j.date).isBetween(this.weekStart, this.weekEnd, 'day', '[]'))

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')
        periodJobs = jobs.filter(j => j.date && dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]'))
      }

      return Array.from(new Set(periodJobs.map(j => j.job_type)))
    },

    jobs() {
      return this.values || []
    },

    filteredJobs() {
      const jobs = this.jobs

      if (this.currentPeriod === 'total') {
        return jobs
      }

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')
        return jobs.filter(j => j.date && dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]'))
      }

      return jobs.filter(j => j.date && dayjs(j.date).isBetween(this.weekStart, this.weekEnd, 'day', '[]'))
    },

    weekStart() {
      if (this.currentPeriod === 'month') return this.currentWeekStart.startOf('month')
      return this.currentWeekStart
    },

    weekEnd() {
      if (this.currentPeriod === 'month') return this.currentWeekStart.endOf('month')
      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    weekLabel() {
      if (this.currentPeriod === 'total') return 'Entire Period'
      if (this.currentPeriod === 'month') return this.weekStart.format('MMMM YYYY')
      return `${this.weekStart.format('DD.MM')} - ${this.weekEnd.format('DD.MM.YYYY')}`
    },

    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    // ---------- WEEK HEATMAP ----------
    weekHeatmapSeries() {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const jobTypes = this.pageJobTypes.length ? this.pageJobTypes : ['No data']

      // Create map: jobType -> day -> hours
      const dataMap = {}
      jobTypes.forEach((type) => {
        dataMap[type] = {}
        days.forEach((day) => {
          dataMap[type][day] = 0
        })
      })

      this.filteredJobs.forEach((j) => {
        if (!j.date) return
        const type = j.job_type || 'Other'
        let wd = dayjs(j.date).day()
        wd = wd === 0 ? 6 : wd - 1
        const dayName = days[wd]

        const hours = parseFloat(
          j.nbHours || j.duration || j.duration_hours || j.hours || j.work_hours
        ) || 0

        if (dataMap[type]) {
          dataMap[type][dayName] += hours
        }
      })

      return jobTypes.map(type => ({
        name: type,
        data: days.map(day => ({
          x: day,
          y: Math.round(dataMap[type][day] * 10) / 10
        }))
      }))
    },

    weekHeatmapOptions() {
      return {
        chart: {
          type: 'heatmap',
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: true,
          formatter: val => val > 0 ? `${val}h` : ''
        },
        colors: ['#2ecc71'],
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                { from: 0, to: 0.1, color: '#f0f0f0', name: '<0.1h' },
                { from: 0.1, to: 2, color: '#a8e6cf', name: '0.1-2h' },
                { from: 2.1, to: 4, color: '#56c596', name: '2.1-4h' },
                { from: 4.1, to: 8, color: '#2ecc71', name: '4.1-8h' },
                { from: 8.1, to: 100, color: '#1e8449', name: '8.1h+' }
              ]
            }
          }
        },
        xaxis: {
          type: 'category',
          title: { text: 'Day of Week' }
        },
        yaxis: {
          title: { text: 'Job Type' }
        },
        tooltip: {
          y: {
            formatter: val => `${val} hours`
          }
        }
      }
    },

    // ---------- MONTH HEATMAP ----------
    monthHeatmapSeries() {
      const daysInMonth = this.weekStart.daysInMonth()
      const dayLabels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`)
      const jobTypes = this.pageJobTypes.length ? this.pageJobTypes : ['No data']

      const dataMap = {}
      jobTypes.forEach((type) => {
        dataMap[type] = {}
        dayLabels.forEach((day) => {
          dataMap[type][day] = 0
        })
      })

      this.filteredJobs.forEach((j) => {
        if (!j.date) return
        const type = j.job_type || 'Other'
        const dayOfMonth = dayjs(j.date).date()
        const dayLabel = `${dayOfMonth}`

        const hours = parseFloat(
          j.nbHours || j.duration || j.duration_hours || j.hours || j.work_hours
        ) || 0

        if (dataMap[type]) {
          dataMap[type][dayLabel] += hours
        }
      })

      return jobTypes.map(type => ({
        name: type,
        data: dayLabels.map(day => ({
          x: day,
          y: Math.round(dataMap[type][day] * 10) / 10
        }))
      }))
    },

    monthHeatmapOptions() {
      return {
        chart: {
          type: 'heatmap',
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: true,
          formatter: val => val > 0 ? `${val}h` : '',
          style: {
            fontSize: '10px'
          }
        },
        colors: ['#2ecc71'],
        plotOptions: {
          heatmap: {
            colorScale: {
              ranges: [
                { from: 0, to: 0.1, color: '#f0f0f0', name: '<0.1h' },
                { from: 0.1, to: 2, color: '#a8e6cf', name: '0.1-2h' },
                { from: 2.1, to: 4, color: '#56c596', name: '2.1-4h' },
                { from: 4.1, to: 8, color: '#2ecc71', name: '4.1-8h' },
                { from: 8.1, to: 100, color: '#1e8449', name: '8.1h+' }
              ]
            }
          }
        },
        xaxis: {
          type: 'category',
          title: { text: 'Day of Month' }
        },
        yaxis: {
          title: { text: 'Job Type' }
        },
        tooltip: {
          y: {
            formatter: val => `${val} hours`
          }
        }
      }
    },

    // ---------- TOTAL BAR ----------
    totalTypeSeries() {
      const map = {}

      this.filteredJobs.forEach((j) => {
        const type = j.job_type || 'Other'
        const hours =
          parseFloat(
            j.nbHours ||
            j.duration ||
            j.duration_hours ||
            j.hours ||
            j.work_hours
          ) || 0

        if (!map[type]) map[type] = 0
        map[type] += hours
      })

      const entries = Object.entries(map)

      entries.sort((a, b) => {
        return this.totalSortDirection === 'asc'
          ? a[1] - b[1]
          : b[1] - a[1]
      })

      const categories = entries.map(([type]) => type)
      const data = entries.map(([, hours]) => Number(hours.toFixed(2)))

      return {
        categories,
        series: [
          {
            name: 'Total hours',
            data
          }
        ]
      }
    },

    totalBarOptions() {
      return {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6
          }
        },
        dataLabels: {
          enabled: true,
          formatter: v => `${v} h`
        },
        xaxis: {
          categories: this.totalTypeSeries.categories,
          title: {
            text: 'Total worked hours'
          }
        },
        yaxis: {
          title: {
            text: 'Job type'
          }
        },
        tooltip: {
          y: {
            formatter: v => `${v} h`
          }
        },
        colors: ['#2ecc71']
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
    if (!this.latestJobDate) return

    if (this.currentPeriod === 'month') {
      this.currentWeekStart = this.latestJobDate.startOf('month')
    } else {
      this.currentWeekStart = this.getMondayOf(this.latestJobDate)
    }

    if (window.__continueBabysitterTour) {
      window.__continueBabysitterTour()
      window.__continueBabysitterTour = null
    }
  },

  methods: {
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
    },
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: grid;
  width: 94%;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-left: 16px;
}

.box {
  background-color: #e8e8e8;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  font-size: 1.2rem;
}

.box2 {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.filter-label {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: #333;
}

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

.box2--fullwidth {
  grid-column: 1 / 3;
}

.total-sort {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .layout-container {
    width: 100%;
    margin-left: 8px;
    gap: 12px;
    grid-template-rows: auto auto 1fr;
  }

  .period-switch {
    position: static;
    justify-content: center;
    margin-bottom: 12px;
    grid-row: 1 / 2;
  }

  .week-nav {
    justify-content: center;
    margin-bottom: 12px;
    grid-row: 2 / 3;
  }

  .period-switch .switch-btn,
  .week-nav .nav-btn {
    flex-shrink: 0;
    margin: 0 6px;
  }

  .box2 {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
    margin-bottom: 12px;
  }

  .box2--fullwidth { grid-column: 1 / -1; }
  .filter-select { width: 100%; box-sizing: border-box; }
  .week-label { text-align: center; width: auto; }
}

:deep(.apexcharts-heatmap-rect:hover) {
  stroke: #000;
  stroke-width: 2px;
}
</style>
