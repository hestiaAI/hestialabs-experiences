<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="12">
            <div :id="`area-chart-${graphId}`">
              <span class="font-weight-bold">
                <i18n path="item-per-timeunit">
                  <template #title>
                    {{ titleTimeline }}
                  </template>
                  <template #timeUnit>
                    {{ $t(timeUnit.accessor) }}
                  </template>
                </i18n>
              </span>
              <ChartViewFilters />
            </div>
            <div :id="`range-chart-${graphId}`" class="range-chart">
              <ChartViewTextSelectTimeRange />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <div :id="`pie-chart-${graphId}`">
              <div style="display: flex">
                <span class="font-weight-bold">{{ titlePie }}</span>
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div :id="`top-chart-${graphId}`">
              <div style="display: flex">
                <span class="font-weight-bold">{{ titleTop }}</span>
                <VSpacer />
                <div :id="`top-search-${graphId}`" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <ChartViewDcFilterCount
      v-bind="{ filterCount, totalCount, rowLabel }"
    />
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: results, viewBlockTranslationPrefix }" />
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
import ChartViewTextSelectTimeRange from './text/ChartViewTextSelectTimeRange.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewVRowWebShare, ChartViewFilters, ChartViewDcFilterCount, ChartViewTextSelectTimeRange, UnitFilterableTable },
  mixins: [mixin],
  props: {
    titleTimeline: {
      type: String,
      default: 'Timeline Chart'
    },
    titlePie: {
      type: String,
      default: 'Pie Chart'
    },
    titleTop: {
      type: String,
      default: 'Top Chart'
    },
    rowLabel: {
      type: String,
      default: 'records'
    },
    dateAccessor: {
      type: Object,
      required: true
    },
    seriesAccessor: {
      type: Object,
      required: true
    },
    topAccessor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      header: [
        { text: 'Date', value: 'dateStr' },
        { text: 'Name', value: 'name' },
        { text: 'Action', value: 'type' }
      ],
      results: [],
      datesAgg: {
        day: { accessor: 'day', xUnits: d3.timeDays, round: d3.timeDay.round },
        month: {
          accessor: 'month',
          xUnits: d3.timeMonths,
          round: d3.timeMonth.round
        }
      },
      timeUnit: {
        accessor: 'day',
        xUnits: d3.timeDays,
        round: d3.timeDay.round
      }
    }
  },
  methods: {
    drawViz() {
      // Parse and format data
      const formatDay = d3.timeFormat('%B %d, %Y')
      this.results = this.values.map((d) => {
        const date = new Date(d[this.dateAccessor.value])
        const type = decodeURIComponent(escape(d[this.seriesAccessor.value]))
        return {
          name: decodeURIComponent(escape(d[this.topAccessor.value])),
          type: this.messages?.type[type] || type,
          date,
          dateStr: datetimeFormatter(date),
          month: d3.timeMonth(date),
          day: d3.timeDay(date)
        }
      })
      const dateExtent = d3.extent(this.results, d => d.date)
      // Create and bind charts to their respective divs
      const lineChart = new dc.LineChart(`#area-chart-${this.graphId}`)
      const rangeChart = new dc.BarChart(`#range-chart-${this.graphId}`)
      const topChart = new dc.RowChart(`#top-chart-${this.graphId}`)
      const topSearch = this.createTextFilterWidget(`#top-search-${this.graphId}`)
      const pieChart = new dc.PieChart(`#pie-chart-${this.graphId}`)
      // Bind reset filters links
      d3.select(`#top-chart-${this.graphId} a.reset`).on('click', function() {
        topChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#pie-chart-${this.graphId} a.reset`).on('click', function() {
        pieChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#area-chart-${this.graphId} a.reset`).on('click', function() {
        lineChart.filterAll()
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
        this.results = dateDimension.top(all.value())
        // update filter count
        this.filterCount = ndx.allFiltered().length
      })
      // Create dimensions
      this.timeUnit =
                d3.timeMonth.count(...dateExtent) > 10
                  ? this.datesAgg.month
                  : this.datesAgg.day
      const topDimension = ndx.dimension(d => d.name)
      const dateDimension = ndx.dimension(d => d[this.timeUnit.accessor])
      const typeDimension = ndx.dimension(d => d.type)
      topSearch.dimension(ndx.dimension(d => d.name.toLowerCase()))
      // Create groups
      const topGroup = topDimension.group().reduceCount()
      const typeGroup = typeDimension.group().reduceCount()
      const allGroup = dateDimension.group().reduceCount()
      // Render top row chart
      topChart
        .width(d3.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect()
          .width)
        .height(252)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(topGroup))
        .dimension(topDimension)
        .ordinalColors(this.colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      // Render line chart
      const chartWidth = d3
        .select(`#area-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      lineChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(chartWidth)
        .transitionDuration(1000)
        .turnOnControls(false)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(180)
        .brushOn(false)
        .renderArea(true)
        .dimension(dateDimension)
        .group(dateDimension.group().reduceCount())
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
        .title(d => `${formatDay(d.key)} : ${d.value} ${this.rowLabel}`)
        .clipPadding(10)
        .yAxisLabel('Total ' + this.rowLabel)
        .ordinalColors(this.colorPalette)
      lineChart.xAxis().ticks(10)
      lineChart.yAxis().ticks(6)
      lineChart.filterAll()
      // range chart date picker
      rangeChart
        .width(d3
          .select(`#range-chart-${this.graphId}`)
          .node()
          .getBoundingClientRect().width)
        .height(40)
        .margins({ top: 0, right: 10, bottom: 20, left: 40 })
        .dimension(dateDimension)
        .group(allGroup)
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
      // Render pie chart
      const width = d3
        .select(`#pie-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      const height = 250
      const scale = Math.min(width, height)
      pieChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(typeDimension)
        .group(typeGroup)
        .valueAccessor(d => d.value)
        .title(d => `${d.key}: ${d.value} ${this.rowLabel}`)
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .ordinalColors(this.colorPalette)
      pieChart.on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice.pie-label').call(function(t) {
          t.each(function(d) {
            const self = d3.select(this)
            let text = self.text()
            if (text.length > 14) {
              text = text.substring(0, 14) + '.. '
            }
            if (text.length > 0) {
              text =
                                text +
                                    ' (' +
                                    dc.utils.printSingleValue(((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100) +
                                    '%)'
            }
            self.text(text)
          })
        })
      })
      dc.renderAll()
    }
  }
}
</script>
