<template>
  <div class="timeline-wrapper">
    <div v-if="showEmptyOverlay" class="timeline-overlay">
      <div class="overlay-box">
        <div class="overlay-title">No shifts for this period</div>
        <div class="overlay-text">
          Check whether your dataset is empty, or select another week.
        </div>
      </div>
    </div>

    <ApexChart
      type="rangeBar"
      :height="height"
      :options="options"
      :series="series"
    />

    <div class="legend" v-if="showLegend">
      <div class="legend-item"><span class="color-box offline"></span> Offline</div>
      <div class="legend-item"><span class="color-box open"></span> Open</div>
      <div class="legend-item"><span class="color-box enroute"></span> Enroute</div>
      <div class="legend-item"><span class="color-box ontrip"></span> On Trip</div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import dayjs from 'dayjs'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default {
  name: 'TimelineChart',
  components: { ApexChart: VueApexCharts },
  props: {
    shifts: { type: Array, default: () => [] },
    height: { type: [Number, String], default: 396 },
    showEmptyOverlay: { type: Boolean, default: false },
    showLegend: { type: Boolean, default: true }
  },
  computed: {
    // prepare ApexChart series for timeline
    series() {
      return this.buildTimeline(this.shifts)
    },

    // prepare ApexChart options for timeline
    options() {
      return {
        chart: { toolbar: { show: false }, zoom: { enabled: false } },
        states: {
          hover: { filter: { type: 'none' } },
          active: { filter: { type: 'none' } }
        },
        plotOptions: {
          bar: { horizontal: true, rangeBarGroupRows: true }
        },
        xaxis: {
          min: 0,
          max: 1440,
          tickAmount: 8,
          labels: {
            formatter: v => `${Math.floor(v / 60)}:00`
          }
        },
        yaxis: { categories: WEEKDAYS },
        tooltip: {
          followCursor: false,
          shared: false,
          intersect: true,
          custom: ({ seriesIndex, dataPointIndex, w }) => {
            const d = w.config.series[seriesIndex].data[dataPointIndex]
            const s = dayjs(d.meta.beginTs)
            const e = dayjs(d.meta.endTs)
            return `
              <div style="padding:8px;font-size:12px">
                <strong>${w.config.series[seriesIndex].name.toUpperCase()}</strong><br/>
                ${s.format('DD.MM.YY')}<br/>
                ${s.format('HH:mm')} – ${e.format('HH:mm')}
              </div>`
          }
        },
        legend: { show: false }
      }
    }
  },
  methods: {
    /**
     * Filter out leading and trailing offline shifts to avoid long gray bars at the start/end of the timeline
     * @param shifts
     * @returns {Array}
     */
    filterEdgeOfflineShifts(shifts) {
      if (!shifts || !shifts.length) return []
      const sorted = [...shifts].sort((a, b) => a.beginTs - b.beginTs)

      let startIndex = 0
      while (startIndex < sorted.length && (sorted[startIndex].earner_state === 'offline' || sorted[startIndex].state === 'offline')) {
        startIndex++
      }

      let endIndex = sorted.length - 1
      while (endIndex >= 0 && (sorted[endIndex].earner_state === 'offline' || sorted[endIndex].state === 'offline')) {
        endIndex--
      }

      return sorted.slice(startIndex, endIndex + 1)
    },

    /**
     * Build ApexChart series data for timeline chart based on shifts
     * @param shifts
     * @returns {Array}
     */
    buildTimeline(shifts) {
      const colors = {
        offline: '#ccc',
        open: '#4caf50',
        enroute: '#ff9800',
        ontrip: '#2196f3'
      }

      const map = {}
      Object.keys(colors).forEach((k) => {
        map[k] = { name: k, color: colors[k], data: [] }
      })

      const dayMap = {}
      shifts.forEach((s) => {
        const d = new Date(s.beginTs)
        const dow = d.getDay() === 0 ? 6 : d.getDay() - 1
        const day = WEEKDAYS[dow]
        const state = (s.state || s.earner_state || 'open').toLowerCase()
        const start = d.getHours() * 60 + d.getMinutes()
        const end = start + (s.endTs - s.beginTs) / 60000

        if (!dayMap[day]) dayMap[day] = {}
        if (!dayMap[day][state]) dayMap[day][state] = []

        dayMap[day][state].push({ x: day, y: [start, end], meta: s })
      })

      WEEKDAYS.forEach((day) => {
        if (!dayMap[day]) dayMap[day] = {}
        Object.keys(colors).forEach((state) => {
          if (!dayMap[day][state]) dayMap[day][state] = []
          if (state === 'offline') {
            dayMap[day][state] = this.filterEdgeOfflineShifts(dayMap[day][state])
          }
        })
      })

      Object.keys(map).forEach((state) => {
        WEEKDAYS.forEach((day) => {
          const data = dayMap[day][state]
          if (state === 'offline' && (!data || !data.length)) {
            map[state].data.push({ x: day, y: [0, 0], meta: { empty: true } })
          } else {
            map[state].data.push(...data)
          }
        })
      })

      return Object.values(map)
    }
  }
}
</script>

<style scoped>
.timeline-wrapper { position: relative; }

.timeline-overlay {
  position: absolute;
  inset: 0;
  background: rgba(240, 240, 240, 0.6);
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.overlay-box { text-align: center; }
.overlay-title { font-weight: 700; margin-bottom: 6px; }
.overlay-text { font-size: 13px; opacity: 0.85; }

/* legend */
.legend { display:flex; gap:12px; margin-top: 10px; justify-content: center; }
.legend-item { display:flex; align-items:center; gap:8px; font-size: .9rem; }
.color-box { width: 14px; height: 14px; border-radius: 3px; display:inline-block; }
.color-box.offline { background-color: #ccc; }
.color-box.open { background-color: #4caf50; }
.color-box.enroute { background-color: #ff9800; }
.color-box.ontrip { background-color: #2196f3; }
</style>
