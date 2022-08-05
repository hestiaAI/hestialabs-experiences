<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="8">
            <VRow>
              <VCol cols="12">
                <div :id="`messages-chart-${graphId}`">
                  <strong>Messages Exchanged over time</strong>
                  <a class="reset" style="display: none">reset</a>
                  <p class="filters">
                    <span>
                      Current filter:
                      <span class="filter" />
                    </span>
                  </p>
                </div>
                <div :id="`range-chart-${graphId}`" class="range-chart">
                  <p
                    class="muted pull-right text-subtitle-2"
                    style="margin-right: 15px; margin-bottom: 5px"
                  >
                    {{ $t('select-time-range') }}
                  </p>
                </div>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <div :id="`hour-chart-${graphId}`">
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
              <VCol cols="12" md="6">
                <div :id="`week-chart-${graphId}`">
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
            </VRow>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`user-chart-${graphId}`">
              <div style="display: flex">
                <strong>Top Users</strong>
                <VSpacer />
                <div :id="`user-search-${graphId}`" />
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter" />
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <div :id="`dc-data-count-${graphId}`" class="dc-data-count">
        <span class="filter-count" />
        selected out of
        <span class="total-count" />
        messages |
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
import { removeEmptyBins } from './utils/DCHelpers'
import { datetimeFormatter } from '@/utils/dates'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  data() {
    return {
      header: [
        { text: 'Sender', value: 'senderName' },
        { text: 'Message', value: 'messageContent' },
        { text: 'Send At', value: 'dateStr' }
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
      const formatDay = d3.timeFormat('%B %d, %Y')
      this.results = this.values.map((d) => {
        const date = new Date(d.sendDatetime)
        return {
          senderName: decodeURIComponent(escape(d.senderName)),
          messageContent: decodeURIComponent(escape(d.messageContent)),
          date,
          dateStr: datetimeFormatter(date),
          month: d3.timeMonth(date), // pre-calculate months for better performance
          day: d3.timeDay(date),
          weekDay: date.getDay(), // pre-calculate day of week for better performance
          hour: d3.timeHour(date).getHours() // pre-calculate hours for better performance
        }
      })

      // Create and bind charts to their respective divs
      const messageChart = new dc.LineChart(`#messages-chart-${this.graphId}`)
      const rangeChart = new dc.BarChart(`#range-chart-${this.graphId}`)
      const userChart = new dc.RowChart(`#user-chart-${this.graphId}`)
      const hourChart = new dc.BarChart(`#hour-chart-${this.graphId}`)
      const weekChart = new dc.RowChart(`#week-chart-${this.graphId}`)
      const tableCount = new dc.DataCount(`#dc-data-count-${this.graphId}`)
      const userSearch = new dc.TextFilterWidget(`#user-search-${this.graphId}`)

      // Bind reset filters links
      d3.select(`#hour-chart-${this.graphId} a.reset`).on('click', function() {
        hourChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#user-chart-${this.graphId} a.reset`).on('click', function() {
        userChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#week-chart-${this.graphId} a.reset`).on('click', function() {
        weekChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#messages-chart-${this.graphId} a.reset`).on(
        'click',
        function() {
          messageChart.filterAll()
          rangeChart.filterAll()
          dc.redrawAll()
        }
      )

      const ndx = crossfilter(this.results)

      // Create dimensions
      const all = ndx.groupAll()
      const dayOfWeekDimension = ndx.dimension((d) => {
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${name[d.weekDay]}`
      })
      const userDimension = ndx.dimension(d => d.senderName)
      const monthDimension = ndx.dimension(d => d.month)
      const dayDimension = ndx.dimension(d => d.day)
      const hourDimension = ndx.dimension(d => d.hour)
      userSearch.dimension(ndx.dimension(d => d.senderName.toLowerCase()))

      // Create groups
      const dayOfWeekGroup = dayOfWeekDimension.group().reduceCount()
      const userGroup = userDimension.group().reduceCount()
      const hourGroup = hourDimension.group().reduceCount()
      const monthGroup = monthDimension.group().reduceCount()
      const dayGroup = dayDimension.group().reduceCount()

      // Render hour bar chart
      hourChart
        .width(
          d3
            .select(`#hour-chart-${this.graphId}`)
            .node()
            .getBoundingClientRect().width
        )
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
        .width(
          d3
            .select(`#week-chart-${this.graphId}`)
            .node()
            .getBoundingClientRect().width
        )
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
      weekChart.ordering(function(d) {
        switch (d.key) {
          case 'Mon':
            return 0
          case 'Tue':
            return 1
          case 'Wed':
            return 2
          case 'Thu':
            return 3
          case 'Fri':
            return 4
          case 'Sat':
            return 5
          case 'Sun':
            return 6
          default:
            return 0
        }
      })

      // Render user row chart
      userChart
        .width(
          d3
            .select(`#user-chart-${this.graphId}`)
            .node()
            .getBoundingClientRect().width
        )
        .height(525)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(userGroup))
        .dimension(userDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(20))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render Likes line chart
      const minDate =
        monthDimension.bottom(1).length > 0
          ? monthDimension.bottom(1)[0].month
          : null
      const maxDate =
        monthDimension.top(1).length > 0 ? monthDimension.top(1)[0].day : null
      messageChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(
          d3
            .select(`#messages-chart-${this.graphId}`)
            .node()
            .getBoundingClientRect().width
        )
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
        .yAxisLabel('Total Messages')
        .ordinalColors(colorPalette)
      messageChart.xAxis().ticks(10)
      messageChart.yAxis().ticks(6)
      messageChart.filterAll()

      // range chart date picker
      rangeChart
        .width(
          d3
            .select(`#range-chart-${this.graphId}`)
            .node()
            .getBoundingClientRect().width
        )
        .height(40)
        .margins({ top: 0, right: 10, bottom: 20, left: 40 })
        .dimension(dayDimension)
        .group(dayGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .valueAccessor(d => d.value.count)
        .label(d => d.key)
        .round(d3.timeDay.round)
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
            '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> messages' +
            " | <a class='resetAll'>Reset All</a>",
          all: 'All <strong>%total-count</strong> messages selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          this.results = monthDimension.top(all.value())
          d3.select(`#dc-data-count-${this.graphId} a.resetAll`).on(
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
