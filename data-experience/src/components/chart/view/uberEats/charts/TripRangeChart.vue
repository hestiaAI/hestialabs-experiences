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

export default {
  name: 'TripRangeChart',
  components: { ApexChart: VueApexCharts },
  props: {
    label: { type: String, required: true },
    unit: { type: String, required: true },
    min: { type: Number, required: true },
    avg: { type: Number, required: true },
    max: { type: Number, required: true },
    height: { type: [Number, String], default: 120 }
  },
  computed: {
    // prepare ApexChart series for range
    series() {
      return [
        {
          name: 'Range',
          data: [
            {
              x: this.label,
              y: [this.min, this.max],
              meta: { avg: this.avg }
            }
          ]
        }
      ]
    },

    // prepare ApexChart options for range
    options() {
      const minV = Number(this.min)
      const avgV = Number(this.avg)
      const maxV = Number(this.max)

      return {
        chart: {
          type: 'rangeBar',
          toolbar: { show: false },
          zoom: { enabled: false },
          redrawOnParentResize: true,
          redrawOnWindowResize: true
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '45%'
          }
        },
        xaxis: {
          min: 0,
          max: Math.max(1, maxV * 1.05)
        },
        yaxis: {
          labels: { show: false }
        },
        dataLabels: {
          enabled: true,
          formatter: val => `${val[0]} – ${val[1]} ${this.unit}`
        },
        annotations: {
          xaxis: [
            {
              x: avgV,
              borderColor: '#000',
              strokeDashArray: 0,
              label: {
                text: `Avg ${avgV} ${this.unit}`,
                style: { color: '#000' }
              }
            }
          ]
        },
        tooltip: {
          custom: () => `
            <div style="padding:8px;font-size:12px">
              <strong>${this.label}</strong><br/>
              Min: ${minV} ${this.unit}<br/>
              Avg: ${avgV} ${this.unit}<br/>
              Max: ${maxV} ${this.unit}
            </div>`
        },
        legend: { show: false }
      }
    }
  }
}
</script>

<style scoped>
  /* helps prevent overflow in tight boxes */
  .range-root :deep(.apexcharts-canvas),
  .range-root :deep(.apexcharts-inner),
  .range-root :deep(svg) {
    width: 100% !important;
    max-width: 100% !important;
  }
</style>
