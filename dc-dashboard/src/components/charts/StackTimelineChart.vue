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
     * The aggregation function to use on the values. One of {sum, avg}
     */
    valueAggregate: {
      type: String,
      default: 'sum'
    },
    /**
     * If one of {valueAccessor} is null, replace the value with a default
     */
    defaultValue: {
      type: Number,
      default: 0
    },
    /**
     * The column that represents the different stacks of the chart
     */
    typeAccessor: {
      type: String,
      required: true
    },
    /**
     * Margins to use in the graph
     */
    margins: {
      type: Object,
      default: () => { return { top: 10, left: 40, right: 100, bottom: 20 } }
    }
  },
  data() {
    const intervals = {
      day: {
        unit: d3.timeDay,
        format: d3.timeFormat('%d %b %Y')
      },
      month: {
        unit: d3.timeMonth,
        format: d3.timeFormat('%b %Y')
      },
      year: {
        unit: d3.timeYear,
        format: d3.timeFormat('%Y')
      }
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
    types() {
      return [...new Set(this.dateDimension.top(Infinity).map(d => d[this.typeAccessor]))];
    },
    dateGroup(){
      const grouper = k => this.intervals[this.interval].unit(k)
      return this.dateDimension.group(grouper).reduce(
        (p, v) => {
          if(v[this.typeAccessor] in p) {
            p[v[this.typeAccessor]].count += 1
            p[v[this.typeAccessor]].sum += (this.valueAccessor ?  v[this.valueAccessor] : 1)
            p[v[this.typeAccessor]].avg = p[v[this.typeAccessor]].sum / p[v[this.typeAccessor]].count
          } else {
            p[v[this.typeAccessor]] = {
              count: 1,
              sum: (this.valueAccessor ?  v[this.valueAccessor] : 1),
              avg: (this.valueAccessor ?  v[this.valueAccessor] : 1)
            }
          }
          return p
        }, (p, v) => {
          if(v[this.typeAccessor] in p) {
            p[v[this.typeAccessor]].count -= 1
            p[v[this.typeAccessor]].sum -= (this.valueAccessor ?  v[this.valueAccessor] : 1)
            p[v[this.typeAccessor]].avg = p[v[this.typeAccessor]].sum / p[v[this.typeAccessor]].count
          }
          return p
        },
        () => {
          return {}
        }
      )
    }
  },
  methods: {
    sel_stack(valueKey) {
      return (d) => {
        if (valueKey in d.value) {
          return d.value[valueKey][this.valueAccessor ? this.valueAggregate : 'count']
        } else {
          return 0
        }
      }
    },
    drawViz() {
      console.log('Graph: ', this.title, ' values', this.ndx.all())
      // Create and bind charts to their respective divs
      this.barChart = new dc.BarChart(`#bar-chart-${this.graphId}`)
      const width = d3.select(`#bar-chart-${this.graphId}`).node().getBoundingClientRect().width

      console.log('width', width)
      // Bind reset filters links
      d3.select(`#bar-chart-${this.graphId} a.reset`).on('click', function() {
        this.barChart.filterAll()
        dc.redrawAll()
      })

      // Choose the time interval to use if there is at least two dates
      if(this.dateDimension.top(2).length === 2) {
        this.minDate = this.dateParser(this.dateDimension.bottom(1)[0][this.dateAccessor])
        this.maxDate = this.dateParser(this.dateDimension.top(1)[0][this.dateAccessor])
        const diffDays = d3.timeDay.count(this.minDate, this.maxDate)
        console.log('diffDays', diffDays)
        console.log(this.dateDimension.bottom(1)[0][this.dateAccessor], this.minDate)
        if (diffDays < 300) {
          this.interval = 'day'
        } else if (diffDays < 1000) {
          this.interval = 'month'
        } else {
          this.interval = 'year'
        }
      }
      console.log(this.intervals, this.interval, this.intervals[this.interval])
      const formatter = this.intervals[this.interval].format
      const accessor = this.valueAccessor ? this.valueAggregate : 'count'

      console.log('margins', this.margins)
      // Render hour date chart
      this.barChart
        .width(width)
        .height(this.height)
        .margins(this.margins)
        .ordinalColors(this.colorPalette)
        .x(d3
          .scaleTime()
          .domain([
            this.intervals[this.interval].unit.offset(this.minDate, -1),
            this.intervals[this.interval].unit.offset(this.maxDate, +1)
          ]))
        .xUnits(this.intervals[this.interval].unit.range)
        .dimension(this.dateDimension)
        .group(this.dateGroup, this.types[0], this.sel_stack(this.types[0]))
        .title(function (d) {
            const value = d.value[this.layer] ? d.value[this.layer][accessor].toFixed(2) : 'undefined'
            return formatter(d.key) + ' [' + this.layer + ']: ' + value
        })
        .yAxisLabel(`${this.valueLabel}`)
        .gap(this.interval === 'Years' ? 10 : 0)
        .brushOn(false)
        .elasticX(true)
        .elasticY(true)
        .mouseZoomable(false)


      this.barChart.xAxis().ticks(4)

      for (let i = 1; i < this.types.length; i++) {
        this.barChart.stack(this.dateGroup, this.types[i], this.sel_stack(this.types[i]))
      }
      this.barChart.legend(dc.legend().x(width - this.margins.right + 10).y(10).gap(5));

      dc.renderAll()
    },
    redraw() {
      const formatter = this.intervals[this.interval].format
      const accessor = this.valueAccessor ? this.valueAggregate : 'count'
      this.barChart
        .dimension(this.dateDimension)
        .x(d3
          .scaleTime()
          .domain([
            this.intervals[this.interval].unit.offset(this.minDate, -1),
            this.intervals[this.interval].unit.offset(this.maxDate, +1)
          ]))
        .group(this.dateGroup, this.types[0], this.sel_stack(this.types[0]))
        .title(function (d) {
            const value = d.value[this.layer] ? d.value[this.layer][accessor].toFixed(2) : 'undefined'
            return formatter(d.key) + ' [' + this.layer + ']: ' + value
        })
        .xUnits(this.intervals[this.interval].unit.range)
        .gap(this.interval === 'Years' ? 10 : 0)

      for (let i = 1; i < this.types.length; i++) {
        this.barChart.stack(this.dateGroup, this.types[i], this.sel_stack(this.types[i]))
      }

      this.barChart
        .transitionDuration(1000)
        .render()
    }
  }
}
</script>
