<template>
  <VContainer>
    <VRow dense>
      <VCol cols="8">
        <VRow dense>
          <VCol cols="12">
            <div id="watch-time-chart">
              <strong>Watch time (in hours per month)</strong>
            </div>
            <div id="range-chart"></div>
          </VCol>
        </VRow>
        <VRow dense>
          <VCol cols="8">
            <div id="hour-chart">
              <strong>Time of the day</strong>
            </div>
          </VCol>
          <VCol cols="4">
            <div id="week-chart">
              <strong>Day of week</strong>
            </div>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="4">
        <div id="content-chart">
          <strong>Top title</strong>
        </div>
      </VCol>
    </VRow>
    <VRow dense>
      <VCol cols="4">
        <div id="user-chart">
          <strong>Users</strong>
        </div>
      </VCol>
      <VCol cols="4">
        <div id="country-chart">
          <strong>Country</strong>
        </div>
      </VCol>
      <VCol cols="4">
        <div id="device-chart">
          <strong>Device used</strong>
        </div>
      </VCol>
    </VRow>
    <VRow>
      <div id="dc-data-count" class="dc-data-count">
        <span class="filter-count"></span>
        selected out of
        <span class="total-count"></span>
        records |
        <a class="reset">Reset All</a>
      </div>
    </VRow>
    <UnitFilterableTable :data="{ headers: header, items: results }" />
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
        { text: 'Date', value: 'Start Time' },
        { text: 'Duration', value: 'Duration' },
        { text: 'Content', value: 'Title' },
        { text: 'User', value: 'Profile Name' },
        { text: 'Country', value: 'Country' }
      ],
      results: []
    }
  },
  methods: {
    removeEmptyBins(group) {
      return {
        top(n) {
          return group
            .top(Infinity)
            .filter(function (d) {
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
      const colorPalette = [
        '#371D52',
        '#6652A1',
        '#35334A',
        '#859ED5',
        '#CC94F2',
        '#9A5BD9',
        '#6F36BF',
        '#3F1973',
        '#58539E'
      ]
      // Format data to correct types 2021-09-19 22:58:12
      const dateFormatParser = d3.timeParse('%Y-%m-%d %H:%M:%S')
      const formatTime = d3.timeFormat('%B %d, %Y')

      // Keeps only movies and tv shows (not trailer etc..)
      this.results = this.values.filter(
        d => d['Supplemental Video Type'] === ''
      )
      this.results.forEach(d => {
        const time = d.Duration.split(':')
        d.date = dateFormatParser(d['Start Time'])
        d.month = d3.timeMonth(d.date) // pre-calculate months for better performance
        d.dateStr = formatTime(d.day)
        d.hour = d3.timeHour(d.date).getHours()
        const title = d.Title.split(':')
        d.content = title[0].includes('HIDDEN TITLE') ? title[1] : title[0]
        d.device = d['Device Type'] === '' ? 'Unknown' : d['Device Type']
        d.duration = +time[0] + +time[1] / 60 + +time[2] / 60 / 60
        d.user = d['Profile Name']
      })
      // Create crossfilter indexing
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Create and bind charts to their respective divs
      const watchChart = new dc.LineChart('#watch-time-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const userChart = new dc.PieChart('#user-chart')
      const countryChart = new dc.RowChart('#country-chart')
      const contentChart = new dc.RowChart('#content-chart')
      const weekChart = new dc.RowChart('#week-chart')
      const deviceChart = new dc.RowChart('#device-chart')
      const hourChart = new dc.BarChart('#hour-chart')
      const tableCount = new dc.DataCount('.dc-data-count')

      // Create dimensions
      const monthDimension = ndx.dimension(d => d.month)
      // const typeDimension = ndx.dimension(d => d.type)
      const userDimension = ndx.dimension(d => d.user)
      const deviceDimension = ndx.dimension(d => d.device)
      const contentDimension = ndx.dimension(d => d.content)
      const countryDimension = ndx.dimension(d => d.Country)
      const hourDimension = ndx.dimension(d => d.hour)
      const weekDimension = ndx.dimension(d => {
        const day = d.date.getDay()
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${name[day]}`
      })

      // Create groups from dimension
      const monthGroup = monthDimension.group().reduceSum(d => d.duration)
      // const typeGroup = typeDimension.group().reduceSum(d => d.duration)
      const userGroup = userDimension.group().reduceSum(d => d.duration)
      const deviceGroup = deviceDimension.group().reduceSum(d => d.duration)
      const contentGroup = contentDimension.group().reduceSum(d => d.duration)
      const countryGroup = countryDimension.group().reduceSum(d => d.duration)
      const hourGroup = hourDimension.group().reduceSum(d => d.duration)
      const weekGroup = weekDimension.group().reduceSum(d => d.duration)

      // Render watch time line chart
      const minDate = monthDimension.bottom(1)[0].date
      const maxDate = monthDimension.top(1)[0].date
      const maxValue = monthGroup.top(1)[0].value + 2
      let width = d3
        .select('#watch-time-chart')
        .node()
        .getBoundingClientRect().width
      let height = 150

      watchChart
        .renderArea(true)
        .width(width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .group(monthGroup)
        .dimension(monthDimension)
        .curve(d3.curveMonotoneX)
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
        .mouseZoomable(false)
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

      // range chart date picker
      rangeChart
        .width(width)
        .height(30)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(monthDimension)
        .group(monthGroup)
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
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(['#58539E'])
        .yAxis()
        .ticks(0)

      // Render user pie chart
      width = d3.select('#user-chart').node().getBoundingClientRect().width
      height = 250
      const scale = Math.min(width, height)
      userChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(userDimension)
        .group(userGroup)
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

      userChart.on('pretransition', function (chart) {
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

      // Render country row chart
      width = d3.select('#country-chart').node().getBoundingClientRect().width
      height = 200
      countryChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(countryGroup)
        .dimension(countryDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render day of week row chart
      width = d3.select('#week-chart').node().getBoundingClientRect().width
      height = 200
      weekChart
        .width(width)
        .height(height)
        .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .group(weekGroup)
        .dimension(weekDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      weekChart.ordering(function (d) {
        console.log(d)
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

      // Render hour bar chart
      hourChart
        .width(d3.select('#hour-chart').node().getBoundingClientRect().width)
        .height(200)
        .margins({ top: 0, right: 10, bottom: 20, left: 40 })
        .dimension(hourDimension)
        .group(hourGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleLinear().domain([0, 23]))
        .ordinalColors(colorPalette)
        .yAxis()
        .ticks(0)
      hourChart
        .xAxis()
        .tickFormat(d => d + ':00')
        .ticks(7)

      // Render content row chart
      width = d3.select('#content-chart').node().getBoundingClientRect().width
      height = 450
      contentChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(contentGroup)
        .dimension(contentDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(20))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render device row chart
      width = d3.select('#device-chart').node().getBoundingClientRect().width
      height = 200
      deviceChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(this.removeEmptyBins(deviceGroup))
        .dimension(deviceDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render counter and table
      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some:
            '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            " | <a class='reset'>Reset All</a>",
          all: 'All <strong>%total-count</strong> records selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          this.results = monthDimension.top(all.value())
          d3.select('#dc-data-count a.reset').on('click', () => {
            this.toggle()
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
