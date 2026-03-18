<template>
  <div class="range-root">
    <ApexChart
      type="rangeBar"
      :height="height"
      :options="options"
      :series="series"
    />
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

// This component is a simple wrapper around ApexCharts to render a shift
// range chart with consistent styling and responsive width. It accepts
// the same props as a standard ApexChart, but ensures that the chart
// fills the width of its container and has a default height of 450px.
export default {
  name: 'ShiftRangeChart',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 450 }
  }
}
</script>

<style scoped>
.range-root :deep(.apexcharts-canvas),
.range-root :deep(.apexcharts-inner),
.range-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
