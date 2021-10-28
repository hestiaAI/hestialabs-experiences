<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7" lg="8">
        <div id="scatter-chart">
          <strong>Price versus Distance</strong>
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
        <div id="hour-chart">
          <p class="muted pull-right" style="margin-right: 15px">
            select a time range to zoom in
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="5" lg="4">
        <v-card class="general-info">
          <v-card-title>General information</v-card-title>
          <v-card-subtitle></v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row justify="center">
                  <p class="stat-title">N° of trip</p>
                </v-row>
                <v-row justify="center">
                  <h2 id="number-trip" class="stat-number"></h2>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row justify="center">
                  <p class="stat-title">Average Speed</p>
                </v-row>
                <v-row justify="center">
                  <h2 id="number-speed-avg" class="stat-number"></h2>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row align="center" justify="center">
                  <p class="stat-title">Distance</p>
                </v-row>
                <v-row class="stat-numbers" align="center" justify="center">
                  <ul class="list-inline">
                    <li class="pr-2 border-right">
                      <h2 id="number-distance-total" class="stat-number"></h2>
                      <span class="stat-info">Total</span>
                    </li>
                    <li class="pl-2">
                      <h2 id="number-distance-avg" class="stat-number"></h2>
                      <span class="stat-info">Average</span>
                    </li>
                  </ul>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row align="center" justify="center">
                  <p class="stat-title">Duration</p>
                </v-row>
                <v-row class="stat-numbers" align="center" justify="center">
                  <ul class="list-inline">
                    <li class="pr-2 border-right">
                      <h2 id="number-duration-total" class="stat-number"></h2>
                      <span class="stat-info">Total</span>
                    </li>
                    <li class="pl-2">
                      <h2 id="number-duration-avg" class="stat-number"></h2>
                      <span class="stat-info">Average</span>
                    </li>
                  </ul>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row align="center" justify="center">
                  <p class="stat-title">Price</p>
                </v-row>
                <v-row class="stat-numbers" align="center" justify="center">
                  <ul class="list-inline">
                    <li class="pr-2 border-right">
                      <h2 id="number-price-total" class="stat-number" />
                      <span class="stat-info">Total</span>
                    </li>
                    <li class="pl-2">
                      <h2 id="number-price-avg" class="stat-number"></h2>
                      <span class="stat-info">Average</span>
                    </li>
                  </ul>
                </v-row>
              </v-col>
              <v-col cols="12" md="6" class="stat-elem">
                <v-row align="center" justify="center">
                  <p class="stat-title">Waiting Time</p>
                </v-row>
                <v-row class="stat-numbers" align="center" justify="center">
                  <ul class="list-inline">
                    <li class="pr-2 border-right">
                      <h2 id="number-waiting-total" class="stat-number"></h2>
                      <span class="stat-info">Total</span>
                    </li>
                    <li class="pl-2">
                      <h2 id="number-waiting-avg" class="stat-number"></h2>
                      <span class="stat-info">Average</span>
                    </li>
                  </ul>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn elevation="2" block @click="resetAll()">
              Reset all filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="3">
        <div id="service-chart">
          <strong>Service used</strong>
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div id="week-chart">
          <strong>Day of week</strong>
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div id="price-chart">
          <strong>Cumulative price</strong>
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
      </v-col>
      <v-col cols="6" md="3">
        <div id="city-chart">
          <strong>Cities</strong>
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
    <unit-query-results v-bind="{ headers: header, items: results }" />
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import regression from 'regression'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'Uber',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      header: [
        { text: 'City', value: 'City' },
        { text: 'Service', value: 'Product Type' },
        { text: 'Status', value: 'Trip or Order Status' },
        { text: 'Request Time', value: 'dateRequestStr' },
        { text: 'From', value: 'Begin Trip Address' },
        { text: 'To', value: 'Dropoff Address' },
        { text: 'Waiting time (min)', value: 'waiting_time' },
        { text: 'Distance (miles)', value: 'Distance (miles)' },
        { text: 'Duration (min)', value: 'duration' },
        { text: 'Price', value: 'priceStr' }
      ],
      results: []
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    drawViz() {
      // Add data to table
      this.results = this.values

      // Define color palette for the graphs
      const colorPalette = [
        // '#371D52',
        '#6652A1',
        '#35334A',
        '#859ED5',
        '#CC94F2',
        '#9A5BD9',
        '#6F36BF',
        '#3F1973',
        '#58539E'
      ]

      // Parse and format data
      const dateFormatParser = d3.timeParse('%Y-%m-%d %H:%M:%S %Z UTC')
      const formatTime = d3.timeFormat('%B %d, %Y at %H:%M:%S')
      this.results.forEach(d => {
        d.dateRequest = dateFormatParser(d['Request Time'])
        d.dateStart = dateFormatParser(d['Begin Trip Time'])
        d.dateEnd = dateFormatParser(d['Dropoff Time'])
        d.dateRequestStr = formatTime(d.dateRequest)
        d.dateStartStr = formatTime(d.dateStart)
        d.dateEndStr = formatTime(d.dateEnd)
        d.day = d3.timeDay(d.dateStart) // pre-calculate days for better performance
        d.hour = d3.timeHour(d.dateStart).getHours()
        d.duration = d3.timeMinute.count(d.dateStart, d.dateEnd)
        d.waiting_time = d3.timeMinute.count(d.dateRequest, d.dateStart)
        d.priceStr = d['Fare Amount'] + d['Fare Currency']
        d.price = +d['Fare Amount']
        d.distance = +d['Distance (miles)']
        d.city = d.City
      })

      // Create and bind charts to their respective divs
      const scatterChart = new dc.ScatterPlot('#scatter-chart')
      const hourChart = new dc.BarChart('#hour-chart')
      const serviceChart = new dc.PieChart('#service-chart')
      const weekChart = new dc.RowChart('#week-chart')
      const priceChart = new dc.LineChart('#price-chart')
      const cityChart = new dc.RowChart('#city-chart')
      const tripNumber = new dc.NumberDisplay('#number-trip')
      const speedNumber = new dc.NumberDisplay('#number-speed-avg')
      const priceAvgNumber = new dc.NumberDisplay('#number-price-avg')
      const priceTotalNumber = new dc.NumberDisplay('#number-price-total')
      const distanceTotalNumber = new dc.NumberDisplay('#number-distance-total')
      const distanceAvgNumber = new dc.NumberDisplay('#number-distance-avg')
      const durationTotalNumber = new dc.NumberDisplay('#number-duration-total')
      const durationAvgNumber = new dc.NumberDisplay('#number-duration-avg')
      const waitingTotalNumber = new dc.NumberDisplay('#number-waiting-total')
      const waitingAvgNumber = new dc.NumberDisplay('#number-waiting-avg')

      // Bind reset filters links
      d3.select('#scatter-chart a.reset').on('click', function () {
        scatterChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#hour-chart a.reset').on('click', function () {
        hourChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#service-chart a.reset').on('click', function () {
        serviceChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#week-chart a.reset').on('click', function () {
        weekChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#price-chart a.reset').on('click', function () {
        priceChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#city-chart a.reset').on('click', function () {
        cityChart.filterAll()
        dc.redrawAll()
      })
      const ndx = crossfilter(this.results)

      // Create dimensions
      const allDimension = ndx.groupAll()
      const dayOfWeekDimension = ndx.dimension(d => {
        const day = d.dateStart.getDay()
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${day}.${name[day]}`
      })
      const serviceDimension = ndx.dimension(d => d['Product Type'])
      const cityDimension = ndx.dimension(d => d.city)
      const dayDimension = ndx.dimension(d => d.day)
      const scatterDimension = ndx.dimension(d => [d.distance, d.price])
      const hourDimension = ndx.dimension(d => d.hour)

      // Create groups
      const allGroup = allDimension.reduce(
        /* Add elem to dim */
        (p, v) => {
          ++p.count
          p.distanceTotal += v.distance
          p.waitingTotal += v.waiting_time
          p.priceTotal += v.price
          p.durationTotal += v.duration
          return p
        },
        /* Remove elem from dim */
        (p, v) => {
          --p.count
          p.distanceTotal -= v.distance
          p.waitingTotal -= v.waiting_time
          p.priceTotal -= v.price
          p.durationTotal -= v.duration
          return p
        },
        /* initialize p */
        () => ({
          count: 0,
          distanceTotal: 0,
          waitingTotal: 0,
          durationTotal: 0,
          priceTotal: 0
        })
      )
      const dayOfWeekGroup = dayOfWeekDimension.group().reduceCount()
      const serviceGroup = serviceDimension.group().reduceCount()
      const priceGroup = dayDimension.group().reduceSum(d => d.price)
      const cityGroup = cityDimension.group().reduceCount()
      const scatterGroup = scatterDimension.group()
      const hourGroup = hourDimension.group().reduceCount()

      // Render general Information numbers
      tripNumber
        .group(allGroup)
        .valueAccessor(p => p.count)
        .formatNumber(d3.format('.0'))
        .on('pretransition', (chart, filter) => {
          this.results = serviceDimension.top(Infinity)
        })
      speedNumber
        .group(allGroup)
        .valueAccessor(p => {
          return p.durationTotal ? (p.distanceTotal * 60) / p.durationTotal : 0
        })
        .formatNumber(d3.format('.1f'))
      priceAvgNumber
        .group(allGroup)
        .valueAccessor(p => {
          return p.count ? p.priceTotal / p.count : 0
        })
        .formatNumber(d3.format('.1f'))
      priceTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.priceTotal)
        .formatNumber(d3.format('~s'))
      distanceAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.count ? p.distanceTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))
      distanceTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.distanceTotal)
        .formatNumber(d3.format('~s'))
      durationTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.durationTotal)
        .formatNumber(d3.format('~s'))
      durationAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.durationTotal ? p.durationTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))
      waitingTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.waitingTotal)
        .formatNumber(d3.format('~s'))
      waitingAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.count ? p.waitingTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))

      // Render scatter chart
      scatterChart
        .width(d3.select('#scatter-chart').node().getBoundingClientRect().width)
        .height(220)
        .margins({ top: 10, right: 50, bottom: 30, left: 40 })
        .x(d3.scaleLinear().domain([6, 20]))
        .brushOn(true)
        .elasticY(true)
        .elasticX(true)
        .ordinalColors(colorPalette)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel('Distance (miles)')
        .yAxisLabel('Price')
        .dimension(scatterDimension)
        .group(scatterGroup)
        .xAxis()
        .ticks(5)

      scatterChart.on('pretransition', () => {
        const r = regression.linear(
          scatterChart
            .group()
            .all()
            .map(kv => [kv.key[0], kv.key[1]])
        )
        const m = r.equation[0]
        const b = r.equation[1]
        const [x1, x2] = scatterChart.x().domain()
        const points = [[x1, m * x1 + b], [[x2, m * x2 + b]]]
        const xScale = scatterChart.x()
        const yScale = scatterChart.y()
        const margins = scatterChart.margins()

        let line = scatterChart.g().selectAll('line.regression').data([points])
        function doPoints(line) {
          line
            .attr('x1', d => xScale(d[0][0]) + margins.left)
            .attr('y1', d => yScale(d[0][1]) + margins.top)
            .attr('x2', d => xScale(d[1][0][0]) + margins.left)
            .attr('y2', d => yScale(d[1][0][1]) + margins.top)
        }
        line = line
          .enter()
          .append('line')
          .attr('class', 'regression')
          .style('z-index', -1)
          .call(doPoints)
          .merge(line)
          .attr('stroke', 'red')
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.5)
          .attr('stroke-dasharray', '8,8')
          .text('test')

        line
          .transition()
          .duration(scatterChart.transitionDuration())
          .call(doPoints)
      })

      // Render hour bar chart
      hourChart
        .width(d3.select('#hour-chart').node().getBoundingClientRect().width)
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(hourDimension)
        .group(hourGroup)
        .centerBar(true)
        .gap(1)
        .x(d3.scaleLinear().domain([0, 23]))
        .ordinalColors(['#58539E'])
        .yAxis()
        .ticks(0)
      hourChart.xAxis().tickFormat(d => d + ':00')

      // Render days of week row chart
      weekChart
        .width(d3.select('#week-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key.split('.')[1])
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render service pie chart
      serviceChart
        .width(d3.select('#service-chart').node().getBoundingClientRect().width)
        .height(180)
        .radius(180 / 2)
        .innerRadius(20)
        .dimension(serviceDimension)
        .group(serviceGroup)
        .valueAccessor(d => {
          return d.value
        })
        .title(d => d.value + ' trips')
        .ordinalColors(colorPalette)
        .label(d => {
          if (serviceChart.hasFilter() && !serviceChart.hasFilter(d.key)) {
            return `${d.key} (0%)`
          }
          let label = d.key
          if (allDimension.value()) {
            label += ` (${Math.round(
              (d.value / allGroup.value().count) * 100
            )}%)`
          }
          return label
        })

      // Render CumPrice line chart
      const minDate = dayDimension.bottom(1)[0].day
      const maxDate = dayDimension.top(1)[0].day
      function createCumulativeGroup(group) {
        return {
          all() {
            const cumulate = {}
            return group.all().map(function (d) {
              if (cumulate[d.key[0]]) {
                cumulate[d.key[0]] += d.value
              } else {
                cumulate[d.key[0]] = d.value
              }
              return { key: d.key, value: cumulate[d.key[0]] }
            })
          }
        }
      }
      priceChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(d3.select('#price-chart').node().getBoundingClientRect().width)
        .turnOnControls(false)
        .curve(d3.curveCardinal.tension(0.96))
        .xyTipsOn(true)
        .height(180)
        .brushOn(false)
        .dimension(dayDimension)
        .group(createCumulativeGroup(priceGroup))
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .elasticX(true)
        .elasticY(true)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0.0
        })
        .clipPadding(10)
        .yAxisLabel('Total price')
        .brushOn(true)
        .ordinalColors(colorPalette)
        .xAxis()
        .ticks(4)

      // Render city row chart
      cityChart
        .width(d3.select('#city-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(cityGroup)
        .dimension(cityDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
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

ul.list-inline {
  list-style: none;
  padding-left: 0;
}

ul.list-inline > li {
  display: inline-block;
}

li.border-right {
  border-right: 1px solid #90a4ae;
}

.pl-2 {
  padding-left: 1.5rem;
}
.pr-2 {
  padding-right: 1.5rem;
}

h2.stat-number {
  color: #22313f;
}
.stat-info {
  font-style: italic;
  font-size: 0.8em;
}
p.stat-title {
  margin: 0.5rem;
  padding: 0;
}

.stat-elem {
  padding: 1rem;
}
</style>
