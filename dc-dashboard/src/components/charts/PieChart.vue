<template>
  <div>
    <div :id="`pie-chart-${graphId}`">
      <div class="flex">
        <strong>{{ title }}</strong>
      </div>
      <ChartFilters />
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import { addPiePercentage } from '@/utils/dc-helpers'
import ChartMixin from '@/mixins/chart-mixin'
import TranslationMixin from '@/mixins/translation-mixin'

import ChartFilters from '@/components/ChartFilters.vue'

export default {
  components: { ChartFilters },
  mixins: [ChartMixin, TranslationMixin],
  props: {
    /**
     * Column name of the {values} to be displayed/compared in the graph
     */
    valueAccessor: {
      type: String,
      required: true
    },
    /**
     * If defined, calculates the sum of the column named {sumAccessor} over {valueAccessor}.
     * Otherwise, takes the count of the unique {valueAccessor}.
     */
    sumAccessor: {
      type: String,
      default: ''
    },
    /**
     * If one of {valueAccessor} is null, replace the value with a default
     */
    defaultValue: {
      type: String,
      default: 'N/A'
    }
  },
  data() {
    return {}
  },
  methods: {
    drawViz() {
      // Init top row chart & search
      const pieChart = new dc.PieChart(`#pie-chart-${this.graphId}`)

      // Bind reset filters link
      d3.select(`#pie-chart-${this.graphId} a.reset`).on('click', function() {
        pieChart.filterAll()
        dc.redrawAll()
      })

      // Create dimensions
      const pieDimension = this.ndx.dimension(d => d[this.valueAccessor] || this.defaultValue)

      // Create group
      const pieGroup = this.sumAccessor ? pieDimension.group().reduceSum(d => d[this.sumAccessor]) : pieDimension.group().reduceCount()

      // Render pie chart
      const width = d3
        .select(`#pie-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      const scale = Math.min(width, this.height)
      pieChart
        .width(width)
        .height(this.height)
        .slicesCap(8)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(40)
        .dimension(pieDimension)
        .group(pieGroup)
        .valueAccessor(d => d.value)
        .title(d => `${d.key}: ${d.value} ${this.valueLabel}`)
        .drawPaths(true)
        .minAngleForLabel(0)
        .ordinalColors(this.colorPalette)

      addPiePercentage(pieChart)

      dc.renderAll()
    }
  }
}
</script>
<style scoped>
::v-deep .dc-text-filter-input {
  background: none;
  color: #596471;
  border-bottom: 1px solid #596471;
  outline: none;
}
</style>
