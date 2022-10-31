<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" sm="8">
            <div id="volume-chart">
              <span class="font-weight-bold" v-text="messages['ads-time']" />
              <ChartViewFilters />
            </div>
            <div :id="'range-chart' + graphId" class="range-chart">
              <ChartViewTextSelectTimeRange />
            </div>
          </VCol>
          <VCol cols="12" sm="4">
            <div id="company-chart">
              <div style="display: flex">
                <span class="font-weight-bold" v-text="messages['top-adv']" />
                <VSpacer />
                <div id="company-search" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" sm="4">
            <div id="engagement-chart">
              <span class="font-weight-bold" v-text="messages['interactions']" />
              <ChartViewFilters />
            </div>
          </VCol>
          <VCol cols="12" sm="4">
            <div id="type-chart">
              <div style="display: flex">
                <span class="font-weight-bold" v-text="messages['targeting-type']" />
                <VSpacer />
                <div id="type-search" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
          <VCol cols="12" sm="4">
            <div id="value-chart">
              <div style="display: flex">
                <span class="font-weight-bold" v-text="messages['targeting-criteria']" />
                <VSpacer />
                <div id="value-search" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <div id="dc-data-count" class="dc-data-count" />
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
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
import ChartViewVRowWebShare from './ChartViewVRowWebShare.vue'
import ChartViewTextSelectTimeRange from './text/ChartViewTextSelectTimeRange.vue'
import ChartViewFilters from './filters/ChartViewFilters.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'ChartViewOverviewTwitter',
  components: { ChartViewVRowWebShare, ChartViewTextSelectTimeRange, ChartViewFilters, UnitFilterableTable },
  mixins: [mixin],
  data() {
    return {
      header: [
        { text: 'Tweet ID', value: 'tweetId' },
        { text: 'Company', value: 'companyName' },
        { text: 'Date', value: 'date_' },
        { text: 'Promoted Tweet', value: 'url' },
        { text: 'Engagement', value: 'engagedWith' },
        { text: 'Targeting Criteria', value: 'count' }
      ],
      results: []
    }
  },
  methods: {
    drawViz() {
      this.results = this.values
      // Define a color palette for the viz
      const colorPalette = [
        '#0D4B7A',
        // '#0B2B38',
        '#248EB8',
        '#7FCEF0',
        '#4A659E'
      ]
      // Create and bind charts to their respective divs
      const volumeChart = new dc.LineChart('#volume-chart')
      const rangeChart = new dc.BarChart('#range-chart' + this.graphId)
      const tableCount = new dc.DataCount('.dc-data-count')
      const companyChart = new dc.RowChart('#company-chart')
      const engagementChart = new dc.PieChart('#engagement-chart')
      const typeChart = new dc.RowChart('#type-chart')
      const valueChart = new dc.RowChart('#value-chart')
      const companySearch = this.createTextFilterWidget('#company-search')
      const typeSearch = this.createTextFilterWidget('#type-search')
      const valueSearch = this.createTextFilterWidget('#value-search')
      // Bind reset filters links
      d3.select('#volume-chart p a.reset').on('click', function() {
        rangeChart.filterAll()
        volumeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#company-chart p a.reset').on('click', function() {
        companyChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#engagement-chart p a.reset').on('click', function() {
        engagementChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#type-chart p a.reset').on('click', function() {
        typeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#value-chart p a.reset').on('click', function() {
        valueChart.filterAll()
        dc.redrawAll()
      })
      // Format data to correct types
      // const dateFormatParser = d3.timeParse('%Q')
      // 2021-06-04 21:08:08
      const dateFormatParser = d3.timeParse('%Y-%m-%d %H:%M:%S')
      const formatTime = d3.timeFormat('%B %d, %Y')
      this.results.forEach((d) => {
        d.targetingType = d.targetingType ? d.targetingType : 'Unknown'
        d.targetingValue = d.targetingValue ? d.targetingValue : 'Unknown'
        d.companyName = d.companyName ? d.companyName : ''
        d.dateParsed = dateFormatParser(d.date_)
        d.day = d3.timeDay(d.dateParsed) // pre-calculate days for better performance
        d.dateStr = formatTime(d.dateParsed)
        d.url = 'https://twitter.com/x/status/' + d.tweetId
      })
      const minDate = d3.min(this.results, function(d) {
        return d.day
      })
      const maxDate = d3.max(this.results, function(d) {
        return d.day
      })
      // Build index crossfilter
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()
      // Create dimensions
      const adPerDayDimension = ndx.dimension(d => d.day)
      const companyDimension = ndx.dimension(d => d.companyName)
      const engagementDimension = ndx.dimension(d => this.$t(d.engagedWith))
      const targetingTypeDimension = ndx.dimension(d => d.targetingType)
      const targetingValueDimension = ndx.dimension(d => d.targetingValue)
      companySearch.dimension(ndx.dimension(d => d.companyName.toLowerCase()))
      typeSearch.dimension(ndx.dimension(d => d.targetingType.toLowerCase()))
      valueSearch.dimension(ndx.dimension(d => d.targetingValue.toLowerCase()))
      // custom reduce function for grouping by ad and not targeting criteria
      const init = () => ({
        // initial
        count: 0,
        dict: {}
      })
      const addRecord = (p, v) => {
        // add
        p.dict[v.tweetId + v.date_] = (p.dict[v.tweetId + v.date_] || 0) + 1
        if (p.dict[v.tweetId + v.date_] === 1) {
          p.count++
        }
        return p
      }
      const removeRecord = (p, v) => {
        // remove
        p.dict[v.tweetId + v.date_] -= 1
        if (p.dict[v.tweetId + v.date_] === 0) {
          p.count--
        }
        return p
      }
      function orderValue(p) {
        return p.count
      }
      // Create groups from dimension
      const adPerDayGroup = adPerDayDimension
        .group()
        .reduce(addRecord, removeRecord, init)
        .order(orderValue)
      const companyGroup = companyDimension
        .group()
        .reduce(addRecord, removeRecord, init)
        .order(orderValue)
      const engagementGroup = engagementDimension
        .group()
        .reduce(addRecord, removeRecord, init)
        .order(orderValue)
      const allGroup = all.reduce(addRecord, removeRecord, init)
      const targetingTypeGroup = targetingTypeDimension.group().reduceCount()
      const targetingValueGroup = targetingValueDimension.group().reduceCount()
      // Make a Fake group to display only value above 0 on the row graphs
      function removeEmptyBins(group) {
        return {
          top(n) {
            return group
              .top(Infinity)
              .filter(function(d) {
                return d.value.count !== 0 && d.value !== 0
              })
              .slice(0, n)
          }
        }
      }
      // Render volume line chart
      volumeChart
        .renderArea(true)
        .width(d3.select('#volume-chart').node().getBoundingClientRect().width)
        .height(150)
        .transitionDuration(1000)
        .margins({ top: 30, right: 10, bottom: 25, left: 40 })
        .group(adPerDayGroup)
        .dimension(adPerDayDimension)
      // .curve(d3.curveCardinal.tension(0.6))
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .valueAccessor(d => d.value.count)
        .ordinalColors(colorPalette)
      // .xUnits(d3.timeHour)
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .xyTipsOn(true)
        .mouseZoomable(false)
        .rangeChart(rangeChart)
        .renderHorizontalGridLines(false)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .yAxisLabel('N° of ads')
        .clipPadding(10)
        .title((d) => {
          return `${formatTime(d.key)}: ${d.value.count}`
        })
        .yAxis()
        .ticks(5)
      // volume chart date picker
      rangeChart
        .width(d3.select('#volume-chart').node().getBoundingClientRect().width)
        .height(40)
        .margins({ top: 0, right: 10, bottom: 20, left: 40 })
        .dimension(adPerDayDimension)
        .group(adPerDayGroup)
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
      // Render advertiser row chart
      companyChart
        .width(d3.select('#company-chart').node().getBoundingClientRect().width)
        .height(240)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(companyGroup))
        .dimension(companyDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .valueAccessor(d => d.value.count)
        .data(group => group.top(10))
        .title(d => d.value.count)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      // Render targeting value row chart
      const width = d3
        .select('#engagement-chart')
        .node()
        .getBoundingClientRect().width
      engagementChart
        .width(width)
        .height(220)
        .radius(width / 2.5)
        .innerRadius(width / 8)
        .dimension(engagementDimension)
        .group(engagementGroup)
        .valueAccessor(d => d.value.count)
        .title(d => d.value.count + ' ads')
        .ordinalColors(colorPalette)
        .label((d) => {
          if (engagementChart.hasFilter() &&
                    !engagementChart.hasFilter(d.key)) {
            return `${d.key} (0%)`
          }
          let label = d.key
          if (all.value()) {
            label += ` (${Math.round((d.value.count / allGroup.value().count) * 100)}%)`
          }
          return label
        })
      // Render targeting type row chart
      typeChart
        .width(d3.select('#type-chart').node().getBoundingClientRect().width)
        .height(240)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(targetingTypeGroup))
        .dimension(targetingTypeDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
      // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      // Render targeting value row chart
      valueChart
        .width(d3.select('#value-chart').node().getBoundingClientRect().width)
        .height(240)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(targetingValueGroup))
        .dimension(targetingValueDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
      // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      // Render counter and table
      const total = allGroup.value().count
      tableCount
        .crossfilter({
          size() {
            return total
          }
        })
        .groupAll({
          value() {
            return allGroup.value().count
          }
        })
        .html({
          some: `<strong>%filter-count</strong> ${this.$t('selected-out-of')} <strong>%total-count</strong> ` +
                    `${this.messages.ads} | <a class='resetAll'>${this.$t('Reset All')}</a>`,
          all: `Total: <strong>%total-count</strong> ${this.messages.ads}. ${this.$t('click-graph')}`
        })
        .on('pretransition', (chart, filter) => {
          const newData = d3.flatRollup(ndx.allFiltered(), v => v.length, d => d.tweetId, d => d.companyName, d => d.date_, d => d.url, d => d.engagedWith)
          this.results = newData.map(x => ({
            tweetId: x[0],
            companyName: x[1],
            date_: x[2],
            url: x[3],
            engagedWith: x[4],
            count: x[5]
          }))
          d3.select('#dc-data-count a.reset').on('click', function() {
            dc.filterAll()
            dc.renderAll()
          })
        })
      dc.renderAll()
    }
  }
}
</script>
<<<<<<< HEAD:data-experience/src/components/chart/view/ChartViewOverviewTwitter.vue
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
::v-deep .dc-text-filter-input {
  font-family: inherit;
  border: 0;
  border-bottom: 1px solid gray;
  outline: 0;
  background: transparent;
}
</style>
=======
>>>>>>> master:experiences/components/chart/view/ChartViewOverviewTwitter.vue
