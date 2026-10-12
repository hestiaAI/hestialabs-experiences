<template>
  <div class="yoojo-view">
    <PeriodToolbar
      :mode="currentPeriod"
      :label="weekLabel"
      :descriptions="periodDescriptions"
      @mode="periodStore.setMode($event)"
      @prev="prevWeek"
      @next="nextWeek"
    />

    <!-- Active Filters Bar -->
    <div v-if="hasActiveFilters" class="active-filters mt-3">
      <span class="filters-label">Filters:</span>
      <span v-if="selectedJobType" class="filter-badge">
        {{ selectedJobType }}
        <button class="badge-close" @click="selectedJobType = ''">✕</button>
      </span>
      <button class="clear-all-btn" @click="clearAllFilters">Clear All</button>
    </div>

    <KpiTiles class="box1 mt-3" :items="kpis" />

    <VRow class="mt-1">
      <VCol cols="12" md="8">
        <ViewCard class="box2" title="Shift Timeline">
          <div v-if="currentPeriod === 'week' && jobs.length" class="chart-wrapper">
            <!-- Overlay if no earnings data -->
            <div v-if="!hasEarningsData" class="calendar-overlay">
              <div class="overlay-box">
                <div class="overlay-title">No earnings data</div>
                <div class="overlay-text">
                  Check whether your dataset is empty, or select another period.
                </div>
              </div>
            </div>

            <ShiftRangeChart :options="chartOptions" :series="chartSeries" height="450" />

            <div class="legend mt-4">
              <div
                v-for="item in activityLegendItems"
                :key="item.label"
                class="legend-item"
              >
                <span
                  class="legend-swatch"
                  :style="{ background: item.color }"
                />
                {{ item.label }} ({{ item.count }})
              </div>
            </div>
          </div>

          <div v-else-if="currentPeriod == 'month' && currentWeekStart.isValid()">
            <MonthlyCalendar
              :key="`bs-${calendarYear}-${calendarMonth}-${periodStore.periodStart}-${periodStore.periodEnd}`"
              :year="calendarYear"
              :month="calendarMonth"
              :shifts="shiftsThisPeriod"
              :payments="paymentsInRange"
              :selectedDate="selectedCalendarDate"
              @select-day="onSelectDay"
            />
          </div>

          <div v-else-if="currentPeriod === 'total'">
            <HeatmapChart :key="'heatmap-total'" :series="heatmapSeries" :options="heatmapOptions" height="450" />
          </div>

          <p v-else>No job data found.</p>
        </ViewCard>
      </VCol>

      <VCol cols="12" md="4">
        <ViewCard class="avg-box" title="Average Work Time">
          <span class="text-h5">{{ averageWorkTime }}</span>
        </ViewCard>
        <ViewCard class="tour-jobtype-filter mt-3" title="Filter by Job Type">
          <VSelect
            v-model="selectedJobType"
            :items="jobTypeItems"
            outlined
            dense
            hide-details
          />
        </ViewCard>
      </VCol>
    </VRow>
  </div>
</template>

<script>
import { createYoojoTour } from './onboarding/yoojoTour'
import MonthlyCalendar from './MonthlyCalendar.vue'
import mixin from '@/components/chart/view/mixin'
import ShiftRangeChart from './charts/ShiftRangeChart.vue'
import HeatmapChart from './charts/HeatmapChart.vue'
import KpiTiles from '../shared/KpiTiles.vue'
import PeriodToolbar from '../shared/PeriodToolbar.vue'
import ViewCard from '../shared/ViewCard.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'
import { periodStore } from './store/periodStore'
dayjs.extend(isBetween)
dayjs.extend(weekday)

export default {
  name: 'YoojoShiftTimeline',
  components: {
    MonthlyCalendar,
    ShiftRangeChart,
    HeatmapChart,
    KpiTiles,
    PeriodToolbar,
    ViewCard
  },
  mixins: [mixin],

  data() {
    return {
      periodStore,
      selectedJobType: '',
      fromCalendarClick: false,
      selectedCalendarDate: null
    }
  },

  computed: {
    periodDescriptions() {
      return {
        week: '📅 Week view: See your shifts and key metrics for each day of the week',
        month: '📆 Month view: Click on any day to view that week',
        total: '📊 Total view: Your overall statistics and patterns across all time'
      }
    },

    kpis() {
      const hours = Math.floor(this.totalHours)
      const minutes = Math.round((this.totalHours - hours) * 60)
      return [
        { label: 'Total Earnings', value: `${this.totalEarnings.toFixed(2)} ${this.currency}` },
        { label: 'Total Hours Worked', value: `${hours}h ${minutes}m` },
        { label: 'Number of Jobs', value: this.totalJobs }
      ]
    },

    jobTypeItems() {
      return [{ text: 'All', value: '' }, ...this.pageJobTypes]
    },

    // Current period mode (week, month, total)
    currentPeriod() {
      return periodStore.mode
    },

    // Start of the current week (Monday)
    currentWeekStart() {
      return dayjs(periodStore.periodStart)
    },

    // Mapping of job types to colors for the timeline
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

    // Get unique job types for the current period to populate filter dropdown
    pageJobTypes() {
      const jobs = this.jobs

      if (this.currentPeriod === 'total') {
        return Array.from(
          new Set(jobs.map(j => j.job_type).filter(Boolean))
        )
      }

      let periodJobs = []

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')

        periodJobs = jobs.filter(j =>
          j.date && dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]')
        )
      } else {
        periodJobs = jobs.filter(j =>
          j.date && dayjs(j.date).isBetween(this.weekStart, this.weekEnd, 'day', '[]')
        )
      }

      return Array.from(
        new Set(periodJobs.map(j => j.job_type).filter(Boolean))
      )
    },

    // All jobs from the dataset
    jobs() {
      return this.values || []
    },

    // Year and month for the calendar view
    calendarYear() {
      return this.weekStart.year()
    },

    // Month is 0-indexed in dayjs, but we want to display it as 1-12
    calendarMonth() {
      return this.weekStart.month()
    },

    // Shifts for the current period, used in the calendar view
    shiftsThisPeriod() {
      return this.filteredJobs
    },

    // Payments for the current period, used in the calendar view
    paymentsInRange() {
      return []
    },

    // Filtered jobs based on selected period and job type
    filteredJobs() {
      let jobs = this.jobs

      if (this.selectedJobType) {
        jobs = jobs.filter(j => j.job_type === this.selectedJobType)
      }

      if (this.currentPeriod === 'total') {
        return jobs
      }

      if (this.currentPeriod === 'month') {
        const mStart = this.currentWeekStart.startOf('month')
        const mEnd = this.currentWeekStart.endOf('month')

        return jobs.filter((j) => {
          if (!j.date) return false
          return dayjs(j.date).isBetween(mStart, mEnd, 'day', '[]')
        })
      }

      return jobs.filter((j) => {
        if (!j.date) return false
        const d = dayjs(j.date)
        return d.isBetween(this.weekStart, this.weekEnd, 'day', '[]')
      })
    },

    // Check if there is any earnings data in the filtered jobs for the current period
    hasEarningsData() {
      return this.filteredJobs.some(j => (parseFloat(j.earnings) || 0) > 0)
    },

    // Label to display for the current period (e.g. "01.09.2023 - 07.09.2023" for week, "September 2023" for month)
    weekLabel() {
      if (this.currentPeriod === 'total') {
        const earliest = this.earliestJobDate
        const latest = this.latestJobDate
        if (!earliest || !latest) return 'Entire Period'
        return `${earliest.format('DD.MM.YYYY')} - ${latest.format('DD.MM.YYYY')} (All time)`
      }

      if (this.currentPeriod === 'month') {
        return this.weekStart.format('MMMM YYYY')
      }

      const s = this.weekStart
      const e = this.weekEnd
      return `${s.format('DD.MM')} - ${e.format('DD.MM.YYYY')}`
    },

    // Get the earliest job date from the dataset, used for labeling the total period
    earliestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
    },

    // Start of the week for the current period, used for filtering jobs and labeling
    weekStart() {
      if (this.currentPeriod === 'month') {
        return this.currentWeekStart.startOf('month')
      }

      return this.currentWeekStart
    },

    // End of the week for the current period, used for filtering jobs and labeling
    weekEnd() {
      if (this.currentPeriod === 'month') {
        return this.currentWeekStart.endOf('month')
      }

      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    // Get the latest job date from the dataset, used for labeling the total period
    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    // Calculate total earnings for the filtered jobs in the current period
    totalEarnings() {
      return this.filteredJobs.reduce(
        (s, j) => s + (parseFloat(j.earnings) || 0),
        0
      )
    },

    // Calculate total number of jobs for the filtered jobs in the current period
    totalJobs() {
      return this.filteredJobs.length
    },

    // Calculate total hours worked for the filtered jobs in the current period
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

    // Get the currency from the first job in the dataset, or default to 'CHF' if not available
    currency() {
      return this.jobs[0]?.currency || 'CHF'
    },

    // Check if any filters are currently active (e.g. job type filter)
    hasActiveFilters() {
      return !!this.selectedJobType
    },

    // Calculate average work time per job for the filtered jobs in the current period, and format it as "Xh Ym"
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

    // Prepare ApexChart series data for the timeline chart based on the filtered jobs in the current period
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

            let color
            let opacity = 1

            if (statusKey === 'cancelled' || j.earnings === 0) {
              color = '#cccccc'
              opacity = 0.4
            } else {
              color = this.activityTypeColors[j.job_type] || '#888'
            }

            seriesData.push({
              x: dayName,
              y: [start, end],
              fillColor: color,
              opacity,
              meta: j
            })
          })
        }
      })

      return [{ name: 'Shift', data: seriesData }]
    },

    // Prepare ApexChart options for the timeline chart
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
        plotOptions: {
          bar: {
            horizontal: true,
            rangeBarGroupRows: true,
            dataLabels: {
              position: 'center'
            }
          }
        },
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

            const durationMin = (() => {
              const [sh, sm] = item.start_time.split(':').map(Number)
              const [eh, em] = item.end_time.split(':').map(Number)
              const start = sh * 60 + sm
              let end = eh * 60 + em
              if (end < start) end += 24 * 60
              return end - start
            })()

            const durationH = Math.floor(durationMin / 60)
            const durationM = durationMin % 60

            return `
              <div class="tooltip-box">
                <strong>${item.job_type || 'Activity'}</strong><br>
                ${item.date}<br>
                ${item.start_time} - ${item.end_time}<br>
                Status: ${item.status || '-'}<br>
                Duration: ${durationH}h ${durationM}m<br>
                Earnings: ${item.earnings || '-'}
              </div>
            `
          }
        }
      }
    },

    // Generate legend items for the activity types based on the filtered jobs in the current period
    activityLegendItems() {
      const counts = {}

      this.filteredJobs.forEach((j) => {
        const type = j.job_type || 'Unknown'
        counts[type] = (counts[type] || 0) + 1
      })

      return Object.keys(counts).map(t => ({
        label: t,
        count: counts[t],
        color: this.activityTypeColors[t] || '#888'
      }))
    },

    // Calculate total earnings for the filtered jobs in the current period
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

    // Build ApexChart series data for the heatmap chart based on the filtered jobs in the current period
    heatmapSeries() {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

      const matrix = Array.from({ length: 7 }, () =>
        Array.from({ length: 24 }, () => 0)
      )

      this.filteredJobs.forEach((j) => {
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

    // Prepare ApexChart options for the heatmap chart
    heatmapOptions() {
      return {
        chart: {
          type: 'heatmap',
          toolbar: { show: false }
        },
        dataLabels: {
          enabled: true,
          formatter: (val, opts) => {
            const meta = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].meta
            return meta?.job_type || ''
          },
          style: {
            colors: ['#fff'],
            fontSize: '11px',
            fontWeight: 600
          }
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
            shadeIntensity: 0,
            enableShades: false,
            colorScale: {
              ranges: [
                { from: 0, to: 0.1, color: '#eeeeee', name: 'No activity (<0.1 h)' },
                { from: 0.1, to: 2.1, color: '#b3d9ff', name: '0.1-2 h' },
                { from: 2.1, to: 4.1, color: '#4da3ff', name: '2.1-4 h' },
                { from: 4.1, to: 100, color: '#003f8c', name: 'More than 4.1 h' }
              ]
            }
          }
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
        tooltip: {
          y: {
            formatter: v => `${v} hour(s) worked totally`
          }
        }
      }
    }

  },

  watch: {
    // When the period mode changes, reset the selected job
    // type filter and update the period based on the new mode
    'periodStore.mode': function(newVal) {
      this.selectedJobType = ''

      if (this.fromCalendarClick) {
        this.fromCalendarClick = false
        return
      }

      const currentDate = dayjs(periodStore.periodStart || dayjs())

      if (newVal === 'month') {
        const monthStart = currentDate.startOf('month')
        const monthEnd = currentDate.endOf('month')
        periodStore.setPeriod(monthStart.toISOString(), monthEnd.toISOString())
        return
      }

      if (newVal === 'total') {
        return
      }

      // For 'week', set to the week containing currentDate
      const monday = this.getMondayOf(currentDate)
      periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
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

    const alreadyShown = localStorage.getItem('yoojoTourShown')

    if (!alreadyShown) {
      const tour = createYoojoTour()
      tour.start()
      localStorage.setItem('yoojoTourShown', 'yes')
    }
  },

  methods: {
    /**
     * Navigate to the previous week or month based on the current period mode.
       For 'week' mode, subtract 7 days from the current period start and end.
       For 'month' mode, subtract 1 month from the current period start and end.
     */
    prevWeek() {
      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)
      if (periodStore.mode === 'month') {
        const newStart = currentStart.subtract(1, 'month')
        const newEnd = currentEnd.subtract(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else {
        const newStart = currentStart.subtract(7, 'day')
        const newEnd = currentEnd.subtract(7, 'day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },

    /**
     * Navigate to the next week or month based on the current period mode.
       For 'week' mode, add 7 days to the current period start and end.
       For 'month' mode, add 1 month to the current period start and end.
     */
    nextWeek() {
      const currentStart = dayjs(periodStore.periodStart)
      const currentEnd = dayjs(periodStore.periodEnd)
      if (periodStore.mode === 'month') {
        const newStart = currentStart.add(1, 'month')
        const newEnd = currentEnd.add(1, 'month')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      } else {
        const newStart = currentStart.add(7, 'day')
        const newEnd = currentEnd.add(7, 'day')
        periodStore.setPeriod(newStart.toISOString(), newEnd.toISOString())
      }
    },

    /**
     * Get the Monday of the week for a given date
     * @param d
     */
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    /**
     * On calendar day selection, update the period to the week containing the selected date
     * @param date
     */
    onSelectDay(date) {
      const d = dayjs(date)

      this.fromCalendarClick = true
      this.selectedCalendarDate = date
      const monday = this.getMondayOf(d)
      periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
      periodStore.setMode('week')
    },

    /**
     * Get the description for a given period
     * @param period
     */
    getPeriodDescription(period) {
      const descs = {
        week: 'See your shifts and key metrics for each day of the week',
        month: 'Click on any day to view that week',
        total: 'Your overall statistics and patterns across all time'
      }
      return descs[period] || ''
    },

    /**
     * Clear all acitve filters (currently only job type filter) and reset to default view
       This is called when the "Clear All" button is clicked in the active filters bar
     */
    clearAllFilters() {
      this.selectedJobType = ''
    }
  }
}
</script>

<style scoped>

.chart-wrapper {
  position: relative;
}

.calendar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(240, 240, 240, 0.6);
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

/* Message box */
.overlay-box {
  pointer-events: auto;
  text-align: center;
}

.overlay-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.overlay-text {
  font-size: 13px;
  opacity: 0.85;
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

:deep(.apexcharts-heatmap-rect:hover) {
  stroke: #333;
  stroke-width: 1.5px;
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

/* --- MEDIA QUERIES --- */

.tooltip-box {
  padding: 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
