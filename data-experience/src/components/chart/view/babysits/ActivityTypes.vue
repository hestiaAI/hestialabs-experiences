<template>
  <div class="layout-container">
    <div class="period-switch">
      <button
        v-for="p in ['week','month','total']"
        :key="p"
        :class="['switch-btn', { active: currentPeriod === p }]"
        @click="periodStore.setMode(p)"
        :title="getPeriodDescription(p)"
      >
        {{ p.toUpperCase() }}
      </button>
    </div>

    <div class="period-descriptions">
      <div v-if="currentPeriod === 'week'" class="period-desc">
        📅 Week view: Hours distribution across job types for each day
      </div>
      <div v-if="currentPeriod === 'month'" class="period-desc">
        📆 Month view: Hours distribution across all days of the month
      </div>
      <div v-if="currentPeriod === 'total'" class="period-desc">
        📊 Total view: Ranking of all job types by total hours worked
      </div>
    </div>

    <div class="week-nav">
      <div class="week-nav-wrapper">
        <button class="nav-btn" @click="prevWeek" v-if="currentPeriod !== 'total'">←</button>
        <div class="week-label" :class="`mode-${currentPeriod}`">{{ weekLabel }}</div>
        <button class="nav-btn" @click="nextWeek" v-if="currentPeriod !== 'total'">→</button>
      </div>
    </div>

    <!-- Active Filters Bar -->
    <div class="active-filters" v-if="hasActiveFilters">
      <span class="filters-label">Filters:</span>
      <span v-if="currentPeriod === 'total' && totalSortDirection !== 'desc'" class="filter-badge">
        Sort: {{ totalSortDirection }}
        <button class="badge-close" @click="totalSortDirection = 'desc'">✕</button>
      </span>
      <button class="clear-all-btn" @click="clearAllFilters">Clear All</button>
    </div>

    <!-- BOX 2 → Heatmap for Week/Month or Bar for Total -->
    <div
      class="box box2 tour-activity-chart"
      :class="{ 'box2--fullwidth': true }"
    >
      <h2 class="mb-4">Activity Types</h2>

      <!-- WEEK VIEW: Heatmap -->
      <div v-if="currentPeriod === 'week' && filteredJobs.length">
        <HeatmapChart
          :key="'week-heatmap-' + currentWeekStart.format('YYYY-MM-DD')"
          :options="weekHeatmapOptions"
          :series="weekHeatmapSeries"
          height="450"
        />
        <p class="chart-explanation">
          <strong>How to read this visualization:</strong><br />
          Rows show different activity types.<br />
          Columns represent days of the week.<br />
          Darker cells mean more hours worked for that activity on that day.
        </p>
        <div class="activity-legend">
          <div
            v-for="item in activityLegendItems"
            :key="item.type"
            class="legend-item"
          >
            <span
              class="legend-swatch"
              :style="{ background: item.color }"
            />
            <div>
              <strong>{{ item.type }}</strong><br />
            </div>
          </div>
        </div>
      </div>

      <!-- MONTH VIEW: Heatmap -->
      <div v-else-if="currentPeriod === 'month' && filteredJobs.length">
        <HeatmapChart
          :key="'month-heatmap-' + currentWeekStart.format('YYYY-MM')"
          :options="monthHeatmapOptions"
          :series="monthHeatmapSeries"
          height="450"
        />
        <p class="chart-explanation">
          <strong>How to read this visualization:</strong><br />
          Rows show different activity types.<br />
          Columns represent days of the week.<br />
          Darker cells mean more hours worked for that activity on that day.
        </p>
        <div class="activity-legend">
          <div
            v-for="item in activityLegendItems"
            :key="item.type"
            class="legend-item"
          >
            <span
              class="legend-swatch"
              :style="{ background: item.color }"
            />
            <div>
              <strong>{{ item.type }}</strong><br />
            </div>
          </div>
        </div>
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

        <HorizontalBarChart
          :key="'total-' + totalSortDirection"
          :options="totalBarOptions"
          :series="totalTypeSeries.series"
          height="450"
        />
      </div>

      <p v-else>No job data found for this {{ currentPeriod }}.</p>
    </div>

  </div>
</template>

<script>
import mixin from '@/components/chart/view/mixin'
import HeatmapChart from './charts/HeatmapChart.vue'
import HorizontalBarChart from './charts/HorizontalBarChart.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'
import { periodStore } from './store/periodStore'
dayjs.extend(isBetween)
dayjs.extend(weekday)

export default {
  name: 'BabysitsActivityTypes',
  components: {
    HeatmapChart,
    HorizontalBarChart
  },
  mixins: [mixin],

  data() {
    return {
      periodStore,
      totalSortDirection: 'desc'
    }
  },

  computed: {
    currentPeriod() {
      return periodStore.mode
    },
    currentWeekStart() {
      return dayjs(periodStore.periodStart)
    },
    activityTypeColors() {
      const palette = [
        '#1abc9c',
        '#3498db',
        '#9b59b6',
        '#e67e22',
        '#e74c3c',
        '#2ecc71'
      ]

      const types = Array.from(
        new Set(this.jobs.map(j => j.job_type).filter(Boolean))
      )

      const map = {}
      types.forEach((t, i) => {
        map[t] = palette[i % palette.length]
      })

      return map
    },

    activityLegendItems() {
      return this.pageJobTypes.map(type => ({
        type,
        color: this.activityTypeColors[type] || '#999'
      }))
    },

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

    hasActiveFilters() {
      return this.currentPeriod === 'total' && this.totalSortDirection !== 'desc'
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
      if (this.currentPeriod === 'total') {
        const earliest = this.earliestJobDate
        const latest = this.latestJobDate
        if (!earliest || !latest) return 'Entire Period'
        return `${earliest.format('DD.MM.YYYY')} - ${latest.format('DD.MM.YYYY')} (All time)`
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
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            filter: {
              type: 'none'
            }
          }
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
          labels: {
            style: {
              colors: this.pageJobTypes.map(
                t => this.activityTypeColors[t] || '#333'
              ),
              fontSize: '12px',
              fontWeight: 600
            }
          }
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
      const dayLabels = []

      // Create labels like "1 Mon", "2 Tue", etc.
      for (let i = 1; i <= daysInMonth; i++) {
        const date = this.weekStart.date(i)
        let wd = date.day()
        wd = wd === 0 ? 6 : wd - 1
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        dayLabels.push(`${i} ${dayNames[wd]}`)
      }

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

        // Find the label for this day (e.g., "15 Wed")
        const date = this.weekStart.date(dayOfMonth)
        let wd = date.day()
        wd = wd === 0 ? 6 : wd - 1
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const dayLabel = `${dayOfMonth} ${dayNames[wd]}`

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
          toolbar: { show: false },
          height: 450
        },
        states: {
          hover: {
            filter: {
              type: 'none'
            }
          },
          active: {
            filter: {
              type: 'none'
            }
          }
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
          title: { text: 'Day of Month' },
          tickAmount: 10,
          labels: {
            rotate: -45,
            rotateAlways: true,
            hideOverlappingLabels: true,
            style: {
              fontSize: '10px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: this.pageJobTypes.map(
                t => this.activityTypeColors[t] || '#333'
              ),
              fontSize: '12px',
              fontWeight: 600
            }
          }
        },
        tooltip: {
          y: {
            formatter: val => `${val} hours`
          }
        },
        grid: {
          padding: {
            bottom: 30
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
    'periodStore.mode': function(newVal) {
      const currentDate = dayjs(periodStore.periodStart || dayjs())

      if (newVal === 'month') {
        const monthStart = currentDate.startOf('month')
        const monthEnd = currentDate.endOf('month')
        periodStore.setPeriod(monthStart.toISOString(), monthEnd.toISOString())
      } else if (newVal === 'week') {
        const monday = this.getMondayOf(currentDate)
        periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
      }
    }
  },

  mounted() {
    // Initialize period store from jobs
    periodStore.initFromShifts(this.jobs)

    if (!this.latestJobDate) return

    if (periodStore.mode === 'month') {
      periodStore.setPeriod(this.latestJobDate.startOf('month').toISOString(), this.latestJobDate.endOf('month').toISOString())
    } else {
      const monday = this.getMondayOf(this.latestJobDate)
      periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
    }

    if (window.__continueBabysitterTour) {
      window.__continueBabysitterTour()
      window.__continueBabysitterTour = null
    }
  },

  methods: {
    prevWeek() {
      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)
      if (periodStore.mode === 'month') {
        const newStart = currentStart.subtract(1, 'month')
        const newEnd = currentEnd.subtract(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'week') {
        const newStart = currentStart.subtract(7, 'day')
        const newEnd = currentEnd.subtract(7, 'day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },
    nextWeek() {
      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)
      if (periodStore.mode === 'month') {
        const newStart = currentStart.add(1, 'month')
        const newEnd = currentEnd.add(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else if (periodStore.mode === 'week') {
        const newStart = currentStart.add(7, 'day')
        const newEnd = currentEnd.add(7, 'day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    getPeriodDescription(period) {
      const descs = {
        week: 'Hours distribution across job types for each day',
        month: 'Hours distribution across all days of the month',
        total: 'Ranking of all job types by total hours worked'
      }
      return descs[period] || ''
    },

    clearAllFilters() {
      this.totalSortDirection = 'desc'
    }
  }
}
</script>

<style scoped>
.layout-container {
  display: grid;
  width: 98%;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-left: 12px;
}

.period-switch {
  grid-row: 1 / 2;
  position: absolute;
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

.period-descriptions {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  padding-top: 45px;
  padding-left: 0;
  margin-top: 0;
}

.period-desc {
  font-size: 0.85rem;
  color: #666;
  font-weight: 400;
  margin: 0;
}

.week-nav {
  grid-row: 1 / 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  height: 32px;
}

.week-nav-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
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
  width: 240px;
  padding: 4px 12px;
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #bbb;
}

.week-label.mode-week {
  background: #e3f2fd;
  border-color: #2196f377;
  color: #0d47a1;
}

.week-label.mode-month {
  background: #e8f5e9;
  border-color: #4caf5077;
  color: #1b5e20;
}

.week-label.mode-total {
  width: 324px;
  background: #fff3e0;
  border-color: #ff9800bb;
  color: #e65100;
}

.box {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.19),
              0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
  padding: 20px;
  font-size: 1.2rem;
}

.box2 {
  grid-column: 1 / 2;
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

.box2--fullwidth {
  grid-column: 1 / 4;
}

.total-sort {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.chart-explanation {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #555;
}

.right-column {
  align-content: start;
  grid-column: 2 / 3;
  grid-row: 3 / 4;

  display: grid;
  grid-template-rows: auto auto;
  gap: 16px;
}

/* Active Filters Bar */
.active-filters {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.filters-label {
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #333;
}

.badge-close {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  transition: color 0.2s;
}

.badge-close:hover {
  color: #e74c3c;
}

.clear-all-btn {
  margin-left: auto;
  padding: 4px 8px;
  background: #f0f0f0;
  border: 1px solid #bbb;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #666;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #e0e0e0;
  color: #333;
}

@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    width: 94%;
  }

  .period-switch {
    position: static;
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 20px;
  }

  .period-descriptions {
    grid-column: 1 / 2;
    grid-row: auto;
    padding-top: 0;
    margin-top: 0;
    text-align: center;
  }

  .week-nav {
    grid-column: 1 / 2;
    grid-row: auto;
    justify-content: center;
    margin-bottom: 20px;
  }

  .box2 {
    grid-column: 1 / -1;
    grid-row: 4 / 5; /* place heatmap/bar below week-nav */
    margin-bottom: 12px;
  }

  .box2--fullwidth { grid-column: 1 / -1; }
  .filter-select { width: 100%; box-sizing: border-box; }
}

.activity-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}
.legend-item {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  align-items: flex-start;
}
.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  margin-top: 2px;
}
.legend-desc {
  color: #666;
  font-size: 0.75rem;
}

:deep(.apexcharts-heatmap-rect:hover) {
  stroke: #000;
  stroke-width: 2px;
}
</style>
