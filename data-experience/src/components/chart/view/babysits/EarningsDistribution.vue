<template>
  <div class="layout-container">
    <div class="top-bar">
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

      <div class="week-nav">
        <button class="nav-btn" @click="prevWeek" v-if="currentPeriod !== 'total'">←</button>
        <div class="week-label" :class="`mode-${currentPeriod}`">{{ weekLabel }}</div>
        <button class="nav-btn" @click="nextWeek" v-if="currentPeriod !== 'total'">→</button>
      </div>
    </div>

    <div class="period-descriptions">
      <div v-if="currentPeriod === 'week'" class="period-desc">
        📅 Week view: Earnings patterns by time of day (Morning/Day/Evening/Night)
      </div>
      <div v-if="currentPeriod === 'month'" class="period-desc">
        📆 Month view: Earnings by time of day and filter by activity type
      </div>
      <div v-if="currentPeriod === 'total'" class="period-desc">
        📊 Total view: Average earnings per hour by job activity type
      </div>
    </div>

    <div v-if="currentPeriod === 'total'" class="total-layout">
      <div class="box box2 tour-earnings-chart">
        <div class="header-controls">
          <h2 class="chart-title">{{ earningsHeaderTitle }}</h2>
          <div class="data-mode-switch">
            <span class="switch-label" :class="{ active: totalDataMode === 'total' }">Total</span>
            <label class="switch">
              <input
                type="checkbox"
                :checked="totalDataMode === 'average'"
                @change="totalDataMode = totalDataMode === 'total' ? 'average' : 'total'"
              >
              <span class="slider"></span>
            </label>
            <span class="switch-label" :class="{ active: totalDataMode === 'average' }">Avg/Hour</span>
          </div>
        </div>

        <ApexChart
          type="bar"
          height="450"
          :series="totalStackedBarSeries"
          :options="totalStackedBarOptions"
        />
      </div>

      <div class="box total-bar-chart">
        <div class="bar-header">
          <h2 class="chart-title">Earnings per Hour by Activity</h2>
          <select v-model="sortDirection" class="filter-select sort-select">
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <ApexChart
          type="bar"
          height="350"
          :series="earningsPerHourSeries"
          :options="earningsPerHourOptions"
        />
      </div>
    </div>

    <div v-else class="week-month-layout">
      <div class="box box2 tour-earnings-chart">
        <div class="header-controls">
          <h2 class="chart-title">{{ earningsHeaderTitle }}</h2>
          <p class="chart-subtitle">
            Each bubble represents a group of jobs.
            <br>• Bubble size = total working hours
          </p>
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

          <div v-if="filteredJobsByActivity.length === 0" class="no-data-overlay">
            <p>No job data for this period</p>
          </div>
        </div>
      </div>

      <div class="box box4 tour-jobtype-filter">
        <label for="activityFilter" class="filter-label">
          <strong>Filter by activity</strong>
        </label>
        <select
          id="activityFilter"
          v-model="selectedActivity"
          class="filter-select"
        >
          <option value="">All activities</option>
          <option
            v-for="type in activityTypes"
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
      selectedTotalBucket: null,
      selectedActivity: '',
      sortDirection: 'desc',
      totalDataMode: 'total'
    }
  },

  computed: {
    earningsHeaderTitle() {
      if (this.currentPeriod === 'week') {
        return `Earnings by Time of Day (${this.weekLabel})`
      }
      if (this.currentPeriod === 'month') {
        return `Earnings by Time of Day (${this.weekLabel})`
      }
      return `Average Earnings by Time of Day (${this.weekLabel})`
    },

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

    activityTypes() {
      return Array.from(new Set(this.filteredJobs.map(j => j.job_type).filter(Boolean)))
    },

    filteredJobsByActivity() {
      if (!this.selectedActivity) return this.filteredJobs
      return this.filteredJobs.filter(j => j.job_type === this.selectedActivity)
    },

    timeBucketColors() {
      return {
        Morning: '#36A2EB',
        Day: '#4BC0C0',
        Evening: '#FF6384',
        Night: '#6A9BE8'
      }
    },

    activityTypeColors() {
      const colors = {
        Babysitting: '#FF6B6B',
        Babysits: '#FF6B6B',
        Housekeeping: '#4ECDC4',
        'House Cleaning': '#4ECDC4',
        Tutoring: '#45B7D1',
        Tutors: '#45B7D1',
        'Pet Care': '#FFA07A',
        'Pet Sitting': '#FFA07A',
        'Dog Walking': '#90EE90',
        Errands: '#FFD700',
        Shopping: '#FFD700',
        Laundry: '#DDA0DD',
        Other: '#CCCCCC'
      }
      // Auto-assign colors to unknown activity types
      const types = this.activityTypes
      const defaultColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#90EE90', '#FFD700', '#DDA0DD', '#FF9999', '#99CCFF', '#99FF99']
      types.forEach((type, idx) => {
        if (!colors[type]) {
          colors[type] = defaultColors[idx % defaultColors.length]
        }
      })
      return colors
    },

    xLabels() {
      if (this.currentPeriod === 'month') {
        const monthStart = this.currentWeekStart.startOf('month')
        return this.monthDays.map((d) => {
          const dayDate = monthStart.add(d - 1, 'day')
          const dayName = dayDate.format('ddd')
          return `${d} ${dayName}`
        })
      }
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },

    aggregatedData() {
      const data = {}

      this.filteredJobsByActivity.forEach((job) => {
        const jobDate = dayjs(job.date)

        const dayIndex =
          this.currentPeriod === 'month'
            ? jobDate.date() - 1
            : (jobDate.day() === 0 ? 6 : jobDate.day() - 1)

        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)
        const activityType = job.job_type || 'Other'

        if (!data[dayIndex]) data[dayIndex] = {}
        if (!data[dayIndex][activityType]) data[dayIndex][activityType] = {}
        if (!data[dayIndex][activityType][bucket]) {
          data[dayIndex][activityType][bucket] = {
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

        data[dayIndex][activityType][bucket].startTimes.push(startMinutes)
        data[dayIndex][activityType][bucket].endTimes.push(endMinutes)

        data[dayIndex][activityType][bucket].totalEarnings += Number(job.earnings) || 0
        data[dayIndex][activityType][bucket].totalDuration += Number(
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours
        ) || 0
        data[dayIndex][activityType][bucket].count += 1
      })

      return data
    },

    chartSeries() {
      const activityTypes = this.activityTypes
      const seriesMap = {}

      activityTypes.forEach((type) => {
        seriesMap[type] = { name: type, data: [] }
      })

      Object.entries(this.aggregatedData).forEach(([idx, activities]) => {
        Object.entries(activities).forEach(([activityType, buckets]) => {
          if (!seriesMap[activityType]) {
            seriesMap[activityType] = { name: activityType, data: [] }
          }

          let totalEarnings = 0
          let totalDuration = 0
          let count = 0
          const allStartTimes = []
          const allEndTimes = []

          Object.values(buckets).forEach((metrics) => {
            totalEarnings += metrics.totalEarnings
            totalDuration += metrics.totalDuration
            count += metrics.count
            allStartTimes.push(...metrics.startTimes)
            allEndTimes.push(...metrics.endTimes)
          })

          if (count > 0) {
            seriesMap[activityType].data.push({
              x: Number(idx),
              y: Number(totalEarnings.toFixed(2)),
              z: Number((totalDuration * this.baseHourSize).toFixed(1)),
              count,
              start: Math.min(...allStartTimes),
              end: Math.max(...allEndTimes)
            })
          }
        })
      })

      return Object.values(seriesMap).filter(s => s.data.length > 0)
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
        this.activityTypeColors[s.name] || this.activityTypeColors.Other
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
          opacity: 0.8
        },
        xaxis: {
          type: 'numeric',
          min: 0.0,
          max: this.xLabels.length,
          tickAmount: this.xLabels.length,
          title: {
            text: this.currentPeriod === 'month'
              ? 'Day of month'
              : 'Day of week',
            offsetY: 10
          },
          labels: {
            rotate: this.currentPeriod === 'month' ? -45 : 0,
            rotateAlways: this.currentPeriod === 'month',
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
          },
          padding: {
            bottom: this.currentPeriod === 'month' ? 40 : 10
          }
        },
        plotOptions: {
          bubble: {
            maxBubbleRadius: 45,
            minBubbleRadius: 8,
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
            }
          }
        },
        markers: {
          strokeWidth: 0,
          strokeColors: 'transparent',
          hover: {
            strokeWidth: 2,
            strokeColors: '#000'
          }
        },
        tooltip: {
          enabled: this.filteredJobsByActivity.length > 0,
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
                  ${day} - ${series.name}
                </div>
                <p>Time range: <strong>${fmt(point.start)}-${fmt(point.end)}</strong></p>
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
      return this.activityTypes.map((type) => {
        let count = 0
        Object.values(this.aggregatedData).forEach((activities) => {
          if (activities[type]) {
            Object.values(activities[type]).forEach((metrics) => {
              count += metrics.count
            })
          }
        })
        return {
          name: type,
          label: type,
          color: this.activityTypeColors[type] || this.activityTypeColors.Other,
          count
        }
      }).filter(item => item.count > 0)
    },

    totalStackedBarData() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night']
      const data = {}
      const hours = {}

      bucketKeys.forEach((bucket) => {
        data[bucket] = {}
        hours[bucket] = {}
      })

      this.filteredJobs.forEach((job) => {
        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)
        const activityType = job.job_type || 'Other'

        if (!data[bucket][activityType]) {
          data[bucket][activityType] = 0
          hours[bucket][activityType] = 0
        }

        const earnings = Number(job.earnings) || 0
        const jobHours = Number(
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours
        ) || 0

        data[bucket][activityType] += earnings
        hours[bucket][activityType] += jobHours
      })

      if (this.totalDataMode === 'average') {
        const avgData = {}
        bucketKeys.forEach((bucket) => {
          avgData[bucket] = {}
          Object.entries(data[bucket]).forEach(([activity, earnings]) => {
            const totalHours = hours[bucket][activity]
            avgData[bucket][activity] = totalHours > 0 ? earnings / totalHours : 0
          })
        })
        return avgData
      }

      return data
    },

    totalStackedBarSeries() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night']
      const activityTypes = this.activityTypes
      const data = this.totalStackedBarData

      return activityTypes.map(activityType => ({
        name: activityType,
        data: bucketKeys.map(bucket => data[bucket][activityType] || 0)
      }))
    },

    totalStackedBarOptions() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night']
      const categories = bucketKeys.map(
        key => `${key}\n(${TIME_BUCKETS[key].from}-${TIME_BUCKETS[key].to})`
      )

      return {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        colors: this.activityTypes.map(
          type => this.activityTypeColors[type] || this.activityTypeColors.Other
        ),
        xaxis: {
          categories,
          title: {
            text: 'Time of Day',
            offsetY: 10
          },
          labels: {
            rotate: -45,
            rotateAlways: true,
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          title: {
            text: this.totalDataMode === 'average'
              ? `Average earnings per hour (${this.currency})`
              : `Total earnings (${this.currency})`
          },
          min: 0,
          labels: {
            formatter: (val) => {
              if (val === 0) return '0'
              return parseFloat(val.toFixed(2)).toString()
            }
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%',
            dataLabels: {
              position: 'top'
            },
            stroke: {
              show: true,
              width: 0,
              colors: ['transparent']
            },
            states: {
              hover: {
                filter: {
                  type: 'none'
                },
                stroke: {
                  show: true,
                  width: 2,
                  color: '#000'
                }
              },
              active: {
                filter: {
                  type: 'none'
                }
              }
            }
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (val) => {
              if (this.totalDataMode === 'average') {
                return `${val.toFixed(2)} ${this.currency}/h`
              }
              return `${val.toFixed(2)} ${this.currency}`
            }
          },
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const data = this.totalStackedBarData
            const bucketKey = ['Morning', 'Day', 'Evening', 'Night'][dataPointIndex]
            const bucketRange = TIME_BUCKETS[bucketKey]

            let html = `
              <div class="tooltip-box">
                <div class="tooltip-title">${bucketKey} (${bucketRange.from}-${bucketRange.to})</div>
            `

            const activityBreakdown = data[bucketKey]
            let totalEarnings = 0
            Object.entries(activityBreakdown).forEach(([activity, value]) => {
              const displayValue = this.totalDataMode === 'average'
                ? `${value.toFixed(2)} ${this.currency}/h`
                : `${value.toFixed(2)} ${this.currency}`
              html += `<p><strong>${activity}:</strong> ${displayValue}</p>`
              totalEarnings += value
            })

            const totalLabel = this.totalDataMode === 'average' ? `${this.currency}/h` : this.currency
            html += `
                <p style="margin-top: 8px; border-top: 1px solid #ddd; padding-top: 8px;">
                  <strong>Total: ${totalEarnings.toFixed(2)} ${totalLabel}</strong>
                </p>
              </div>
            `

            return html
          }
        },
        legend: {
          position: 'bottom',
          offsetY: 10
        },
        grid: {
          padding: {
            bottom: 50
          }
        }
      }
    },

    earningsPerHourData() {
      const map = {}

      this.filteredJobs.forEach((j) => {
        const type = j.job_type || 'Other'
        if (!map[type]) map[type] = { earnings: 0, hours: 0 }
        map[type].earnings += Number(j.earnings) || 0
        map[type].hours += Number(
          j.nbHours ||
          j.duration ||
          j.duration_hours ||
          j.hours ||
          j.work_hours
        ) || 0
      })

      const entries = Object.entries(map).map(([type, stats]) => ({
        type,
        rate: stats.hours ? Number((stats.earnings / stats.hours).toFixed(2)) : 0
      }))

      entries.sort((a, b) => {
        return this.sortDirection === 'asc'
          ? a.rate - b.rate
          : b.rate - a.rate
      })

      return entries
    },

    earningsPerHourSeries() {
      const data = this.earningsPerHourData.map(item => item.rate)
      return [{
        name: `${this.currency}/hour`,
        data
      }]
    },

    earningsPerHourOptions() {
      const categories = this.earningsPerHourData.map(item => item.type)

      return {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
            barHeight: '90%',
            dataLabels: {
              position: 'right'
            },
            stroke: {
              show: true,
              width: 0,
              colors: ['transparent']
            },
            states: {
              hover: {
                filter: {
                  type: 'none'
                },
                stroke: {
                  show: true,
                  width: 2,
                  color: '#000'
                }
              },
              active: {
                filter: {
                  type: 'none'
                }
              }
            }
          }
        },
        xaxis: {
          categories,
          title: {
            text: `Earnings per hour (${this.currency}/h)`
          }
        },
        yaxis: {
          title: {
            text: 'Activity Type'
          }
        },
        dataLabels: {
          enabled: true,
          position: 'right',
          offsetX: 0,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: ['#333']
          },
          formatter: val => val.toFixed(2)
        },
        tooltip: {
          y: {
            formatter: val => `${val.toFixed(2)}`
          }
        },
        colors: ['#2ecc71']
      }
    }
  },

  watch: {
    currentPeriod(newVal) {
      this.selectedTotalBucket = null
      this.selectedActivity = ''

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
    },

    getPeriodDescription(period) {
      const descs = {
        week: 'Earnings patterns by time of day (Morning/Day/Evening/Night)',
        month: 'Earnings by time of day and filter by activity type',
        total: 'Average earnings per hour by job activity type'
      }
      return descs[period] || ''
    }
  }
}
</script>

<style scoped>
.layout-container {
  width: 94%;
  gap: 16px;
  margin-left: 16px;
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
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.header-controls {
  position: sticky;
  top: 0;
  z-index: 5;
  padding-top: 10px;
  padding-bottom: 10px;
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
  display: flex;
  gap: 6px;
}

.period-descriptions {
  margin-top: 45px;
  margin-bottom: 12px;
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

.total-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.total-bar-chart {
  width: 100%;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.sort-select {
  width: auto;
  min-width: 200px;
}

.week-month-layout {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 30px;
}

.week-month-layout .box2 {
  flex: 0 0 75%;
  margin-bottom: 0;
}

.week-month-layout .box4 {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
}

.filter-label {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
  color: #333;
  display: block;
}

.filter-select {
  width: 100%;
  padding: 10px 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1.5px solid #ccc;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-select:hover {
  border-color: #888;
}

.filter-select:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 4px rgba(30, 136, 229, 0.5);
}

.panel-header {
  margin-bottom: 16px;
}

.panel-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
}

.job-item {
  background: white;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s;
  border: 1px solid #ddd;
  margin-bottom: 8px;
}

.job-item:hover {
  background: #f3f3f3;
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

.data-mode-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 0;
}

.switch-label {
  font-size: 0.9rem;
  color: #999;
  font-weight: 500;
  transition: color 0.2s;
}

.switch-label.active {
  color: #1e88e5;
  font-weight: 600;
}

/* Switch styling */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: all 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: all 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .slider {
  background-color: #1e88e5;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

.toggle-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #bbb;
  background: #e8e8e8;
  color: #333;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.toggle-btn:hover {
  background: #d8d8d8;
  border-color: #888;
}

.toggle-btn.active {
  background: #1e88e5;
  color: white;
  border-color: #1565c0;
  font-weight: 600;
}

.activity-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item-detailed {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  background: #f9f9f9;
  font-size: 0.95rem;
  color: #333;
  border: 1px solid #eee;
}

.legend-swatch-large {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
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

.chart-subtitle {
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
  max-width: 720px;
}

/* Top bar: align period switch and week-nav in one row */
.top-bar {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.top-bar .period-switch {
  display: flex;
  gap: 6px;
  margin-bottom: 0;
}

.top-bar .week-nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 0;
}

.period-descriptions { margin-top: 0; margin-bottom: 12px; }

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

  .total-layout {
    flex-direction: column;
  }

  .bar-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .sort-select {
    width: 100%;
  }

  .week-month-layout {
    flex-direction: column;
    align-items: stretch;
  }

  .week-month-layout .box2 {
    flex: 1 1 100%;
    margin-bottom: 12px;
  }

  .week-month-layout .box4 {
    flex: 1 1 100%;
  }

  .box {
    padding: 12px;
  }

  .chart-wrapper {
    margin-top: 8px;
  }

  .legend {
    justify-content: center;
  }
}
</style>
