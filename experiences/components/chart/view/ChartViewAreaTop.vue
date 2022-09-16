<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="8">
            <div :id="`area-chart-${graphId}`">
              <strong>{{ titleArea }} {{ $t('per') }} {{ $t(timeUnit.accessor) }}</strong>
              <a v-t="'reset'" class="reset" style="display: none" />
              <p class="filters">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
              </p>
            </div>
            <div :id="`range-chart-${graphId}`" class="range-chart">
              <ChartViewTextSelectTimeRange />
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`top-chart-${graphId}`">
              <div style="display: flex">
                <strong>{{ titleTop }}</strong>
                <VSpacer />
                <div :id="`top-search-${graphId}`" />
              </div>
              <p class="filters">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
                <a v-t="'reset'" class="reset" style="display: none" />
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <template v-if="filterCount === totalCount">
        <i18n tag="div" :path="kViewBlock('selected-all')">
          <template #totalCount>
            <span class="font-weight-bold" v-text="totalCount" />
          </template>
          <template #rowLabel>
            {{ rowLabel }}
          </template>
        </i18n>
        <span v-t="'click-graph'" />
      </template>
      <template v-else>
        <i18n tag="div" :path="kViewBlock('selected-some')">
          <template v-for="(v, k) in { filterCount, totalCount }" #[k]>
            <span :key="k" class="font-weight-bold" v-text="v" />
          </template>
          <template #rowLabel>
            {{ rowLabel }}
          </template>
        </i18n>
        <span>&nbsp;| <a v-t="'Reset All'" @click="resetAll" /></span>
      </template>
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
  props: {
    titleArea: {
      type: String,
      default: 'Area Chart'
    },
    titleTop: {
      type: String,
      default: 'Top Chart'
    },
    rowLabel: {
      type: String,
      default: 'records'
    },
    yAxisLabel: {
      type: String,
      default: 'Total records'
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
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    drawViz() {
      // Define color palette for the graphs
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
        const date = new Date(d[this.dateAccessor.value])
        const type = decodeURIComponent(escape(d[this.seriesAccessor.value]))
        return {
          name: decodeURIComponent(escape(d[this.topAccessor.value])),
          type: this.messages?.type[type] || type,
          date,
          dateStr: datetimeFormatter(date),
          month: d3.timeMonth(date), // pre-calculate months for better performance
          day: d3.timeDay(date)
        }
      })

      const dateExtent = d3.extent(this.results, d => d.date)

      // Create and bind charts to their respective divs
      const areaChart = new dc.LineChart(`#area-chart-${this.graphId}`)
      const rangeChart = new dc.BarChart(`#range-chart-${this.graphId}`)
      const topChart = new dc.RowChart(`#top-chart-${this.graphId}`)
      const topSearch = this.createTextFilterWidget(`#top-search-${this.graphId}`)

      // Bind reset filters links
      d3.select(`#top-chart-${this.graphId} a.reset`).on('click', function() {
        topChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#area-chart-${this.graphId} a.reset`).on('click', function() {
        areaChart.filterAll()
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
      topSearch.dimension(ndx.dimension(d => d.name.toLowerCase()))

      // Create groups
      const topGroup = topDimension.group().reduceCount()
      const allGroup = dateDimension.group().reduceCount()
      const uniqueTypes = [...new Set(this.results.map(d => d.type))]
      const typesGroups = uniqueTypes.map((type) => {
        return {
          name: type,
          group: dateDimension.group().reduceSum(d => (d.type === type ? 1 : 0))
        }
      })

      // Render top row chart
      topChart
        .width(
          d3.select(`#top-chart-${this.graphId}`).node().getBoundingClientRect()
            .width
        )
        .height(252)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(topGroup))
        .dimension(topDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render area chart
      const chartWidth = d3
        .select(`#area-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      areaChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(chartWidth)
        .turnOnControls(false)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(180)
        .brushOn(false)
        .renderArea(true)
        .dimension(dateDimension)
        .group(typesGroups[0].group, typesGroups[0].name)
        .x(d3.scaleTime().domain(dateExtent))
        .legend(
          new dc.Legend()
            .x(chartWidth - 100)
            .y(5)
            .itemHeight(13)
            .gap(5)
        )
        .elasticY(true)
        .rangeChart(rangeChart)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .clipPadding(10)
        .yAxisLabel(this.yAxisLabel)
        .ordinalColors(colorPalette)
      areaChart.xAxis().ticks(10)
      areaChart.yAxis().ticks(6)

      typesGroups
        .slice(1)
        .forEach(typesGroup =>
          areaChart.stack(typesGroup.group, typesGroup.name)
        )

      typesGroups.forEach(typesGroup =>
        areaChart.title(
          typesGroup.name,
          d => `${formatDay(d.key)} : ${d.value} ${typesGroup.name}`
        )
      )

      areaChart.filterAll()

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
        .ordinalColors(colorPalette)
        .yAxis()
        .ticks(0)

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
