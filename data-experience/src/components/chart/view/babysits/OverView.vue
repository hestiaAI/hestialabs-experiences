<template>
  <div class="p-4">
    <h2 class="mb-4">Shift Timeline</h2>

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
</template>

<script>
import mixin from '@/components/chart/view/mixin'
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'

export default {
  name: 'BabysitsShiftTimeline',
  components: { ApexChart: VueApexCharts },
  mixins: [mixin],

  computed: {
    jobs() {
      return this.values || []
    },

    chartSeries() {
      return [
        {
          name: 'Shift',
          data: this.jobs.map((j) => {
            const start = dayjs(`2025-01-01 ${j.start_time}`).valueOf()
            const end = dayjs(`2025-01-01 ${j.end_time}`).valueOf()

            return {
              x: dayjs(j.date).format('ddd'),
              y: [start, end],
              fillColor: this.statusColors[j.status] || '#888',
              meta: j
            }
          })

        }
      ]
    },

    chartOptions() {
      return {
        chart: {
          type: 'rangeBar',
          toolbar: { show: false }
        },
        plotOptions: {
          bar: { horizontal: true }
        },
        xaxis: {
          type: 'datetime',
          labels: { format: 'HH:mm' },
          min: dayjs('2025-01-01T00:00').valueOf(),
          max: dayjs('2025-01-01T23:59').valueOf()
        },
        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const item =
              w.config.series[seriesIndex].data[dataPointIndex].meta
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

    statusItems() {
      const counts = {}
      this.jobs.forEach((j) => {
        counts[j.status] = (counts[j.status] || 0) + 1
      })

      return Object.keys(counts).map(s => ({
        name: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
        count: counts[s],
        color: this.statusColors[s] || '#888'
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
    }
  }
}
</script>

<style scoped>
.legend {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.legend-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}
.tooltip-box {
  padding: 8px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
