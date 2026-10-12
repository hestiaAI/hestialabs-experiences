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

// This component is a simple wrapper around ApexCharts to render an earnings by
// day bar chart with consistent styling and responsive width. It accepts the same
// props as a standard ApexChart, but ensures that the chart fills the width of
// its container and has a default height of 450px.
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
