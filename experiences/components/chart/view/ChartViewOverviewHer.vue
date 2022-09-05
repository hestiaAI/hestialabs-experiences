<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="12">
            <div id="like-chart">
              <strong>Likes you've made over time</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter" />
                </span>
              </p>
            </div>
            <div id="range-chart">
              <p
                class="muted pull-right text-subtitle-2 mr-4 mb-1"
              >
                {{ $t('select-time-range') }}
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="4">
            <div id="hour-chart">
              <strong>Time of day</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div id="week-chart">
              <strong>Day</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div id="matched-chart">
              <strong>Matched</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <div :id="'dc-data-count' + graphId" class="dc-data-count">
        <span class="filter-count" />
        selected out of
        <span class="total-count" />
        views |
        <a class="resetAll">Reset All</a>
      </div>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: results }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  data() {
    return {
      header: [
        { text: 'Name', value: 'name' },
        { text: 'Liked at', value: 'dateStr' },
        { text: 'Matched', value: 'matched' }
      ],
      results: []
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    drawViz() {
      // Define color palette for the graphs
      /*
      const colorPalette = [
        '#254b7f',
        '#1c6488',
        '#287a8c',
        '#40908e',
        '#59a590',
        '#7dba91'
      ]
      */
      const colorPalette = [
        '#58539E',
        '#847CEB',
        '#605BAB',
        '#4A4685',
        '#35325E'
      ]

      // Parse and format data
      const formatTime = d3.timeFormat('%B %d, %Y at %H:%M:%S')
      const formatDay = d3.timeFormat('%B %d, %Y')
      this.results = this.values.map((d) => {
        const date = new Date(d.likedAt)
        return {
          name: d.name,
          matched: d.matched.toUpperCase() === 'TRUE',
          date,
          dateStr: formatTime(date),
          month: d3.timeMonth(date), // pre-calculate months for better performance
          day: d3.timeDay(date), // pre-calculate months for better performance
          hour: d3.timeHour(date).getHours() // pre-calculate hours for better performance
        }
      })

      // Create and bind charts to their respective divs
      const hourChart = new dc.BarChart('#hour-chart')
      const matchedChart = new dc.PieChart('#matched-chart')
      const weekChart = new dc.RowChart('#week-chart')
      const likeChart = new dc.LineChart('#like-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const tableCount = new dc.DataCount('#dc-data-count' + this.graphId)

      // Bind reset filters links
      d3.select('#hour-chart a.reset').on('click', function() {
        hourChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#matched-chart a.reset').on('click', function() {
        matchedChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#week-chart a.reset').on('click', function() {
        weekChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#like-chart a.reset').on('click', function() {
        likeChart.filterAll()
        rangeChart.filterAll()
        dc.redrawAll()
      })

      const ndx = crossfilter(this.results)

      // Create dimensions
      const all = ndx.groupAll()
      const dayOfWeekDimension = ndx.dimension((d) => {
        const day = d.date.getDay()
        const name = this.$days()
        return `${name[day]}`
      })
      const matchedDimension = ndx.dimension(d => d.matched)
      const monthDimension = ndx.dimension(d => d.month)
      const dayDimension = ndx.dimension(d => d.day)
      const hourDimension = ndx.dimension(d => d.hour)

      // Create groups
      const dayOfWeekGroup = dayOfWeekDimension.group().reduceCount()
      const serviceGroup = matchedDimension.group().reduceCount()
      const hourGroup = hourDimension.group().reduceCount()
      const monthGroup = monthDimension.group()
      const dayGroup = dayDimension.group()

      // Render hour bar chart
      hourChart
        .width(d3.select('#hour-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 10, right: 10, bottom: 20, left: 40 })
        .dimension(hourDimension)
        .group(hourGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleLinear().domain([0, 23]))
        .ordinalColors(colorPalette)
        .yAxis()
      hourChart
        .xAxis()
        .tickFormat(d => d + ':00')
        .ticks(7)

      // Render days of week row chart
      weekChart
        .width(d3.select('#week-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      weekChart.ordering(d => this.$days().indexOf(d.key))

      // Render matched pie chart
      matchedChart
        .width(d3.select('#matched-chart').node().getBoundingClientRect().width)
        .height(180)
        .radius(180 / 2)
        .innerRadius(0)
        .dimension(matchedDimension)
        .group(serviceGroup)
        .valueAccessor((d) => {
          return d.value
        })
        .title(d => d.key + ': ' + d.value + ' matchs')
        .ordinalColors(colorPalette)

      matchedChart.on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice.pie-label').call(function(t) {
          t.each(function(d) {
            const self = d3.select(this)
            let text = self.text().toUpperCase()
            if (text.length > 14) { text = text.substring(0, 14) + '.. ' }
            if (text.length > 0) {
              text =
                text +
                ' (' +
                dc.utils.printSingleValue(
                  ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
                ) +
                '%)'
            }
            self.text(text)
          })
        })
      })

      // Render Likes line chart
      const minDate =
        monthDimension.bottom(1).length > 0
          ? monthDimension.bottom(1)[0].month
          : null
      const maxDate =
        monthDimension.top(1).length > 0 ? monthDimension.top(1)[0].day : null
      likeChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(d3.select('#like-chart').node().getBoundingClientRect().width)
        .turnOnControls(false)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(180)
        .brushOn(false)
        .renderArea(true)
        .dimension(monthDimension)
        .group(monthGroup)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .title(d => formatDay(d.key) + ': ' + d.value + ' likes')
        .elasticX(true)
        .elasticY(true)
        .rangeChart(rangeChart)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .clipPadding(10)
        .yAxisLabel('Total likes')
        .ordinalColors(colorPalette)
      likeChart.xAxis().ticks(10)
      likeChart.yAxis().ticks(6)
      likeChart.filterAll()

      // range chart date picker
      rangeChart
        .width(d3.select('#range-chart').node().getBoundingClientRect().width)
        .height(30)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(dayDimension)
        .group(dayGroup)
        .centerBar(true)
        .elasticY(true)
        .gap(1)
        .x(
          d3
            .scaleTime()
            .domain([
              d3.timeHour.offset(minDate, 0),
              d3.timeHour.offset(maxDate, 2)
            ])
        )
        .round(d3.timeDay.round)
        .valueAccessor(d => d.value)
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(colorPalette)
        .yAxis()
        .ticks(0)

      // Render counter and table
      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some:
            '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> views' +
            " | <a class='resetAll'>Reset All</a>",
          all: 'All <strong>%total-count</strong> views selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          this.results = monthDimension.top(all.value())
          d3.select('#dc-data-count' + this.graphId + ' a.resetAll').on(
            'click',
            () => {
              dc.filterAll()
              dc.renderAll()
            }
          )
        })
      dc.renderAll()
    }
  }
}
</script>
<style scoped>
@import 'assets/styles/dc.css';
::v-deep body {
  font-family: sans-serif;
  color: #22313f;
}

::v-deep .dc-chart g.row text {
  fill: #22313f;
  font-weight: bold;
}

::v-deep .range-chart > svg > g > g.axis.y {
  display: none;
}
</style>
