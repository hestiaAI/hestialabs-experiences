<template>
  <div class="layout-container">
    <div class="week-nav">
      <button class="nav-btn" @click="prevWeek">←</button>
      <div class="week-label">{{ weekLabel }}</div>
      <button class="nav-btn" @click="nextWeek">→</button>
    </div>

    <!-- BOX 2 → Bubble Chart -->
    <div class="box box2">
      <div class="header-controls">
        <h2 class="chart-title">Earnings Distribution</h2>
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

        <div v-if="filteredJobs.length === 0" class="no-data-overlay">
          <p>No job data for this week</p>
        </div>
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

export default {
  name: 'BabysitsEarningsDistribution',
  components: { ApexChart: VueApexCharts },
  mixins: [mixin],

  data() {
    return {
      currentWeekStart: this.getMondayOf(dayjs())
    }
  },

  computed: {
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
      const s = this.weekStart
      const e = this.weekEnd
      return `${s.format('DD.MM')} - ${e.format('DD.MM.YYYY')}`
    },

    filteredJobs() {
      return this.jobs.filter((j) => {
        if (!j.date || j.status === 'cancelled') return false
        const d = dayjs(j.date)
        return d.isBetween(this.weekStart, this.weekEnd, 'day', '[]')
      })
    },

    timeBucketColors() {
      return {
        Morning: '#36A2EB',
        Day: '#4BC0C0',
        Evening: '#FF6384',
        Night: '#6A9BE8',
        Other: '#9E9E9E'
      }
    },

    weekdays() {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },

    aggregatedData() {
      const data = {}

      this.filteredJobs.forEach((job) => {
        const jobDate = dayjs(job.date)
        let dayIndex = jobDate.day()
        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1

        const dayName = this.weekdays[dayIndex]

        const [startH] = (job.start_time || '0:00').split(':').map(Number)
        const bucket = this.getTimeBucketFromHour(startH)

        if (!data[dayName]) data[dayName] = {}
        if (!data[dayName][bucket]) {
          data[dayName][bucket] = { totalEarnings: 0, totalDuration: 0, count: 0 }
        }

        data[dayName][bucket].totalEarnings += Number(job.earnings) || 0
        data[dayName][bucket].totalDuration += Number(
          job.nbHours ||
          job.duration ||
          job.duration_hours ||
          job.hours ||
          job.work_hours
        ) || 0
        data[dayName][bucket].count += 1
      })

      return data
    },

    chartSeries() {
      const bucketKeys = ['Morning', 'Day', 'Evening', 'Night', 'Other']
      const seriesMap = {}

      bucketKeys.forEach((b) => {
        seriesMap[b] = { name: b, data: [] }
      })

      // Add data for each time bucket - using numeric day index (0-6)
      Object.entries(this.aggregatedData).forEach(([dayName, buckets]) => {
        const dayIndex = this.weekdays.indexOf(dayName)
        Object.entries(buckets).forEach(([bucket, metrics]) => {
          const series = seriesMap[bucket] || seriesMap.Other
          series.data.push([
            dayIndex,
            parseFloat(metrics.totalEarnings.toFixed(2)),
            parseFloat(metrics.totalDuration.toFixed(1)),
            metrics.count
          ])
        })
      })

      const filteredSeries = bucketKeys.map(k => seriesMap[k]).filter(s => s && s.data.length > 0)

      // Always add a hidden placeholder series to ensure all days are shown
      const placeholderSeries = {
        name: 'Placeholder',
        data: this.weekdays.map((day, idx) => [idx, null, 0])
      }

      // If no data, return only placeholder
      if (filteredSeries.length === 0) {
        return [placeholderSeries]
      }

      // If there is data, add placeholder at the end to ensure all days show
      return [...filteredSeries, placeholderSeries]
    },

    chartOptions() {
      const seriesColors = this.chartSeries.map(s =>
        s.name === 'Placeholder' ? 'transparent' : (this.timeBucketColors[s.name] || this.timeBucketColors.Other)
      )

      return {
        chart: {
          type: 'bubble',
          height: 450,
          toolbar: { show: false }
        },
        colors: seriesColors,
        dataLabels: {
          enabled: false
        },
        fill: {
          opacity: 0.8
        },
        xaxis: {
          type: 'numeric',
          min: -0.5,
          max: 6.5,
          tickAmount: 7,
          labels: {
            rotate: 0,
            offsetX: 20,
            offsetY: 0,
            formatter: (val) => {
              const idx = Math.round(val)
              return this.weekdays[idx] || ''
            },
            style: {
              fontSize: '12px',
              textAnchor: 'middle'
            }
          },
          axisBorder: {
            show: true
          },
          axisTicks: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: `Earnings (${this.currency})`
          },
          min: 0,
          forceNiceScale: true
        },
        grid: {
          show: true,
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        plotOptions: {
          bubble: {
            maxBubbleRadius: 40,
            minBubbleRadius: 5
          }
        },
        tooltip: {
          enabled: this.filteredJobs.length > 0,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const point = w.config.series[seriesIndex].data[dataPointIndex]
            const seriesName = w.config.series[seriesIndex].name

            // Don't show tooltip for placeholder series
            if (seriesName === 'Placeholder' || !point || point[1] === null || point[1] === 0) return ''

            const dayIndex = Math.round(point[0])
            const dayName = this.weekdays[dayIndex]
            const totalEarnings = point[1]
            const totalDuration = point[2]
            const jobCount = point[3] || 1
            const bucketName = seriesName

            return `
              <div class="tooltip-box">
                <div class="tooltip-title">${dayName} - ${bucketName}</div>
                <p>Total Income: <strong>${totalEarnings.toFixed(2)} ${this.currency}</strong></p>
                <p>Jobs: <strong>${jobCount}</strong></p>
                <p>Total Duration: <strong>${totalDuration.toFixed(1)} h</strong></p>
              </div>
            `
          }
        },
        legend: {
          show: false
        },
        noData: {
          text: 'No data available for this week',
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
      const keys = Object.keys(this.timeBucketColors)
      return keys.map((type) => {
        const count = Object.values(this.aggregatedData).reduce((sum, buckets) => {
          return sum + (buckets[type]?.count || 0)
        }, 0)
        return { name: type, label: type, color: this.timeBucketColors[type], count }
      }).filter(item => item.count > 0)
    }
  },

  mounted() {
    if (this.latestJobDate) {
      this.currentWeekStart = this.getMondayOf(this.latestJobDate)
    }
  },

  methods: {
    getMondayOf(d) {
      const day = d.day()
      return day === 0
        ? d.subtract(6, 'day').startOf('day')
        : d.subtract(day - 1, 'day').startOf('day')
    },

    getTimeBucketFromHour(h) {
      if (h == null || isNaN(h)) return 'Other'
      if (h >= 5 && h < 11) return 'Morning'
      if (h >= 11 && h < 17) return 'Day'
      if (h >= 17 && h < 23) return 'Evening'
      return 'Night'
    },

    prevWeek() {
      this.currentWeekStart = this.currentWeekStart.subtract(7, 'day')
    },

    nextWeek() {
      this.currentWeekStart = this.currentWeekStart.add(7, 'day')
    }
  }
}
</script>

<style scoped>
/* --- LAYOUT --- */
.layout-container {
  width: 94%;
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

/* BUBBLE CHART */
.box2 {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  font-weight: 700;
  color: #333;
  font-size: 1rem;
}

/* Legend */
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

/* Tooltip styling */
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
</style>
