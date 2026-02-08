<template>
  <div class="layout-container">
    <div class="period-switch">
      <button
        v-for="p in ['week','month','total']"
        :key="p"
        :class="['switch-btn', { active: currentPeriod === p }]"
        @click="currentPeriod = p"
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
      <button class="nav-btn" @click="prevWeek" v-if="currentPeriod !== 'total'">←</button>
      <div class="week-label" :class="`mode-${currentPeriod}`">{{ weekLabel }}</div>
      <button class="nav-btn" @click="nextWeek" v-if="currentPeriod !== 'total'">→</button>
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
      currentPeriod: 'week',
      selectedJobType: '',
      fromCalendarClick: false,
      selectedCalendarDate: null
    }
  },

  computed: {
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

    weekLabel() {
      if (this.currentPeriod === 'total') {
        const earliest = this.earliestJobDate
        const latest = this.latestJobDate
        if (!earliest || !latest) return 'Entire Period'
        return `${earliest.format('DD.MM.YYYY')} - ${latest.format('DD.MM.YYYY')}`
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
    currentPeriod(newVal) {
      this.selectedJobType = ''

      if (this.fromCalendarClick) {
        this.fromCalendarClick = false
        return
      }

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
      const d = dayjs(date)

      this.fromCalendarClick = true
      this.selectedCalendarDate = date
      this.currentWeekStart = this.getMondayOf(d)
      this.currentPeriod = 'week'
    },

    getPeriodDescription(period) {
      const descs = {
        week: 'See your shifts and key metrics for each day of the week',
        month: 'Click on any day to view that week',
        total: 'Your overall statistics and patterns across all time'
      }
      return descs[period] || ''
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
  padding: 4px 12px;
  font-weight: 800;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #bbb;
  width: 240px;
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
  width: 280px;
  background: #fff3e0;
  border-color: #ff9800bb;
  color: #e65100;
}

.period-switch {
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  position: absolute;
  display: flex;
  gap: 6px;
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

/* --- MEDIA QUERIES --- */
@media (max-width: 768px) {
  .layout-container {
    width: 100%;
    margin-left: 8px;
    gap: 12px;
    grid-template-rows: auto auto auto 1fr auto;
  }

  .period-switch {
    position: static;
    justify-content: center;
    margin-bottom: 12px;
    grid-column: 1 / -1;
    grid-row: 1 / 2;
  }

  .week-nav {
    justify-content: center;
    margin-bottom: 12px;
    grid-column: 1 / -1;
    grid-row: 2 / 3;
  }

  .period-switch .switch-btn,
  .week-nav .nav-btn {
    flex-shrink: 0;
    margin: 0 6px;
  }

  .box1 {
    grid-column: 1 / -1;
    grid-row: 3 / 4;
    grid-template-columns: 1fr;
    padding: 12px;
    gap: 12px;
  }

  .box2 {
    grid-column: 1 / -1;
    grid-row: 4 / 5;
    margin-bottom: 12px;
    padding: 12px;
  }

  .right-column {
    grid-column: 1 / -1;
    grid-row: 5 / 6;
    display: block;
    gap: 12px;
  }

  .box4, .avg-box, .filter-box {
    width: 100%;
    padding: 12px;
    margin-bottom: 12px;
  }

  .week-label {
    text-align: center;
    width: auto;
  }

  .nav-btn {
    padding: 6px 8px;
  }
}
</style>
