<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="8">
            <VRow>
              <VCol cols="12">
                <div :id="`messages-chart-${graphId}`">
                  <span class="font-weight-bold" v-text="messages['Messages Exchanged Over Time']" />
                  <ChartViewFilters />
                </div>
                <div :id="`range-chart-${graphId}`" class="range-chart">
                  <ChartViewTextSelectTimeRange />
                </div>
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="6">
                <div :id="`hour-chart-${graphId}`">
                  <span class="font-weight-bold" v-text="messages['Time of Day']" />
                  <ChartViewFilters />
                </div>
              </VCol>
              <VCol cols="12" md="6">
                <div :id="`week-chart-${graphId}`">
                  <span class="font-weight-bold" v-text="messages['Day']" />
                  <ChartViewFilters />
                </div>
              </VCol>
            </VRow>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`user-chart-${graphId}`">
              <div style="display: flex">
                <span class="font-weight-bold" v-text="messages['Top Users']" />
                <VSpacer />
                <div :id="`user-search-${graphId}`" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <ChartViewDcFilterCount
      v-bind="{ filterCount, totalCount }"
    />
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable :id="id" v-bind="{ headers: header, items: results }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
import { removeEmptyBins } from './utils/dc-helpers'
import { datetimeFormatter } from '@/utils/dates'
import ChartViewVRowWebShare from './ChartViewVRowWebShare.vue'
import ChartViewFilters from './filters/ChartViewFilters.vue'
import ChartViewDcFilterCount from './dc/ChartViewDcFilterCount.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'
import ChartViewTextSelectTimeRange from './text/ChartViewTextSelectTimeRange.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewVRowWebShare, ChartViewFilters, ChartViewDcFilterCount, UnitFilterableTable, ChartViewTextSelectTimeRange },
  mixins: [mixin],
  data() {
    return {
      header: [
        { text: 'Sender', value: 'senderName' },
        { text: 'Message', value: 'messageContent' },
        { text: 'Sent on', value: 'dateStr' }
      ],
      results: []
    }
  },
  methods: {
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
          month: d3.timeMonth(date),
          day: d3.timeDay(date),
          weekDay: date.getDay(),
          hour: d3.timeHour(date).getHours() // pre-calculate hours for better performance
        }
      })
      // Create and bind charts to their respective divs
      const messageChart = new dc.LineChart(`#messages-chart-${this.graphId}`)
      const rangeChart = new dc.BarChart(`#range-chart-${this.graphId}`)
      const userChart = new dc.RowChart(`#user-chart-${this.graphId}`)
      const hourChart = new dc.BarChart(`#hour-chart-${this.graphId}`)
      const weekChart = new dc.RowChart(`#week-chart-${this.graphId}`)
      const userSearch = this.createTextFilterWidget(`#user-search-${this.graphId}`)
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
      d3.select(`#messages-chart-${this.graphId} a.reset`).on('click', function() {
        messageChart.filterAll()
        rangeChart.filterAll()
        dc.redrawAll()
      })
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()
      // get total number of records
      this.totalCount = ndx.size()
      this.filterCount = this.totalCount
      ndx.onChange(() => {
        // update table
        this.results = monthDimension.top(all.value())
        // update filter count
        this.filterCount = ndx.allFiltered().length
      })
      // Create dimensions
      const dayOfWeekDimension = ndx.dimension((d) => {
        const name = this.$days()
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
        .width(d3
          .select(`#hour-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
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
        .width(d3
          .select(`#week-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
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
      // Render user row chart
      userChart
        .width(d3
          .select(`#user-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
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
      const minDate = monthDimension.bottom(1).length > 0
        ? monthDimension.bottom(1)[0].month
        : null
      const maxDate = monthDimension.top(1).length > 0 ? monthDimension.top(1)[0].day : null
      messageChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(d3
          .select(`#messages-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
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
        .yAxisLabel(this.messages['Total Messages'])
        .ordinalColors(colorPalette)
      messageChart.xAxis().ticks(10)
      messageChart.yAxis().ticks(6)
      messageChart.filterAll()
      // range chart date picker
      rangeChart
        .width(d3
          .select(`#range-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
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
      dc.renderAll()
    }
  }
}
</script>
