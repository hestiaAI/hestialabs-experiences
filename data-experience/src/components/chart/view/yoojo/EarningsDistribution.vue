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
      <span v-if="selectedActivity" class="filter-badge">
        {{ selectedActivity }}
        <button class="badge-close" @click="selectedActivity = ''">✕</button>
      </span>
      <span v-if="currentPeriod === 'total' && totalDataMode !== 'total'" class="filter-badge">
        Mode: {{ totalDataMode === 'average' ? 'Avg/Hour' : 'Total' }}
        <button class="badge-close" @click="totalDataMode = 'total'">✕</button>
      </span>
      <span v-if="currentPeriod === 'total' && sortDirection !== 'desc'" class="filter-badge">
        Sort: {{ sortDirection }}
        <button class="badge-close" @click="sortDirection = 'desc'">✕</button>
      </span>
      <button class="clear-all-btn" @click="clearAllFilters">Clear All</button>
    </div>

    <VRow v-if="currentPeriod === 'total'" class="total-layout mt-1">
      <VCol cols="12">
        <ViewCard class="box2 tour-earnings-chart" :title="earningsHeaderTitle">
          <template #actions>
            <VSwitch
              class="data-mode-switch mt-0"
              :input-value="totalDataMode === 'average'"
              label="Avg / hour"
              dense
              hide-details
              @change="totalDataMode = $event ? 'average' : 'total'"
            />
          </template>
          <TotalStackedBar
            :series="totalStackedBarSeries"
            :options="totalStackedBarOptions"
            height="450"
          />
        </ViewCard>
      </VCol>
      <VCol cols="12">
        <ViewCard class="total-bar-chart" title="Earnings per Hour by Activity">
          <template #actions>
            <VSelect
              v-model="sortDirection"
              class="sort-select"
              :items="[{ text: 'Descending', value: 'desc' }, { text: 'Ascending', value: 'asc' }]"
              outlined
              dense
              hide-details
            />
          </template>
          <EarningsPerHourBar
            :series="earningsPerHourSeries"
            :options="earningsPerHourOptions"
            height="350"
          />
        </ViewCard>
      </VCol>
    </VRow>

    <VRow v-else class="week-month-layout mt-1">
      <VCol cols="12" md="8">
        <ViewCard
          class="box2 tour-earnings-chart"
          :title="earningsHeaderTitle"
          subtitle="Each bar represents a group of jobs per day."
        >
          <div class="chart-wrapper">
            <EarningsByDay
              :key="chartRenderKey"
              :series="chartSeries"
              :options="chartOptions"
              height="450"
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
        </ViewCard>
      </VCol>
      <VCol cols="12" md="4">
        <ViewCard class="box4 tour-jobtype-filter" title="Filter by activity">
          <VSelect
            v-model="selectedActivity"
            :items="[{ text: 'All activities', value: '' }, ...activityTypes]"
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
import mixin from '@/components/chart/view/mixin'
import EarningsByDay from './charts/EarningsByDay.vue'
import TotalStackedBar from './charts/TotalStackedBar.vue'
import EarningsPerHourBar from './charts/EarningsPerHourBar.vue'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import weekday from 'dayjs/plugin/weekday'
import isBetween from 'dayjs/plugin/isBetween'
import { periodStore } from './store/periodStore'
import PeriodToolbar from '../shared/PeriodToolbar.vue'
import ViewCard from '../shared/ViewCard.vue'

dayjs.extend(weekday)
dayjs.extend(isBetween)

const TIME_BUCKETS = {
  Morning: { from: '08:00', to: '12:00' },
  Day: { from: '12:00', to: '17:00' },
  Evening: { from: '17:00', to: '22:00' },
  Night: { from: '22:00', to: '08:00' }
}

export default {
  name: 'YoojoEarningsDistribution',
  components: { EarningsByDay, TotalStackedBar, EarningsPerHourBar, PeriodToolbar, ViewCard },
  mixins: [mixin],

  data() {
    return {
      periodStore,
      selectedTotalBucket: null,
      selectedActivity: '',
      sortDirection: 'desc',
      totalDataMode: 'total'
    }
  },

  computed: {
    periodDescriptions() {
      return {
        week: '📅 Week view: Earnings patterns by time of day (Morning/Day/Evening/Night)',
        month: '📆 Month view: Earnings by time of day and filter by activity type',
        total: '📊 Total view: Average earnings per hour by job activity type'
      }
    },

    // Get the current period mode (week, month, total) from the period store
    currentPeriod() {
      return periodStore.mode
    },

    // Navigate to the previous week by subtracting 7 days from the current period start
    currentWeekStart() {
      return dayjs(periodStore.periodStart)
    },

    // Get the header title for the earnings chart based on the current period
    earningsHeaderTitle() {
      if (this.currentPeriod === 'week') {
        return `Earnings by Time of Day (${this.weekLabel})`
      }
      if (this.currentPeriod === 'month') {
        return `Earnings by Time of Day (${this.weekLabel})`
      }
      return `Average Earnings by Time of Day (${this.weekLabel})`
    },

    // Navigate to the previous week
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

    // Get the base size for each hour block in the charts
    baseHourSize() {
      return 10
    },

    // Get the base size for each shift block in the charts (used for scaling)
    baseShiftSize() {
      return 8
    },

    // Get the labels for the days of the month to display on the x-axis in month view
    monthDays() {
      const daysInMonth = this.weekStart.daysInMonth()
      return Array.from({ length: daysInMonth }, (_, i) => i + 1)
    },

    // Get the list of jobs from the input values (shifts) and ensure it's an array
    jobs() {
      return this.values || []
    },

    // Determine the currency to display based on the first job's currency (if available)
    currency() {
      return this.jobs[0]?.currency || 'CHF'
    },

    // Get the start of the current week based on the period store's periodStart
    weekStart() {
      return this.currentWeekStart
    },

    // Get the end of the current week by adding 6 days to the week start
    weekEnd() {
      return this.currentWeekStart.add(6, 'day').endOf('day')
    },

    // Get the latest job date from the list of jobs to determine the end of the total period
    latestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => b.valueOf() - a.valueOf())[0]
    },

    // Get the label to display for the current week or month based on the current period
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

    // Get the earliest job date from the list of jobs to determine the start of the total period
    earliestJobDate() {
      if (!this.jobs.length) return null

      return this.jobs
        .map(j => dayjs(j.date))
        .filter(d => d.isValid())
        .sort((a, b) => a.valueOf() - b.valueOf())[0]
    },

    // Get the list of jobs filtered by the current period (week/month) and excluding cancelled jobs
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

    // Get the unique activity types from the filtered jobs to
    // populate the activity filter dropdown
    activityTypes() {
      return Array.from(new Set(this.filteredJobs.map(j => j.job_type).filter(Boolean)))
    },

    // Determine if there are any active filters applied (activity filter
    // or total view filters) to conditionally show the active filters bar
    hasActiveFilters() {
      if (this.selectedActivity) return true
      if (this.currentPeriod === 'total' && this.totalDataMode !== 'total') return true
      if (this.currentPeriod === 'total' && this.sortDirection !== 'desc') return true
      return false
    },

    // Get the list of jobs further filtered by the selected activity type (if any)
    filteredJobsByActivity() {
      if (!this.selectedActivity) return this.filteredJobs
      return this.filteredJobs.filter(j => j.job_type === this.selectedActivity)
    },

    // Define colors for each time bucket to use in the charts and legends
    timeBucketColors() {
      return {
        Morning: '#36A2EB',
        Day: '#4BC0C0',
        Evening: '#FF6384',
        Night: '#6A9BE8'
      }
    },

    // Get the unique activity types from the filtered jobs to create legend items with counts and colors
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

    // Get the unique activity types from the filtered jobs to create legend items with counts and colors
    categoryTypes() {
      return Array.from(new Set(this.filteredJobs.map(j => j.category).filter(Boolean)))
    },

    // Get the colors for each category to use in the charts and legends, auto-assigning colors to unknown categories
    categoryColors() {
      const palette = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#90EE90', '#FFD700', '#DDA0DD', '#FF9999',
        '#99CCFF', '#99FF99', '#FFB347', '#87CEEB'
      ]
      const result = {}
      this.categoryTypes.forEach((cat, idx) => {
        result[cat] = palette[idx % palette.length]
      })
      return result
    },

    // Get the labels for the x-axis based on the current period (days of
    // month for month view, weekdays for week view)
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

    // Get the time bucket (Morning/Day/Evening/Night) for a given hour of the day
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

    // Get a unique key for the earnings by day chart to force re-render
    // when relevant data or filters change
    chartRenderKey() {
      return [
        this.currentPeriod,
        this.weekLabel,
        this.selectedActivity || 'all',
        this.filteredJobsByActivity.length,
        this.activityTypes.join('|')
      ].join('__')
    },

    // Get the series data for the earnings by day chart, aggregating
    // earnings by activity type and time bucket for each day
    chartSeries() {
      const activityTypes = this.activityTypes
      const labels = this.xLabels

      const earningsMap = {}
      activityTypes.forEach((type) => {
        earningsMap[type] = Array(labels.length).fill(0)
      })

      this.filteredJobsByActivity.forEach((job) => {
        const jobDate = dayjs(job.date)
        const dayIndex = this.currentPeriod === 'month'
          ? jobDate.date() - 1
          : (jobDate.day() === 0 ? 6 : jobDate.day() - 1)

        const type = job.job_type || 'Other'
        if (!earningsMap[type]) earningsMap[type] = Array(labels.length).fill(0)
        earningsMap[type][dayIndex] += Number(job.earnings) || 0
      })

      return activityTypes.map(type => ({
        name: type,
        data: earningsMap[type].map(v => Number(v.toFixed(2)))
      }))
    },

    // Get the metadata for the tooltip, aggregating counts,
    // total duration, and time ranges by activity type and day index
    chartTooltipMeta() {
      const meta = {}

      this.filteredJobsByActivity.forEach((job) => {
        const jobDate = dayjs(job.date)
        const dayIndex = this.currentPeriod === 'month'
          ? jobDate.date() - 1
          : (jobDate.day() === 0 ? 6 : jobDate.day() - 1)

        const type = job.job_type || 'Other'
        if (!meta[type]) meta[type] = {}
        if (!meta[type][dayIndex]) {
          meta[type][dayIndex] = { count: 0, totalDuration: 0, startTimes: [], endTimes: [] }
        }

        const [sh, sm] = (job.start_time || '0:00').split(':').map(Number)
        const startMinutes = sh * 60 + sm
        const duration = Number(
          job.nbHours || job.duration || job.duration_hours || job.hours || job.work_hours
        ) || 0
        const endMinutes = startMinutes + duration * 60

        meta[type][dayIndex].count += 1
        meta[type][dayIndex].totalDuration += duration
        meta[type][dayIndex].startTimes.push(startMinutes)
        meta[type][dayIndex].endTimes.push(endMinutes)
      })

      return meta
    },

    // Get the maximum earnings value across all series and
    // days to set the y-axis scale for the charts
    maxEarnings() {
      let max = 0

      this.chartSeries.forEach((series) => {
        series.data.forEach((p) => {
          if (p.y > max) max = p.y
        })
      })

      return max
    },

    // Get the chart options for the earnings by day chart, configuring
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false }
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
        colors: this.activityTypes.map(
          t => this.activityTypeColors[t] || this.activityTypeColors.Other
        ),
        xaxis: {
          categories: this.xLabels,
          title: {
            text: this.currentPeriod === 'month' ? 'Day of month' : 'Day of week'
          },
          tickAmount: this.currentPeriod === 'month' ? 10 : undefined,
          labels: {
            rotate: this.currentPeriod === 'month' ? -45 : 0,
            rotateAlways: this.currentPeriod === 'month',
            hideOverlappingLabels: true,
            style: { fontSize: '11px' }
          }
        },
        yaxis: {
          title: { text: `Earnings (${this.currency})` },
          min: 0
        },
        tooltip: {
          shared: false,
          intersect: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const seriesName = w.config.series[seriesIndex].name
            const earnings = w.config.series[seriesIndex].data[dataPointIndex]
            const day = this.xLabels[dataPointIndex]

            const fmt = m =>
              `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

            const dayMeta = this.chartTooltipMeta[seriesName]?.[dataPointIndex]

            const timeRange = dayMeta?.startTimes?.length
              ? `${fmt(Math.min(...dayMeta.startTimes))}-${fmt(Math.max(...dayMeta.endTimes))}`
              : '-'

            const duration = dayMeta ? dayMeta.totalDuration.toFixed(1) : '0'
            const count = dayMeta ? dayMeta.count : 0

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">
                  ${day} - ${seriesName}
                </div>
                <p>Time range: <strong>${timeRange}</strong></p>
                <p>Total income: <strong>${Number(earnings).toFixed(2)} ${this.currency}</strong></p>
                <p>Jobs: <strong>${count}</strong></p>
                <p>Duration: <strong>${duration} h</strong></p>
              </div>
            `
          }
        },
        legend: {
          show: false
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '60%'
          }
        },
        dataLabels: { enabled: false },
        grid: {
          padding: {
            bottom: this.currentPeriod === 'month' ? 40 : 10
          }
        }
      }
    },

    // Get the legend items to display below the chart, showing activity
    // types with their corresponding colors and counts
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

    // Get the data for the total stacked bar chart, aggregating earnings
    // by category and time bucket, and calculating averages if in average mode
    totalStackedBarData() {
      const bucketKeys = ['Morning', 'Day', 'Evening']
      const data = {}
      const hours = {}

      bucketKeys.forEach((bucket) => {
        data[bucket] = {}
        hours[bucket] = {}
      })

      this.filteredJobs.forEach((job) => {
        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)
        const category = job.category || 'Other'

        if (!data[bucket][category]) {
          data[bucket][category] = 0
          hours[bucket][category] = 0
        }

        const earnings = Number(job.earnings) || 0
        const jobHours = Number(
          job.nbHours || job.duration || job.duration_hours || job.hours || job.work_hours
        ) || 0

        data[bucket][category] += earnings
        hours[bucket][category] += jobHours
      })

      if (this.totalDataMode === 'average') {
        const avgData = {}
        bucketKeys.forEach((bucket) => {
          avgData[bucket] = {}
          Object.entries(data[bucket]).forEach(([category, earnings]) => {
            const totalHours = hours[bucket][category]
            avgData[bucket][category] = totalHours > 0 ? earnings / totalHours : 0
          })
        })
        return avgData
      }

      return data
    },

    // Get the series data for the total stacked bar chart, transforming
    // the aggregated data into the format required by ApexCharts
    totalStackedBarSeries() {
      const bucketKeys = ['Morning', 'Day', 'Evening']
      const data = this.totalStackedBarData

      return this.categoryTypes.map(category => ({
        name: category,
        data: bucketKeys.map(bucket => data[bucket][category] || 0)
      }))
    },

    // Get the chart options for the total stacked bar chart, configuring
    totalStackedBarOptions() {
      const bucketKeys = ['Morning', 'Day', 'Evening']
      const categories = bucketKeys.map(
        key => `${TIME_BUCKETS[key].from}-${TIME_BUCKETS[key].to}`
      )

      return {
        chart: {
          type: 'bar',
          stacked: true,
          toolbar: { show: false },
          zoom: { enabled: false }
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
        },
        colors: this.categoryTypes.map(
          cat => this.categoryColors[cat] || '#CCCCCC'
        ),
        xaxis: {
          categories,
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
        yaxis: {
          title: {
            text: 'Time of Day',
            offsetY: 10
          },
          labels: {
            rotate: 0,
            rotateAlways: false,
            style: {
              fontSize: '12px'
            }
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 6,
            barHeight: '65%',
            dataLabels: {
              position: 'top'
            },
            stroke: {
              show: true,
              width: 0,
              colors: ['transparent']
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

    // Get the data for the earnings per hour bar chart, calculating the average
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

    // Get the series data for the earnings per hour bar chart, transforming
    earningsPerHourSeries() {
      const data = this.earningsPerHourData.map(item => item.rate)
      return [{
        name: `${this.currency}/hour`,
        data
      }]
    },

    // Get the chart options for the earnings per hour bar chart, configuring
    earningsPerHourOptions() {
      const categories = this.earningsPerHourData.map(item => item.type)

      return {
        chart: {
          type: 'bar',
          toolbar: { show: false }
        },
        grid: {
          padding: {
            right: 20
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 10,
            barHeight: '65%',
            dataLabels: {
              position: 'right'
            },
            stroke: {
              show: true,
              width: 0,
              colors: ['transparent']
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
            fontSize: '13px',
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
    // Watch for changes in the period mode (week/month/total) and update the selected filters and period accordingly
    'periodStore.mode': function(newVal) {
      this.selectedTotalBucket = null
      this.selectedActivity = ''

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
     * Formats a date using dayjs to the format "DD.MM.YYYY"
     * @param date
     */
    formatDate(date) {
      return dayjs(date).format('DD.MM.YYYY')
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
     * Determines the time bucket for a given hour of the day, categorizing
     * it into Morning, Day, Evening, or Night
     * @param h
     */
    getTimeBucketFromHour(h) {
      if (h == null || isNaN(h)) return 'Other'
      if (h >= 8 && h < 12) return 'Morning'
      if (h >= 12 && h < 17) return 'Day'
      if (h >= 17 && h < 22) return 'Evening'
      return 'Night'
    },

    /**
     * Navigates to the previous week or month by updating the period
     * store's periodStart and periodEnd based on the current mode (week or month)
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
     * Navigates to the next week or month
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
     * Gets the description text for each period mode to show in the tooltip
     * @param period
     */
    getPeriodDescription(period) {
      const descs = {
        week: 'Earnings patterns by time of day (Morning/Day/Evening/Night)',
        month: 'Earnings by time of day and filter by activity type',
        total: 'Average earnings per hour by job activity type'
      }
      return descs[period] || ''
    },

    /**
     * Clears all active filters (activity filter, total view mode, and sort direction)
     * and resets them to their default values
     */
    clearAllFilters() {
      this.selectedActivity = ''
      this.totalDataMode = 'total'
      this.sortDirection = 'desc'
    }
  }
}
</script>

<style scoped>
.sort-select {
  max-width: 200px;
}

.chart-wrapper {
  margin-top: 10px;
  position: relative;
}

.no-data-overlay {
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #888;
  font-size: 1.1rem;
  pointer-events: none;
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

/* Active Filters Bar */
.active-filters {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 12px;
  font-size: 0.9rem;
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

  .chart-wrapper {
    margin-top: 8px;
  }

  .legend {
    justify-content: center;
  }
}
::v-deep(.apexcharts-tooltip) {
  transform: translateY(10px);
}

.tooltip-box {
  padding: 16px 18px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 0.95rem;
  line-height: 1.5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.tooltip-box p {
  margin: 6px 0;
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
</style>
