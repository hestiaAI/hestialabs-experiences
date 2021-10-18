<template>
  <v-container>
    <v-row>
      <v-col cols="12">
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
    <unit-query-results v-bind="{ headers: header, items: results }" />
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
        { text: 'Ad Id', value: 'adId' },
        { text: 'Company', value: 'companyName' },
        { text: 'Targeting Type', value: 'targetingType' },
        { text: 'Targeting Value', value: 'targetingValue' },
        { text: 'Date', value: 'dateStr' },
        { text: 'Impression', value: 'impression' }
      ],
      results: []
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      this.results = [
        {
          adId: 1,
          companyName: 'Apple',
          targetingType: 'Age',
          targetingValue: '13 and up',
          impression: true,
          date: '1626862433338'
        },
        {
          adId: 2,
          companyName: 'Apple',
          targetingType: 'Follower',
          targetingValue: '@technews',
          impression: false,
          date: '1626781735641'
        },
        {
          adId: 3,
          companyName: 'Amazon',
          targetingType: 'Age',
          targetingValue: '13 and up',
          impression: true,
          date: '1626910581735'
        },
        {
          adId: 3,
          companyName: 'Amazon',
          targetingType: 'Age',
          targetingValue: '13 and up',
          impression: true,
          date: '1626909674359'
        },
        {
          adId: 3,
          companyName: 'Amazon',
          targetingType: 'Age',
          targetingValue: '15 and up',
          impression: true,
          date: '1626814506143'
        },
        {
          adId: 3,
          companyName: 'Amazon',
          targetingType: 'Age',
          targetingValue: '15 and up',
          impression: false,
          date: '1625818719435'
        },
        {
          adId: 4,
          companyName: 'Uber',
          targetingType: 'Device',
          targetingValue: 'Iphone 18',
          impression: false,
          date: '1625694058677'
        },
        {
          adId: 4,
          companyName: 'Uber',
          targetingType: 'Age',
          targetingValue: '18 and up',
          impression: false,
          date: '1626867676012'
        }
      ]
      // Create and bind charts to their respective divs
      const volumeChart = new dc.LineChart('#volume-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const tableCount = new dc.DataCount('.dc-data-count')

      // Bind reset filters links
      d3.select('#volume-chart a.reset').on('click', function () {
        rangeChart.filterAll()
        volumeChart.filterAll()
        dc.redrawAll()
      })

      // Format data to correct types
      const dateFormatParser = d3.timeParse('%Q')
      const formatTime = d3.timeFormat('%B %d, %Y')
      this.results.forEach(d => {
        d.date = dateFormatParser(d.date)
        d.day = d3.timeDay(d.date) // pre-calculate days for better performance
        d.dateStr = formatTime(d.day)
      })
      console.log(this.results)
      console.log(dateFormatParser(1626867676012))
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Create dimensions
      const dayDimension = ndx.dimension(d => d.day)

      // Create groups from dimension
      const dayGroup = dayDimension.group().reduceCount()

      // Render volume line chart
      const minDate = d3.min(this.results, function (d) {
        return d.day
      })
      const maxDate = d3.max(this.results, function (d) {
        return d.day
      })
      const maxValue = dayGroup.top(1)[0].value + 2
      const width = d3
        .select('#volume-chart')
        .node()
        .getBoundingClientRect().width
      const height = 200

      console.log(minDate, maxDate, maxValue, width, height)

      volumeChart
        .renderArea(true)
        .width(width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .group(dayGroup)
        .dimension(dayDimension)
        .curve(d3.curveCardinal.tension(0.6))
        .x(
          d3
            .scaleTime()
            .domain([
              d3.timeHour.offset(minDate, 0),
              d3.timeHour.offset(maxDate, 2)
            ])
        )
        .y(d3.scaleLinear().domain([0, maxValue]))
        .ordinalColors(['#58539E'])
        .xUnits(d3.timeHour)
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .xyTipsOn(true)
        .mouseZoomable(true)
        .rangeChart(rangeChart)
        .renderHorizontalGridLines(false)
        // .dashStyle([3,1,1,1])
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0.0
        })
        .yAxisLabel('N° of tracker reach')
        .clipPadding(10)
        // .xAxisLabel("Date")
        .yAxis()
        .ticks(5)

      // volume chart date picker
      rangeChart
        .width(width)
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(dayDimension)
        .group(dayGroup)
        .centerBar(true)
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
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(['#58539E'])
        .yAxis()
        .ticks(0)

      // Render counter and table
      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some:
            '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            " | <a class='reset'>Reset All</a>",
          all: 'All records selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          this.results = dayDimension.top(all.value())
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
