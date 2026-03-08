<template>
  <div class="heatmap-root">
    <ApexChart
      type="heatmap"
      :height="height"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

export default {
  name: 'HeatmapChart',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 450 }
  }
}
</script>

<style scoped>
.heatmap-root :deep(.apexcharts-canvas),
.heatmap-root :deep(.apexcharts-inner),
.heatmap-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
