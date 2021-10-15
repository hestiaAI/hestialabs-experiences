<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <v-row>
          <v-col cols="12">
            <div id="volume-chart">
              <strong>Number of tracking over time</strong>
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
          <v-col cols="12" md="6">
            <div id="category-chart">
              <strong>Purposes of tracking</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div id="app-chart">
              <strong>Applications that use trackers</strong>
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
      </v-col>
      <v-col cols="12" md="3">
        <div id="advertiser-chart">
          <strong>Companies behind tracking</strong>
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
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'TrackerGraph',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      // Create and bind charts to their respective divs
      const volumeChart = new dc.LineChart('#volume-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const categoryChart = new dc.PieChart('#category-chart')
      const advertiserChart = new dc.RowChart('#advertiser-chart')
      const appChart = new dc.RowChart('#app-chart')

      // Bind reset filters links
      d3.select('#volume-chart a.reset').on('click', function () {
        rangeChart.filterAll()
        volumeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#category-chart a.reset').on('click', function () {
        categoryChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#advertiser-chart a.reset').on('click', function () {
        advertiserChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#app-chart a.reset').on('click', function () {
        appChart.filterAll()
        dc.redrawAll()
      })

      // Format data to correct types
      const dateFormatParser = d3.timeParse('%Q')
      this.values.forEach(d => {
        d.date = dateFormatParser(d.time)
        d.day = d3.timeDay(d.date) // pre-calculate days for better performance
        d.Category = d.Category === '' ? 'Unknown' : d.Category
        d.App = d.App === '' ? 'Unknown' : d.App
        d.Tracker = d.Tracker === '' ? 'Unknown' : d.Tracker
      })

      const ndx = crossfilter(this.values)

      // Create dimensions
      const dayDimension = ndx.dimension(d => d.day)
      const categoryDimension = ndx.dimension(d => d.Category)
      const advertiserDimension = ndx.dimension(d => d.Tracker)
      const appDimension = ndx.dimension(d => d.App)

      // Create groups from dimension
      const dayGroup = dayDimension.group().reduceCount()
      const categoryGroup = categoryDimension.group().reduceCount()
      const advertiserGroup = advertiserDimension.group().reduceCount()
      const appGroup = appDimension.group().reduceCount()

      // Render volume line chart
      const minDate = d3.min(this.values, function (d) {
        return d.day
      })
      const maxDate = d3.max(this.values, function (d) {
        return d.day
      })
      const maxValue = dayGroup.top(1)[0].value + 2
      let width = d3
        .select('#volume-chart')
        .node()
        .getBoundingClientRect().width
      let height = 200

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

      // Render category pie chart
      width = d3.select('#category-chart').node().getBoundingClientRect().width
      height = 300
      const scale = Math.min(width, height)
      categoryChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(categoryDimension)
        .group(categoryGroup)
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .ordinalColors([
          '#371D52',
          '#6652A1',
          '#35334A',
          '#859ED5',
          '#CC94F2',
          '#9A5BD9',
          '#6F36BF',
          '#3F1973',
          '#58539E'
        ])

      categoryChart.on('pretransition', function (chart) {
        chart.selectAll('text.pie-slice.pie-label').call(function (t) {
          t.each(function (d) {
            const self = d3.select(this)
            let text = self.text()
            if (text.length > 14) text = text.substring(0, 14) + '.. '
            if (text.length > 0)
              text =
                text +
                ' (' +
                dc.utils.printSingleValue(
                  ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
                ) +
                '%)'
            self.text(text)
          })
        })
      })
      // Render advertiser row chart
      width = d3
        .select('#advertiser-chart')
        .node()
        .getBoundingClientRect().width
      height = 625
      advertiserChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(advertiserGroup)
        .dimension(advertiserDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(20))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render app row chart
      width = d3.select('#app-chart').node().getBoundingClientRect().width
      height = 250
      appChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(appGroup)
        .dimension(appDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

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
