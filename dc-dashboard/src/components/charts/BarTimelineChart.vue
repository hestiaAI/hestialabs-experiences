<template>
  <div>
    <div :id="'bar-chart-' + graphId">
      <div class="flex">
        <div>
          <strong>{{ title }}</strong>
          <ChartFilters />
        </div>
        <div class="spacer"></div>
        <TabRadio
          v-model="interval"
          :options="intervalsName"
          :label="$t(k('time-interval'))"
          @change="redraw"
          class="capitalize"
        />
      </div>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import ChartMixin from '@/mixins/chart-mixin'
import TranslationMixin from '@/mixins/translation-mixin'
import ChartFilters from '@/components/ChartFilters.vue'
import TabRadio from '@/components/base/TabRadio.vue'
export default {
  components: { ChartFilters, TabRadio },
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
      interval: 'Month',
      intervals,
      intervalsName: Object.keys(intervals),
      minDate: null,
      maxDate: null,
      barChart: null
    }
  },
  computed: {
    dateParser() {
      if (this.dateFormat) {
        return d3.timeParse(this.dateFormat)
      } else {
        return d => new Date(d)
      }
    },
    dateDimension(){
      return this.ndx.dimension(d => this.dateParser(d[this.dateAccessor]))
    },
    dateGroup(){
      console.log('Selected', this.interval)
      const grouper = k => this.intervals[this.interval](k)
      return this.valueAccessor
        ? this.dateDimension.group(grouper).reduceSum(d => d[this.valueAccessor])
        : this.dateDimension.group(grouper).reduceCount()
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
        .margins(this.margins)
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
