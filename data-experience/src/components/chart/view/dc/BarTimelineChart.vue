<template>
  <VContainer>
    <div :id="'bar-chart-' + graphId">
      <div class="d-flex">
        <div>
          <strong>{{ title }}</strong>
          <ChartViewFilters />
        </div>
        <VSpacer />
        <div style="max-width: 160px">
        <VSelect
          v-model="interval"
          :items="intervalsName"
          :label="$t('Time interval')"
          @change="redraw"
          class="ma-0 ml-2"
          hide-details
        />
        </div>
      </div>

    </div>
  </VContainer>
</template>
<script>

import * as d3 from 'd3'
import * as dc from 'dc'
import mixin from './mixin'
import ChartViewFilters from '../filters/ChartViewFilters.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewFilters },
  mixins: [mixin],
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
    },
    /**
     * The type of the value, if set will display a stacked bar chart
     */
    typeAccessor: {
      type: String,
      default: ''
    }
  },
  data() {
    const intervals = {
      Day: d3.timeDay,
      Week: d3.timeWeek,
      Month: d3.timeMonth,
      Year: d3.timeYear
    }
    return {
      results: [],
      interval: null,
      intervals,
      intervalsName: Object.keys(intervals),
      minDate: null,
      maxDate: null,
      barChart: null,
      dateDimension: null,
      dateGroup: null
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
      this.barChart = new dc.BarChart(`#bar-chart-${this.graphId}`)
      const width = d3.select(`#bar-chart-${this.graphId}`).node().getBoundingClientRect().width

      // Bind reset filters links
      d3.select(`#bar-chart-${this.graphId} a.reset`).on('click', function() {
        this.barChart.filterAll()
        dc.redrawAll()
      })

      // Choose the time interval to use
      this.dateDimension = this.ndx.dimension(d => this.dateParser(d[this.dateAccessor]))
      console.log(this.dateDimension)
      this.minDate = this.dateParser(this.dateDimension.bottom(1)[0][this.dateAccessor])
      this.maxDate = this.dateParser(this.dateDimension.top(1)[0][this.dateAccessor])
      const diffDays = d3.timeDay.count(this.minDate, this.maxDate)
      console.log(this.minDate, this.maxDate, diffDays)
      if (diffDays < 100) {
        this.interval = 'Day'
      } else if (diffDays < 1000) {
        this.interval = 'Week'
      } else {
        this.interval = 'Month'
      }

      const grouper = k => this.intervals[this.interval](k)
      this.dateGroup = this.valueAccessor
        ? this.dateDimension.group(grouper).reduceSum(d => d[this.valueAccessor])
        : this.dateDimension.group(grouper).reduceCount()
      console.log(this.interval, this.dateGroup)

      // Render hour date chart
      this.barChart
        .width(width)
        .height(this.height)
        .ordinalColors([this.colorPalette[0]])
        .x(d3
          .scaleTime()
          .domain([
            d3.timeHour.offset(this.minDate, 0),
            d3.timeHour.offset(this.maxDate, 2)
          ]))
        .xUnits(this.intervals[this.interval].range)
        .margins({ left: 50, top: 20, right: 50, bottom: 20 })
        .dimension(this.dateDimension)
        .group(this.dateGroup)
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .mouseZoomable(false)
        .clipPadding(10)

      dc.renderAll()
    },
    redraw() {
      const grouper = k => this.intervals[this.interval](k)
      console.log(this.intervals[this.interval])
      this.dateGroup = this.valueAccessor
        ? this.dateDimension.group(grouper).reduceSum(d => d[this.valueAccessor])
        : this.dateDimension.group(grouper).reduceCount()
      this.barChart.xUnits(this.intervals[this.interval].range)
      this.barChart
        .dimension(this.dateDimension)
        .group(this.dateGroup)
      // .gap(this.selectTimeInt === 'Months' ? 10 : 0)
        .transitionDuration(1000)
        .render()
    }
  }
}
</script>
