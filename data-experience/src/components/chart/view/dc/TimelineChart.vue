<template>
  <VContainer>
    <div :id="`area-chart-${graphId}`">
      <span class="font-weight-bold ml-1">
        <template v-if="cumulativeGroup">
          {{ $t('item-total', { title }) }}
        </template>
        <i18n v-else path="item-per-timeunit">
          <template #title>
            {{ title }}
          </template>
          <template #timeUnit>
            {{ $t(timeUnit.name) }}
          </template>
        </i18n>
      </span>
      <ChartViewFilters />
    </div>
    <div :id="`range-chart-${graphId}`" class="range-chart">
      <ChartViewTextSelectTimeRange />
    </div>
  </VContainer>
</template>
<script>

import * as d3 from 'd3'
import * as dc from 'dc'
import mixin from './mixin'
import ChartViewTextSelectTimeRange from '../text/ChartViewTextSelectTimeRange.vue'
import ChartViewFilters from '../filters/ChartViewFilters.vue'
import { createCumulativeGroup } from '../utils/dc-helpers'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewTextSelectTimeRange, ChartViewFilters },
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
     * If set to true use cumulative sum over the time period
     */
    cumulativeGroup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const timeUnits = {
      day: {
        name: 'day',
        accessor: d => d3.timeDay(this.dateParser(d)),
        xUnits: d3.timeDays,
        round: d3.timeDay.round
      },
      month: {
        name: 'month',
        accessor: d => d3.timeMonth(this.dateParser(d)),
        xUnits: d3.timeMonths,
        round: d3.timeMonth.round
      },
      year: {
        name: 'year',
        accessor: d => d3.timeYear(this.dateParser(d)),
        xUnits: d3.timeYears,
        round: d3.timeYear.round
      }
    }
    return {
      timeUnits,
      timeUnit: timeUnits.day,
      dateFormatter: d3.timeFormat('%B %d, %Y')
    }
  },
  computed: {
    dateParser() {
      if (this.dateFormat) {
        return d3.timeParse(this.dateFormat)
      } else {
        return (d) => {
          return new Date(d)
        }
      }
    }
  },
  methods: {
    drawViz() {
      // Create and bind charts to their respective divs
      const lineChart = new dc.LineChart(`#area-chart-${this.graphId}`)
      const rangeChart = new dc.BarChart(`#range-chart-${this.graphId}`)
      // Bind reset filters links
      d3.select(`#area-chart-${this.graphId} a.reset`).on('click', function() {
        lineChart.filterAll()
        rangeChart.filterAll()
        dc.redrawAll()
      })
      // Create dimensions
      const dateExtent = d3.extent(this.ndx.all(), d => this.dateParser(d[this.dateAccessor]))
      dateExtent[0] = d3.timeDay.offset(dateExtent[0], -1)
      dateExtent[1] = d3.timeDay.offset(dateExtent[1], 1)
      const nbMonths = d3.timeMonth.count(...dateExtent)
      this.timeUnit = nbMonths > 10 ? nbMonths > 120 ? this.timeUnits.year : this.timeUnits.month : this.timeUnits.day
      // Create the date dimension
      const dateDimension = this.ndx.dimension(d => this.timeUnit.accessor(d[this.dateAccessor]))
      // Create the aggregation from the date dimension
      const valueGroup = this.valueAccessor ? dateDimension.group().reduceSum(d => d[this.valueAccessor]) : dateDimension.group().reduceCount()
      // Render line chart
      const width = d3
        .select(`#area-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      lineChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(width)
        .transitionDuration(1000)
        .turnOnControls(false)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height((this.height - 30) * 0.8)
        .brushOn(false)
        .renderArea(true)
        .dimension(dateDimension)
        .group(this.cumulativeGroup ? createCumulativeGroup(valueGroup) : valueGroup)
        .x(d3.scaleTime().domain(dateExtent))
        .elasticY(true)
        .rangeChart(rangeChart)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .round(this.timeUnit.round)
        .xUnits(this.timeUnit.xUnits)
        .title(d => `${this.dateFormatter(d.key)} : ${d.value} ${this.valueLabel}`)
        .clipPadding(10)
        .yAxisLabel(`Total ${this.valueLabel}`)
        .ordinalColors(this.colorPalette)
      lineChart.xAxis().ticks(10)
      lineChart.yAxis().ticks(6)
      lineChart.filterAll()
      // range chart date picker
      rangeChart
        .width(width)
        .height((this.height - 30) * 0.2)
        .margins({ top: 0, right: 10, bottom: 20, left: 40 })
        .dimension(dateDimension)
        .group(valueGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleTime().domain(dateExtent))
        .valueAccessor(d => d.value)
        .label(d => d.key)
        .round(this.timeUnit.round)
        .alwaysUseRounding(true)
        .xUnits(this.timeUnit.xUnits)
        .ordinalColors(this.colorPalette)
        .yAxis()
        .ticks(0)
      dc.renderAll()
    }
  }
}
</script>
