<template>
  <VContainer>
    <div :id="`top-chart-${graphId}`">
      <div style="display: flex">
        <strong>{{ title }}</strong>
        <VSpacer />
        <div :id="`top-search-${graphId}`" />
      </div>
      <ChartViewFilters />
    </div>
  </VContainer>
</template>
<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import { removeEmptyBins } from '../utils/dc-helpers'
import mixin from './mixin'
import ChartViewFilters from '../filters/ChartViewFilters.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewFilters },
  mixins: [mixin],
  props: {
    /**
     * Column name of the {values} to be displayed/compared in the graph
     */
    valueAccessor: {
      type: String,
      required: true
    },
    /**
     * Whether or not each value should be considered as an array
     * eg here col2 should be considered and an array:
     * [ { col1: "test", col2: ["test1", "test2"] }, ... ]
     */
    valueAsArray: {
      type: Boolean,
      default: false
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
     * Number of bars to display in descendant order
     */
    topK: {
      type: Number,
      default: 10
    },
    /**
     * If one of {valueAccessor} is null, replace the value with a default
     */
    defaultValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    drawViz() {
      // Init top row chart & search
      const topChart = new dc.RowChart(`#top-chart-${this.graphId}`)
      const topSearch = this.createTextFilterWidget(`#top-search-${this.graphId}`)

      // Bind reset filters link
      d3.select(`#top-chart-${this.graphId} a.reset`).on('click', function() {
        topChart.filterAll()
        dc.redrawAll()
      })

      // Create dimensions
      const topDimension = this.ndx.dimension((d) => {
        if (this.valueAsArray) {
          return JSON.parse(d[this.valueAccessor]) || [this.defaultValue]
        } else {
          return d[this.valueAccessor] || this.defaultValue
        }
      }, this.valueAsArray)

      topSearch.dimension(this.ndx.dimension((d) => {
        if (this.valueAsArray) {
          return JSON.parse(d[this.valueAccessor].toLowerCase()) || [this.defaultValue.toLowerCase()]
        } else {
          return (d[this.valueAccessor] || this.defaultValue).toLowerCase()
        }
      }, this.valueAsArray))

      // Create group
      const topGroup = this.sumAccessor ? topDimension.group().reduceSum(d => d[this.sumAccessor]) : topDimension.group().reduceCount()

      // Create top row chart
      topChart
        .width(
          d3.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect()
            .width
        )
        .height(this.height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(topGroup))
        .dimension(topDimension)
        .ordinalColors(this.colorPalette)
        .label(d => d.key)
        .data(group => group.top(this.topK))
        .title(d => `${d.value} ${this.valueLabel}`)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      dc.renderAll()
      // addXLabel(topChart, this.valueLabel)
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
