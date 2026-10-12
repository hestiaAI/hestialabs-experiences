<template>
  <div class="trips-heatmap">
    <KpiTiles class="mt-3" :items="kpis" />

    <ViewCard class="mt-3" :title="msg('title')">
      <template #actions>
        <VBtnToggle
          v-model="metric"
          mandatory
          dense
          color="primary"
        >
          <VBtn value="perActiveWeek" small>
            {{ msg('perActiveWeek') }}
          </VBtn>
          <VBtn value="trips" small>
            {{ msg('total') }}
          </VBtn>
        </VBtnToggle>
      </template>

      <p class="text-caption text--secondary">
        {{ metric === 'trips' ? msg('totalHelp') : msg('perActiveWeekHelp') }}
      </p>
      <ApexChart
        v-if="rows.length"
        type="heatmap"
        height="360"
        :options="chartOptions"
        :series="series"
      />
      <p v-else class="text--secondary">
        {{ msg('noData') }}
      </p>
    </ViewCard>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import mixin from '@/components/chart/view/mixin'
import KpiTiles from '../shared/KpiTiles.vue'
import ViewCard from '../shared/ViewCard.vue'

const DEFAULT_MESSAGES = {
  title: 'Completed trips by weekday and hour',
  perActiveWeek: 'Per active week',
  total: 'Total',
  perActiveWeekHelp: 'Average number of completed trips accepted in each hour, per week with at least one completed trip.',
  totalHelp: 'Number of completed trips accepted in each hour, over the whole export.',
  completedTrips: 'Completed trips',
  activeWeeks: 'Active weeks',
  busiest: 'Busiest hour',
  noData: 'No completed trips in this export.'
}

export default {
  name: 'TripsHeatmap',
  components: { ApexChart: VueApexCharts, KpiTiles, ViewCard },
  mixins: [mixin],
  data() {
    return { metric: 'perActiveWeek' }
  },
  computed: {
    // pipeline rows: { weekday, day, hour, trips, perActiveWeek, activeWeeks }
    rows() {
      return this.values.filter(row => row.trips !== undefined)
    },
    // short weekday names in the visitor's language, Monday first
    days() {
      const format = new Intl.DateTimeFormat(this.$i18n?.locale || 'en', { weekday: 'short', timeZone: 'UTC' })
      // 2024-01-01 was a Monday
      return [...Array(7).keys()].map(i => format.format(new Date(Date.UTC(2024, 0, 1 + i))))
    },
    totalTrips() {
      return this.rows.reduce((sum, row) => sum + row.trips, 0)
    },
    busiest() {
      return this.rows.reduce((best, row) => (!best || row.trips > best.trips ? row : best), null)
    },
    kpis() {
      const busiest = this.busiest && this.busiest.trips
        ? `${this.days[this.busiest.weekday - 1]} ${String(this.busiest.hour).padStart(2, '0')}:00`
        : '–'
      return [
        { label: this.msg('completedTrips'), value: this.totalTrips },
        { label: this.msg('activeWeeks'), value: this.rows[0]?.activeWeeks ?? 0 },
        { label: this.msg('busiest'), value: busiest }
      ]
    },
    series() {
      // ApexCharts draws the first series at the bottom: list Sunday first
      return [...this.days.keys()].reverse().map(index => ({
        name: this.days[index],
        data: this.rows
          .filter(row => row.weekday === index + 1)
          .sort((a, b) => a.hour - b.hour)
          .map(row => ({ x: String(row.hour).padStart(2, '0'), y: row[this.metric] }))
      }))
    },
    chartOptions() {
      return {
        chart: { toolbar: { show: false }, animations: { enabled: false } },
        dataLabels: { enabled: false },
        colors: [this.$vuetify?.theme?.themes?.light?.primary || '#58539e'],
        plotOptions: { heatmap: { shadeIntensity: 0.6, radius: 2 } },
        xaxis: { title: { text: 'h' }, tickAmount: 12 },
        tooltip: {
          y: { formatter: value => (this.metric === 'trips' ? value : value.toFixed(2)) }
        },
        legend: { show: false }
      }
    }
  },
  methods: {
    msg(key) {
      return this.messages?.[key] ?? DEFAULT_MESSAGES[key]
    }
  }
}
</script>
