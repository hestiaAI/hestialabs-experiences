<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="1"></v-col>
      <v-col cols="12" sm="10">
        <v-row>
          <v-col cols="12" sm="8">
            <div id="volume-chart">
              <strong>Number of ads over time</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
            <div id="range-chart">
              <p class="muted pull-right" style="margin-right: 15px">
                select a time range to zoom in
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div id="company-chart">
              <strong>Top 10 Companies</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="4">
            <div id="engagement-chart">
              <strong>Interactions with ads (click, video viewing)</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div id="type-chart">
              <strong>Type of targeting</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div id="value-chart">
              <strong>Targeting criteria</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <div id="dc-data-count" class="dc-data-count">
            <span class="filter-count"></span>
            selected out of
            <span class="total-count"></span>
            records |
            <a class="reset">Reset All</a>
          </div>
        </v-row>
      </v-col>
      <v-col cols="12" sm="1"></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="1"></v-col>
      <v-col cols="12" sm="10">
        <unit-query-results v-bind="{ headers: header, items: results }" />
      </v-col>
      <v-col cols="12" sm="1"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'TwitterOverview',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      header: [
        { text: 'Tweet ID', value: 'tweet_id' },
        { text: 'Company', value: 'companyName' },
        { text: 'Date', value: 'date' },
        { text: 'Promoted Tweet', value: 'url' },
        { text: 'Engagement', value: 'engagement' },
        { text: 'Targeting Criteria', value: 'count' }
      ],
      results: []
    }
  },
  mounted() {
    this.drawViz()
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
      const rangeChart = new dc.BarChart('#range-chart')
      const tableCount = new dc.DataCount('.dc-data-count')
      const companyChart = new dc.RowChart('#company-chart')
      const engagementChart = new dc.PieChart('#engagement-chart')
      const typeChart = new dc.RowChart('#type-chart')
      const valueChart = new dc.RowChart('#value-chart')

      // Bind reset filters links
      d3.select('#volume-chart a.reset').on('click', function () {
        rangeChart.filterAll()
        volumeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#company-chart a.reset').on('click', function () {
        companyChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#engagement-chart a.reset').on('click', function () {
        engagementChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#type-chart a.reset').on('click', function () {
        typeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#value-chart a.reset').on('click', function () {
        valueChart.filterAll()
        dc.redrawAll()
      })

      // Format data to correct types
      // const dateFormatParser = d3.timeParse('%Q')
      // 2021-06-04 21:08:08
      const dateFormatParser = d3.timeParse('%Y-%m-%d %H:%M:%S')
      const formatTime = d3.timeFormat('%B %d, %Y')
      this.results.forEach(d => {
        d.targetingType = d.targetingType ? d.targetingType : 'Unknown'
        d.targetingValue = d.targetingValue ? d.targetingValue : 'Unknown'
        d.dateParsed = dateFormatParser(d.date)
        d.day = d3.timeDay(d.dateParsed) // pre-calculate days for better performance
        d.dateStr = formatTime(d.dateParsed)
        d.url = 'https://twitter.com/x/status/' + d.tweet_id
      })
      const minDate = d3.min(this.results, function (d) {
        return d.day
      })
      const maxDate = d3.max(this.results, function (d) {
        return d.day
      })

      // Build index crossfilter
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Create dimensions
      const adPerDayDimension = ndx.dimension(d => d.day)
      const companyDimension = ndx.dimension(d => d.companyName)
      const engagementDimension = ndx.dimension(d =>
        d.engagement ? 'True' : 'False'
      )
      const targetingTypeDimension = ndx.dimension(d => d.targetingType)
      const targetingValueDimension = ndx.dimension(d => d.targetingValue)

      // custom reduce function for grouping by ad and not targeting criteria
      const init = () => ({
        // initial
        count: 0,
        dict: {}
      })
      const addRecord = (p, v) => {
        // add
        p.dict[v.tweet_id + v.date] = (p.dict[v.tweet_id + v.date] || 0) + 1
        if (p.dict[v.tweet_id + v.date] === 1) p.count++
        return p
      }
      const removeRecord = (p, v) => {
        // remove
        p.dict[v.tweet_id + v.date] -= 1
        if (p.dict[v.tweet_id + v.date] === 0) p.count--
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
              .filter(function (d) {
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
        .mouseZoomable(true)
        .rangeChart(rangeChart)
        .renderHorizontalGridLines(false)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0.0
        })
        .yAxisLabel('N° of ads')
        .clipPadding(10)
        .title(d => {
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
        .label(d => {
          if (
            engagementChart.hasFilter() &&
            !engagementChart.hasFilter(d.key)
          ) {
            return `${d.key} (0%)`
          }
          let label = d.key
          if (all.value()) {
            label += ` (${Math.round(
              (d.value.count / allGroup.value().count) * 100
            )}%)`
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
        .group({
          value() {
            return allGroup.value().count
          }
        })
        .html({
          some:
            '<strong>%filter-count</strong> selected out of <strong>' +
            total +
            '</strong> ads displayed on your Twitter feed' +
            " | <a class='reset'>Reset All</a>",
          all: 'All ads selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          const newData = d3.flatRollup(
            ndx.allFiltered(),
            v => v.length,
            d => d.tweet_id,
            d => d.companyName,
            d => d.date,
            d => d.url,
            d => d.engagement
          )
          this.results = newData.map(x => ({
            tweet_id: x[0],
            companyName: x[1],
            date: x[2],
            url: x[3],
            engagement: x[4],
            count: x[5]
          }))

          d3.select('#dc-data-count a.reset').on('click', function () {
            dc.filterAll()
            dc.renderAll()
          })
        })
      dc.renderAll()
    }
  }
}
</script>
<style>
@import 'assets/styles/dc.css';

body {
  font-family: sans-serif;
  color: #22313f;
}

.dc-chart g.row text {
  fill: #22313f;
  font-weight: bold;
}

#range-chart g.y {
  display: none;
}

.reset {
  margin-left: 1rem;
}

.v-application a.reset {
  color: rgb(85, 3, 30);
}

p.filters {
  font-size: 0.8rem;
  font-style: italic;
}
</style>
