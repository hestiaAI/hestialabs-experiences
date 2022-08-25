<template>
  <VContainer>
    <div :id="'hour-chart-' + graphId">
      <strong v-if="title">{{ title }}</strong>
      <strong v-else v-t="'time-of-day'" />
      <a v-t="'reset'" class="reset" style="display: none" />
      <p class="filters">
        <span v-t="'Current filter'" />
        <span class="filter" />
      </p>
    </div>
  </VContainer>
</template>
<script>

import * as d3 from 'd3'
import * as dc from 'dc'
import mixin from './mixin'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  props: {
    /**
     * Title of the graph
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * Column name of the {values} that represent date values
     */
    dateAccessor: {
      type: String,
      required: true
    },
    /**
     * Format of the dates being processed, if not set will use the Date constructor
     */
    dateFormat: {
      type: String,
      default: ''
    },
    /**
     * The value to consider in respect to the date, if not set, will take the number of records
     */
    valueAccessor: {
      type: String,
      default: ''
    },
    /**
     * If one of {valueAccessor} is null, replace the value with a default
     */
    defaultValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      results: []
    }
  },
  computed: {
    dateParser() {
      if (this.dateFormat) {
        return d3.timeParse(this.dateFormat)
      } else {
        return d => new Date(d)
      }
    }
  },
  methods: {
    drawViz() {
      // Create and bind charts to their respective divs
      const hourChart = new dc.BarChart(`#hour-chart-${this.graphId}`)

      // Bind reset filters links
      d3.select(`#hour-chart-${this.graphId} a.reset`).on('click', function() {
        hourChart.filterAll()
        dc.redrawAll()
      })

      // Create dimension
      const hourDimension = this.ndx.dimension(d => d3.timeHour(this.dateParser(d[this.dateAccessor])).getHours())

      // Create the aggregation from the date dimension
      const hourGroup = this.valueAccessor ? hourDimension.group().reduceSum(d => d[this.valueAccessor]) : hourDimension.group().reduceCount()

      // Render week chart
      const width = d3.select(`#hour-chart-${this.graphId}`).node().getBoundingClientRect().width

      // Render hour bar chart
      hourChart
        .width(width)
        .height(this.height)
        .margins({ top: 20, right: 10, bottom: 20, left: 40 })
        .dimension(hourDimension)
        .group(hourGroup)
        .valueAccessor(d => d.value)
        .centerBar(false)
        .gap(1)
        .x(d3.scaleLinear().domain([0, 24]))
        .ordinalColors(this.colorPalette)
        // .yAxisLabel('Hours')
        .yAxis()
        .ticks(5)

      hourChart
        .xAxis()
        .tickFormat(d => d + ':00')
        .ticks(7)

      dc.renderAll()
    }
  }
}
</script>
