<template>
  <div class="earnings-per-hour-root">
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
  name: 'EarningsPerHourBar',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 350 }
  }
}
</script>

<style scoped>
.earnings-per-hour-root :deep(.apexcharts-canvas),
.earnings-per-hour-root :deep(.apexcharts-inner),
.earnings-per-hour-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
