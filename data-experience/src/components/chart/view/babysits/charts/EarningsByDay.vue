<template>
  <div class="earnings-by-day-root">
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
  name: 'EarningsByDay',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 450 }
  }
}
</script>

<style scoped>
.earnings-by-day-root :deep(.apexcharts-canvas),
.earnings-by-day-root :deep(.apexcharts-inner),
.earnings-by-day-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
