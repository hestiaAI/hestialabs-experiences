<template>
  <div class="trips-per-hour">
    <KpiTiles class="mt-3" :items="kpis" />

    <ViewCard class="mt-3" :title="msg('title')">
      <template #actions>
        <VBtnToggle
          v-model="granularity"
          mandatory
          dense
          color="primary"
        >
          <VBtn value="month" small>
            {{ msg('month') }}
          </VBtn>
          <VBtn value="week" small>
            {{ msg('week') }}
          </VBtn>
        </VBtnToggle>
      </template>

      <ApexChart
        v-if="rows.length"
        type="line"
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
  title: 'Completed trips per hour',
  month: 'Month',
  week: 'Week',
  tphOnline: 'TPH online',
  tphActive: 'TPH active',
  trips: 'Completed trips',
  noData: 'No online time or completed trips in this export.'
}

export default {
  name: 'TripsPerHour',
  components: { ApexChart: VueApexCharts, KpiTiles, ViewCard },
  mixins: [mixin],
  data() {
    return { granularity: 'month' }
  },
  computed: {
    // pipeline rows: { period, granularity, tphOnline, tphActive, trips, onlineHours, activeHours }
    allRows() {
      return this.values.filter(row => row.granularity)
    },
    rows() {
      return this.allRows.filter(row => row.granularity === this.granularity)
    },
    kpis() {
      // over the whole export: the monthly rows cover every trip and every hour once
      const months = this.allRows.filter(row => row.granularity === 'month')
      const sum = key => months.reduce((total, row) => total + row[key], 0)
      const trips = sum('trips')
      const ratio = hours => (hours ? (trips / hours).toFixed(2) : '–')
      return [
        { label: this.msg('trips'), value: trips },
        { label: this.msg('tphOnline'), value: ratio(sum('onlineHours')) },
        { label: this.msg('tphActive'), value: ratio(sum('activeHours')) }
      ]
    },
    series() {
      return [
        { name: this.msg('tphOnline'), data: this.rows.map(row => row.tphOnline) },
        { name: this.msg('tphActive'), data: this.rows.map(row => row.tphActive) }
      ]
    },
    chartOptions() {
      const primary = this.$vuetify?.theme?.themes?.light?.primary || '#58539e'
      const secondary = this.$vuetify?.theme?.themes?.light?.secondary || '#f39506'
      return {
        chart: { toolbar: { show: false }, animations: { enabled: false }, zoom: { enabled: false } },
        colors: [primary, secondary],
        stroke: { width: 2 },
        markers: { size: this.rows.length > 40 ? 0 : 3 },
        xaxis: { categories: this.rows.map(row => row.period), tickAmount: Math.min(this.rows.length, 12) },
        yaxis: { min: 0, decimalsInFloat: 1 },
        tooltip: {
          y: { formatter: value => (value === null || value === undefined ? '–' : value.toFixed(2)) }
        },
        legend: { position: 'top' }
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
