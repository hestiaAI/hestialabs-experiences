<template>
  <div class="device-root">
    <ApexChart
      type="bar"
      :height="height"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'DeviceChart',
  components: { ApexChart: VueApexCharts },
  props: {
    categories: { type: Array, required: true }, // ["iPhone", "Android", ...]
    counts: { type: Array, required: true }, // [12, 9, 3]
    height: { type: [Number, String], default: 200 }
  },
  computed: {
    // prepare ApexChart series for bar chart
    series() {
      return [{ name: 'Deliveries', data: this.counts }]
    },

    // prepare ApexChart options for bar chart
    options() {
      return {
        chart: {
          type: 'bar',
          toolbar: { show: false },
          zoom: { enabled: false }
        },
        states: {
          hover: { filter: { type: 'none' } },
          active: { filter: { type: 'none' } }
        },
        plotOptions: {
          bar: { horizontal: true, barHeight: '50%' }
        },
        dataLabels: {
          enabled: true,
          offsetX: 4,
          style: { colors: ['#fff'] },
          textAnchor: 'start',
          formatter: val => val
        },
        xaxis: {
          categories: this.categories
        },
        yaxis: {}
      }
    }
  }
}
</script>

<style scoped>
.device-root :deep(.apexcharts-canvas),
.device-root :deep(.apexcharts-inner),
.device-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
