<template>
  <div class="fhnw-view">
    <PeriodToolbar
      :mode="currentPeriod"
      :label="weekLabel"
      :descriptions="periodDescriptions"
      @mode="periodStore.setMode($event)"
      @prev="prevWeek"
      @next="nextWeek"
    />

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
    <ViewCard class="box2 tour-activity-chart mt-3" title="Activity Types">

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
        <VSelect
          v-model="totalSortDirection"
          class="total-sort"
          label="Sort activities by time worked"
          :items="[{ text: 'Descending', value: 'desc' }, { text: 'Ascending', value: 'asc' }]"
          outlined
          dense
          hide-details
        />

        <HorizontalBarChart
          :key="'total-' + totalSortDirection"
          :options="totalBarOptions"
          :series="totalTypeSeries.series"
          height="450"
        />
      </div>

      <p v-else>No job data found for this {{ currentPeriod }}.</p>
    </ViewCard>

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
import PeriodToolbar from '../shared/PeriodToolbar.vue'
import ViewCard from '../shared/ViewCard.vue'
dayjs.extend(isBetween)
dayjs.extend(weekday)

export default {
  name: 'YoojoActivityTypes',
  components: {
    HeatmapChart,
    HorizontalBarChart,
    PeriodToolbar,
    ViewCard
  },
  mixins: [mixin],

  data() {
    return {
      periodStore,
      totalSortDirection: 'desc'
    }
  },

  computed: {
    periodDescriptions() {
      return {
        week: '📅 Week view: Hours distribution across job types for each day',
        month: '📆 Month view: Hours distribution across all days of the month',
        total: '📊 Total view: Ranking of all job types by total hours worked'
      }
    },

    // Get the description text for each period mode to show in the tooltip
    currentPeriod() {
      return periodStore.mode
    },

    // Get the start date of the current week based on the period store
    currentWeekStart() {
      return dayjs(periodStore.periodStart)
    },

    // Get a mapping of activity types to colors for consistent coloring across charts and legends
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

    // Get the list of activity types present in the current filtered jobs,
    // to show in the legends and charts
    activityLegendItems() {
      return this.pageJobTypes.map(type => ({
        type,
        color: this.activityTypeColors[type] || '#999'
      }))
    },

    // Get the list of activity types present in the current filtered jobs,
    // to show in the legends and charts
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

    // Get the series data for the week heatmap, aggregating hours worked by
    // activity type and day of week
    hasActiveFilters() {
      return this.currentPeriod === 'total' && this.totalSortDirection !== 'desc'
    },

    // Get the list of all jobs from the props, which will be filtered and processed
    jobs() {
      return this.values || []
    },

    // Get the filtered list of jobs based on the current period selection, to be
    // used in all charts and calculations, ensuring that only relevant jobs are
    // considered for the selected time frame
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

    // Get the categories (days of week) for the heatmap charts,
    // which will be the same for both week and month views
    weekStart() {
      if (this.currentPeriod === 'month') return this.currentWeekStart.startOf('month')
      return this.currentWeekStart
    },

    // Get the end date of the current week based on the period store
    weekEnd() {
      if (this.currentPeriod === 'month') return this.currentWeekStart.endOf('month')
      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    // Get the label to display in the center of the week navigation
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

    // Get the earliest job date from all jobs, to show in the total view label
    earliestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
    },

    // Get the latest job date from all jobs, to show in the total view label
    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    // Get the series data for the week heatmap, aggregating hours worked
    // by activity type and day of week
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

    // Get the options for the week heatmap, configuring the appearance
    // and behavior of the chart
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

    // Get the series data for the month heatmap, aggregating hours worked
    // by activity type and day of month, with labels like "15 Wed" for each day
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

    // Get the options for the month heatmap
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

    // Get the series data for the total view bar chart, aggregating total hours worked
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

    // Get the options for the total view bar chart
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
    // Watch for changes in the period mode (week/month/total)
    // and update the period accordingly
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

    if (window.__continueYoojoTour) {
      window.__continueYoojoTour()
      window.__continueYoojoTour = null
    }
  },

  methods: {
    /**
     * Navigates to the previous week or month based on the current period mode,
     * by calculating the new start and end dates and updating the period store accordingly
     */
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

    /**
     * Navigates to the next week or month based on the current period mode
     */
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

    /**
     * Gets the Monday of the week containing the given date
     * @param d
     */
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    /**
     * Gets the description for a given period mode
     * @param period
     */
    getPeriodDescription(period) {
      const descs = {
        week: 'Hours distribution across job types for each day',
        month: 'Hours distribution across all days of the month',
        total: 'Ranking of all job types by total hours worked'
      }
      return descs[period] || ''
    },

    /**
     * Clears all active filters by resetting the total sort direction to its default value
     */
    clearAllFilters() {
      this.totalSortDirection = 'desc'
    }
  }
}
</script>

<style scoped>
.total-sort {
  max-width: 320px;
  margin-bottom: 12px;
}

.chart-explanation {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #555;
}

/* Active Filters Bar */
.active-filters {
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

:deep(.apexcharts-heatmap-rect:hover) {
  stroke: #000;
  stroke-width: 2px;
}
</style>
