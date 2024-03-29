<template>
  <div>
    <div class="flex">
        <div>
          <strong>{{ title }}</strong>
          <ChartFilters />
        </div>
        <div class="spacer" />
        <div :id="`top-search-${graphId}`" style="max-width: 120px" />
    </div>

    <div :style="cssProps">
      <div :id="`top-chart-${graphId}`" :class="{ isScrollable }"></div>
    </div>
    <div :id="`top-chart-${graphId}-axis`"></div>
    <div v-if="topK < total" class="caption" v-t="{ path: k('show-top-n'), args: { n: topK, m: total } }"></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import { removeEmptyBins } from '@/utils/dc-helpers'
import ChartMixin from '@/mixins/chart-mixin'
import TranslationMixin from '@/mixins/translation-mixin'

import ChartFilters from '@/components/ChartFilters.vue'
import { customAxis } from '@/utils/dc-axis.js'

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
     * Define if the chart should be scrollable to see all values
     */
    isScrollable: {
      type: Boolean,
      default: false
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
    return {
      total: 'N/A'
    }
  },
  computed: {
    cssProps() {
      return {
        '--height': this.height + 'px'
      }
    }
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
      this.total = topGroup.size()
      // const height = this.isScrollable ? Math.max(Math.min(this.topK, topGroup.size()) * 20, this.height) : this.height
      const width = d3.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect().width

      // Create top row chart
      topChart
        .width(width)
        .height(this.height - 25)
        .margins({ top: this.margins.top, left: this.margins.left, right: this.margins.right, bottom: -5 })
        .group(this.isScrollable ? topGroup : removeEmptyBins(topGroup))
        .dimension(topDimension)
        .ordinalColors([this.colorPalette[this.position % this.colorPalette.length]])
        .label(d => d.key)
        .data(group => group.top(this.topK))
        .title(d => `${d.value} ${this.valueLabel}`)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      customAxis(`#top-chart-${this.graphId}-axis`)
        .margins({ top: 0, left: this.margins.left, right: this.margins.right, bottom: this.margins.bottom })
        .height(20)
        .width(width)
        .dimension(topDimension)
        .group(topGroup)
        .elastic(true)
        .axis()
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
.isScrollable {
  overflow-y: auto;
  height: var(--height);
}
</style>
