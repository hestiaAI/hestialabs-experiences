<template>
  <div class="total-stacked-root">
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
  name: 'TotalStackedBar',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 450 }
  }
}
</script>

<style scoped>
.total-stacked-root :deep(.apexcharts-canvas),
.total-stacked-root :deep(.apexcharts-inner),
.total-stacked-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
