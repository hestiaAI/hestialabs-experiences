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
        📅 Week view: See your shifts and key metrics for each day of the week
      </div>
      <div v-if="currentPeriod === 'month'" class="period-desc">
        📆 Month view: Click on any day to view that week
      </div>
      <div v-if="currentPeriod === 'total'" class="period-desc">
        📊 Total view: Your overall statistics and patterns across all time
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
      <span v-if="selectedJobType" class="filter-badge">
        {{ selectedJobType }}
        <button class="badge-close" @click="selectedJobType = ''">✕</button>
      </span>
      <button class="clear-all-btn" @click="clearAllFilters">Clear All</button>
    </div>

    <!-- BOX 1 → Top Stats -->
    <div class="box box1">
      <div>
        <strong>Total Earnings</strong>
        <div>{{ totalEarnings.toFixed(2) }} {{ currency }}</div>
      </div>

      <div>
        <strong>Total Hours Worked</strong>
        <div>{{ Math.floor(totalHours) }}h {{ Math.round((totalHours - Math.floor(totalHours)) * 60) }}m</div>
      </div>

      <div>
        <strong>Number of Jobs</strong>
        <div>{{ totalJobs }}</div>
      </div>
    </div>

    <!-- BOX 2 → Apex Timeline -->
    <div class="box box2">
      <h2 class="mb-4">Shift Timeline</h2>

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

        <ApexChart
          type="rangeBar"
          height="450"
          :options="chartOptions"
          :series="chartSeries"
        />

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

      <div v-else-if="currentPeriod == 'month'">
        <MonthlyCalendar
          :year="calendarYear"
          :month="calendarMonth"
          :shifts="shiftsThisPeriod"
          :payments="paymentsInRange"
          :selectedDate="selectedCalendarDate"
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
    <div class="right-column">
      <div class="box box4 avg-box">
        <p><strong>Average Work Time</strong></p>
        <p class="avg-value">{{ averageWorkTime }}</p>
      </div>

      <div
        class="box box4 filter-box tour-jobtype-filter"
      >
        <label for="jobTypeSelect" class="filter-label">
          <strong>Filter by Job Type</strong>
        </label>
        <select
          id="jobTypeSelect"
          v-model="selectedJobType"
          class="filter-select"
        >
          <option value="">All</option>
          <option
            v-for="type in pageJobTypes"
            :key="type"
            :value="type"
          >
            {{ type }}
          </option>
        </select>
      </div>
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
import { periodStore } from './store/periodStore'
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
      periodStore,
      selectedJobType: '',
      fromCalendarClick: false,
      selectedCalendarDate: null
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

    hasEarningsData() {
      return this.filteredJobs.some(j => (parseFloat(j.earnings) || 0) > 0)
    },

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

    earliestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
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

    hasActiveFilters() {
      return !!this.selectedJobType
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

    const alreadyShown = localStorage.getItem('babysitterTourShown')

    if (!alreadyShown) {
      const tour = createBabysitterTour()
      tour.start()
      localStorage.setItem('babysitterTourShown', 'yes')
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
      } else {
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
      } else {
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

    onSelectDay(date) {
      const d = dayjs(date)

      this.fromCalendarClick = true
      this.selectedCalendarDate = date
      const monday = this.getMondayOf(d)
      periodStore.setPeriod(monday.toISOString(), monday.add(6, 'day').endOf('day').toISOString())
      periodStore.setMode('week')
    },

    getPeriodDescription(period) {
      const descs = {
        week: 'See your shifts and key metrics for each day of the week',
        month: 'Click on any day to view that week',
        total: 'Your overall statistics and patterns across all time'
      }
      return descs[period] || ''
    },

    clearAllFilters() {
      this.selectedJobType = ''
    }
  }
}
</script>

<style scoped>
/* --- LAYOUT --- */
.layout-container {
  display: grid;
  width: 98%;
  grid-template-rows: auto 108px 1fr;
  grid-template-columns: 70% 1fr;
  gap: 16px;
  margin-left: 12px;
  margin-bottom: 24px;
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
  grid-column: 1 / 3;
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

/* Base box style */
.box {
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
              0 2px 2px 0 rgba(0,0,0,.19),
              0 1px 5px 0 rgba(0,0,0,.17);
  border: 1px solid #bbbbbb99;
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
  padding-bottom: 16px;
}

/* TIMELINE */
.box2 {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

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

/* RIGHT COLUMN BOX 4 */
.box4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  height: auto;
  align-self: start;
  padding-top: 16px;
}

.avg-box p {
  margin: 8px 0;
}

.avg-value {
  font-size: 1.6rem;
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

:deep(.apexcharts-heatmap-rect:hover) {
  stroke: #333;
  stroke-width: 1.5px;
}

.filter-select {
  margin-top: 8px;
  padding: 8px 10px;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #666;
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

/* --- MEDIA QUERIES --- */
@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    width: 94%;
  }

  .period-switch {
    position: static;
    justify-content: center;
    margin-bottom: 12px;
    grid-column: 1 / -1;
    grid-row: 1 / 2;
  }

  /* move description under the switch on small screens */
  .period-descriptions {
    grid-column: 1 / -1;
    grid-row: 2 / 3;
    padding-top: 0;
    margin-top: 0;
    text-align: center;
  }

  .week-nav {
    justify-content: center;
    margin-bottom: 20px;
    grid-column: 1 / -1;
    grid-row: 3 / 4; /* below period-descriptions */
  }

  .box1 {
    grid-column: 1 / -1;
    grid-row: 4 / 5; /* move below nav */
    grid-template-columns: 1fr;
    gap: 12px;
    text-align: center;
  }

  .box2 {
    grid-column: 1 / -1;
    grid-row: 6 / 7; /* push timeline into its own row */
    margin-bottom: 12px;
  }

  .right-column {
    grid-column: 1 / -1;
    grid-row: 5 / 6; /* positioned below the timeline box */
    display: block;
    gap: 12px;
  }

  .box4, .avg-box, .filter-box {
    width: 100%;
    margin-bottom: 12px;
  }
}
</style>
