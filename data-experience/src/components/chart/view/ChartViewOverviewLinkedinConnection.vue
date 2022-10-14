<template>
  <VContainer>
    <VRow dense>
      <VCol cols="12">
        <div :id="'connections-chart' + graphId">
          <span class="font-weight-bold" v-text="messages['Cumulative number of connections']" />
          <a v-t="'reset'" class="reset" style="display: none" />
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
        <div :id="'range-chart' + graphId" class="range-chart">
          <ChartViewTextSelectTimeRange />
        </div>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="4">
        <div :id="'company-chart' + graphId">
          <div style="display: flex">
            <span class="font-weight-bold" v-text="messages['Company']" />
            <VSpacer />
            <div id="company-search" />
          </div>
          <a v-t="'reset'" class="reset" style="display: none" />
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
      <VCol cols="4">
        <div :id="'week-chart' + graphId">
          <span v-t="messages['Day']" class="font-weight-bold" />
          <a v-t="'reset'" class="reset" style="display: none" />
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
      <VCol cols="4">
        <div :id="'position-chart' + graphId">
          <div style="display: flex">
            <span v-t="messages['Position']" class="font-weight-bold" />
            <VSpacer />
            <div id="position-search" />
          </div>
          <a v-t="'reset'" class="reset" style="display: none" />
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <template v-if="filterCount === totalCount">
        <i18n tag="div" :path="kViewBlock('selected-all')">
          <template #totalCount>
            <span class="font-weight-bold" v-text="totalCount" />
          </template>
        </i18n>
        <span v-t="'click-graph'" />
      </template>
      <template v-else>
        <i18n tag="div" :path="kViewBlock('selected-some')">
          <template v-for="(v, k) in { filterCount, totalCount }" #[k]>
            <span :key="k" class="font-weight-bold" v-text="v" />
          </template>
        </i18n>
        <span>&nbsp;| <a v-t="'Reset All'" @click="resetAll" /></span>
      </template>
    </VRow>
    <UnitFilterableTable :id="id" v-bind="{ headers: header, items: results }" />
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
import { createCumulativeGroup } from './utils/DCHelpers'
import ChartViewTextSelectTimeRange from './text/ChartViewTextSelectTimeRange.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  props: {
    messages: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      header: [
        { text: 'First Name', value: 'firstname' },
        { text: 'Last Name', value: 'lastname' },
        { text: 'Email Address', value: 'email' },
        { text: 'Company', value: 'company' },
        { text: 'Position', value: 'position' },
        { text: 'Connected On', value: 'dateStr' }
      ],
      results: []
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    removeEmptyBins(group) {
      return {
        top(n) {
          return group
            .top(Infinity)
            .filter(function(d) {
              return d.value.count !== 0 && d.value !== 0
            })
            .slice(0, n)
        },
        all() {
          return group.all()
        }
      }
    },
    drawViz() {
      const { graphId } = this
      const colorPalette = [
        '#7570b3',
        // '#371D52',
        // '#35334A',
        '#6652A1',
        '#859ED5',
        '#CC94F2',
        '#9A5BD9',
        '#6F36BF',
        '#3F1973',
        '#58539E'
      ]
      // Format data to correct types 06 Oct 2021
      const formatDate = d3.timeFormat('%B %d, %Y')
      // Keeps only movies and tv shows (not trailer etc..)
      this.results = this.values
      this.results.forEach((d) => {
        d.firstname = d.firstName
        d.lastname = d.lastName
        d.company = d.company || 'Unknown'
        d.position = d.position || 'Unknown'
        d.email = d.emailAddress
        d.date = new Date(d.connectedOn)
        d.week = d3.timeWeek(d.date) // pre-calculate months for better performance
        d.dateStr = formatDate(d.date)
      })
      // Create crossfilter indexing
      const ndx = crossfilter(this.results)
      // get total number of records
      this.totalCount = ndx.size()
      this.filterCount = this.totalCount
      ndx.onChange(() => {
        // update table
        this.results = weekDimension.top(all.value())
        // update filter count
        this.filterCount = ndx.allFiltered().length
      })
      const all = ndx.groupAll()
      // get total number of records
      this.totalCount = ndx.size()
      this.filterCount = this.totalCount
      ndx.onChange(() => {
        // update table
        this.results = weekDimension.top(all.value())
        // update filter count
        this.filterCount = ndx.allFiltered().length
      })
      // Create and bind charts to their respective divs
      const connectionsChart = new dc.LineChart('#connections-chart' + graphId)
      const rangeChart = new dc.BarChart('#range-chart' + graphId)
      const companyChart = new dc.RowChart('#company-chart' + graphId)
      const positionChart = new dc.RowChart('#position-chart' + graphId)
      const weekChart = new dc.RowChart('#week-chart' + graphId)
      const companySearch = this.createTextFilterWidget('#company-search')
      const positionSearch = this.createTextFilterWidget('#position-search')
      companySearch.dimension(ndx.dimension(d => d.company.toLowerCase()))
      positionSearch.dimension(ndx.dimension(d => d.position.toLowerCase()))
      // Bind reset filters links
      d3.select('#connections-chart' + graphId + ' a.reset').on('click', function() {
        rangeChart.filterAll()
        connectionsChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#company-chart' + graphId + ' a.reset').on('click', function() {
        companyChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#position-chart' + graphId + ' a.reset').on('click', function() {
        positionChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#week-chart' + graphId + ' a.reset').on('click', function() {
        weekChart.filterAll()
        dc.redrawAll()
      })
      // Create dimensions
      const weekDimension = ndx.dimension(d => d.week)
      const companyDimension = ndx.dimension(d => d.company)
      const positionDimension = ndx.dimension(d => d.position)
      const weekDayDimension = ndx.dimension((d) => {
        const day = d.date.getDay()
        const name = this.$days()
        return `${name[day]}`
      })
      // Create groups from dimension
      const weekGroup = weekDimension.group().reduceCount()
      // const typeGroup = typeDimension.group().reduceSum(d => d.duration)
      const companyGroup = companyDimension.group().reduceCount()
      const positionGroup = positionDimension.group().reduceCount()
      const weekDayGroup = weekDayDimension.group().reduceCount()
      // Render watch time line chart
      const minDate = weekDimension.bottom(1)[0].date
      const maxDate = weekDimension.top(1)[0].date
      const maxValue = weekGroup.top(1)[0].value + 2
      let width = d3
        .select('#connections-chart' + graphId)
        .node()
        .getBoundingClientRect().width
      let height = 150
      connectionsChart
        .renderArea(true)
        .width(width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 25, right: 25, bottom: 25, left: 25 })
        .group(createCumulativeGroup(weekGroup))
        .dimension(weekDimension)
        .curve(d3.curveMonotoneX)
        .x(d3
          .scaleTime()
          .domain([
            d3.timeHour.offset(minDate, 0),
            d3.timeHour.offset(maxDate, 2)
          ]))
        .y(d3.scaleLinear().domain([0, maxValue]))
        .ordinalColors([colorPalette[1]])
        .valueAccessor(d => d.value)
        .title(d => formatDate(d.key) + ': ' + d.value + ' connections made')
        .xUnits(d3.timeHour)
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .xyTipsOn(true)
        .mouseZoomable(false)
        .rangeChart(rangeChart)
        .renderHorizontalGridLines(false)
      // .dashStyle([3,1,1,1])
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .yAxisLabel('Connections')
        .clipPadding(10)
      // .xAxisLabel("Date")
        .yAxis()
        .ticks(5)
      connectionsChart.xAxis().ticks(5)
      // range chart date picker
      rangeChart
        .width(width)
        .height(30)
        .margins({ top: 0, right: 25, bottom: 20, left: 25 })
        .dimension(weekDimension)
        .group(weekGroup)
        .centerBar(true)
        .elasticY(true)
        .gap(1)
        .x(d3
          .scaleTime()
          .domain([
            d3.timeHour.offset(minDate, 0),
            d3.timeHour.offset(maxDate, 2)
          ]))
        .round(d3.timeDay.round)
        .valueAccessor(d => d.value)
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(colorPalette)
        .yAxis()
        .ticks(0)
      // Render company row chart
      width = d3
        .select('#company-chart' + graphId)
        .node()
        .getBoundingClientRect().width
      height = 400
      companyChart
        .width(width)
        .height(height)
        .margins({ top: 25, left: 25, right: 25, bottom: 25 })
        .group(companyGroup)
        .dimension(companyDimension)
        .ordinalColors(colorPalette)
        .valueAccessor(d => d.value)
        .label(d => d.key)
        .data(group => group.top(20))
      // .labelOffsetX(0)
        .title(d => d.key + ': ' + d.value + ' connections made')
        .elasticX(true)
        .xAxis()
        .ticks(4)
      // Render day of week row chart
      width = d3
        .select('#week-chart' + graphId)
        .node()
        .getBoundingClientRect().width
      height = 400
      weekChart
        .width(width)
        .height(height)
        .margins({ top: 25, left: 25, right: 25, bottom: 25 })
        .group(weekDayGroup)
        .dimension(weekDayDimension)
        .valueAccessor(d => d.value)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value + ' connections')
        .elasticX(true)
        .xAxis()
        .ticks(4)
      weekChart.ordering(d => this.$days().indexOf(d.key))
      // Render content row chart
      width = d3
        .select('#position-chart' + graphId)
        .node()
        .getBoundingClientRect().width
      height = 400
      positionChart
        .width(width)
        .height(height)
        .margins({ top: 25, left: 25, right: 25, bottom: 25 })
        .group(positionGroup)
        .dimension(positionDimension)
        .ordinalColors([colorPalette[0]])
        .valueAccessor(d => d.value)
        .title(d => d.key + ': ' + d.value + ' connections')
        .label(d => d.key)
        .data(group => group.top(20))
      // .labelOffsetX(0)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      dc.renderAll()
    }
  },
  components: { ChartViewTextSelectTimeRange, UnitFilterableTable }
}
</script>
<style scoped>
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

::v-deep .reset {
  margin-left: 1rem;
}

::v-deep .v-application a.reset {
  color: rgb(85, 3, 30);
}

::v-deep p.filters {
  font-size: 0.8rem;
  font-style: italic;
}
</style>
