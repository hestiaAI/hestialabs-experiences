<template>
  <div class="bar-root">
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

// This component is a simple wrapper around ApexCharts to render a horizontal
// bar chart with consistent styling and responsive width. It accepts the same
// props as a standard ApexChart, but ensures that the chart fills the width
// of its container and has a default height of 450px.
export default {
  name: 'HorizontalBarChart',
  components: { ApexChart: VueApexCharts },
  props: {
    series: { type: Array, required: true },
    options: { type: Object, required: true },
    height: { type: [Number, String], default: 450 }
  }
}
</script>

<style scoped>
.bar-root :deep(.apexcharts-canvas),
.bar-root :deep(.apexcharts-inner),
.bar-root :deep(svg) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>
