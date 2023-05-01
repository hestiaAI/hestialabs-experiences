<template>
  <div>
    <div :id="`week-chart-${graphId}`">
      <strong v-if="title">{{ title }}</strong>
      <strong v-else class="capitalize"> {{ $tc(k('day'), 1) }}</strong>
      <ChartFilters />
    </div>
  </div>
</template>
<script>

import * as d3 from 'd3'
import * as dc from 'dc'
import ChartMixin from '@/mixins/chart-mixin'
import TranslationMixin from '@/mixins/translation-mixin'
import ChartFilters from '@/components/ChartFilters.vue'

export default {
  components: { ChartFilters },
  mixins: [ChartMixin, TranslationMixin],
  props: {
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
      results: [],
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
      const weekChart = new dc.RowChart(`#week-chart-${this.graphId}`)

      // Bind reset filters links
      d3.select(`#week-chart-${this.graphId} a.reset`).on('click', function() {
        weekChart.filterAll()
        dc.redrawAll()
      })

      // Create dimension
      const dayOfWeekDimension = this.ndx.dimension((d) => {
        const day = this.dateParser(d[this.dateAccessor]).getDay()
        return `${this.weekDays[day]}`
      })

      // Create the aggregation from the date dimension
      const dayOfWeekGroup = this.valueAccessor ? dayOfWeekDimension.group().reduceSum(d => d[this.valueAccessor]) : dayOfWeekDimension.group().reduceCount()

      // Render week chart
      const width = d3.select(`#week-chart-${this.graphId}`).node().getBoundingClientRect().width
      weekChart
        .width(width)
        .height(this.height)
        .margins(this.margins)
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDimension)
        .ordinalColors(this.colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      weekChart.ordering(d => this.weekDays.indexOf(d.key))

      dc.renderAll()
    }
  }
}
</script>
