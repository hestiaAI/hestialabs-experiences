<template>
  <v-container>
    <v-row class="justify-center">
      <p>
        Select data depending on the currency
        <v-select
          v-model="currentCurrency"
          :items="currencies"
          @input="filterCurrency"
        ></v-select>
      </p>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="12" md="8">
            <div id="scatter-chart">
              <strong>Price vs Distance</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span></span>
              </p>
            </div>
            <div id="hour-chart">
              <p
                class="muted pull-right text-subtitle-2"
                style="margin-right: 15px; margin-bottom: 5px"
              >
                select a time range to zoom in
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="4">
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
        </v-row>
        <v-row>
          <v-col cols="12" md="4">
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
          <v-col cols="12" md="4">
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
          <v-col cols="12" md="4">
            <div id="city-chart">
              <strong>Begin trip cities</strong>
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
      <v-col cols="12" md="4">
        <v-card class="general-info">
          <v-card-title>General information</v-card-title>
          <v-card-subtitle></v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-card color="#385F73" dark>
                    <v-card-title class="text-h6">Orders</v-card-title>
                    <v-card-subtitle></v-card-subtitle>
                    <v-card-text class="text-h5 text-center">
                      <div id="number-trip" />
                      <span class="text-subtitle-1">trips</span>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6">
                  <v-card color="#385F73" dark>
                    <v-card-title class="text-h6">Speed</v-card-title>
                    <v-card-subtitle></v-card-subtitle>
                    <v-card-text class="text-h5 text-center">
                      <div id="number-speed-avg" />
                      <span class="text-subtitle-1">mph</span>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Total</th>
                  <th class="text-left">Average</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  <td>
                    <span id="number-price-total" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">{{ currentCurrency }}</span>
                  </td>
                  <td>
                    <span id="number-price-avg" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">{{ currentCurrency }}</span>
                  </td>
                </tr>
                <tr>
                  <td>Distance</td>
                  <td>
                    <span id="number-distance-total" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">miles</span>
                  </td>
                  <td>
                    <span id="number-distance-avg" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">miles</span>
                  </td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>
                    <span id="number-duration-total" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">min</span>
                  </td>
                  <td>
                    <span id="number-duration-avg" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">min</span>
                  </td>
                </tr>
                <tr>
                  <td>Waiting time</td>
                  <td>
                    <span id="number-waiting-total" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">min</span>
                  </td>
                  <td>
                    <span id="number-waiting-avg" class="text-h6"></span>
                    <br />
                    <span class="text-subtitle-2">min</span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
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
      <v-col cols="12">
        <UnitFilterableTable :data="{ headers: header, items: results }" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
// import regression from 'regression'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'UberOverview',
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
        { text: 'Service', value: 'service' },
        { text: 'Status', value: 'Trip or Order Status' },
        { text: 'Request Time', value: 'dateRequestStr' },
        { text: 'From', value: 'Begin Trip Address' },
        { text: 'To', value: 'Dropoff Address' },
        { text: 'Waiting time (min)', value: 'waiting_time' },
        { text: 'Distance (miles)', value: 'Distance (miles)' },
        { text: 'Duration (min)', value: 'duration' },
        { text: 'Price', value: 'priceStr' }
      ],
      results: [],
      currencies: [],
      currentCurrency: null,
      currencyDimension: null
    }
  },
  watch: {
    values(oldValues) {
      this.drawViz()
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    filterCurrency(newCurr) {
      this.currencyDimension.filter(newCurr)
      this.currentCurrency = newCurr
      this.resetAll()
    },
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    drawViz() {
      // Add data to table
      this.results = this.values.filter(
        d =>
          d['Trip or Order Status'] === 'COMPLETED' &&
          d['Product Type'] !== 'UberEATS Marketplace'
      )

      // Define color palette for the graphs
      const colorPalette = [
        '#254b7f',
        '#1c6488',
        '#287a8c',
        '#40908e',
        '#59a590',
        '#7dba91'
      ]

      // Parse and format data
      const dateFormatParser = d3.timeParse('%Y-%m-%d %H:%M:%S %Z UTC')
      const formatTime = d3.timeFormat('%B %d, %Y at %H:%M:%S')
      this.results.forEach(d => {
        d.service =
          d['Product Type'].charAt(0).toUpperCase() + d['Product Type'].slice(1)
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
        const addr = d['Begin Trip Address'].split(',')
        d.city = addr[addr.length - 2].split(' ').pop()
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
        return `${name[day]}`
      })
      const serviceDimension = ndx.dimension(d => d.service)
      const cityDimension = ndx.dimension(d => d.city)
      const dayDimension = ndx.dimension(d => d.day)
      const scatterDimension = ndx.dimension(d => [d.distance, d.price])
      const hourDimension = ndx.dimension(d => d.hour)
      this.currencyDimension = ndx.dimension(d => d['Fare Currency'])

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
      const currencyGroup = this.currencyDimension.group()

      this.currentCurrency = currencyGroup.top(1)[0].key
      this.currencyDimension.filter(this.currentCurrency)
      currencyGroup.top(Infinity).forEach(d => {
        this.currencies.push(d.key)
      })

      // Render general Information numbers
      tripNumber
        .group(allGroup)
        .valueAccessor(p => p.count)
        .formatNumber(d3.format('~s'))
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
        .formatNumber(d3.format('.3s'))
      distanceAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.count ? p.distanceTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))
      distanceTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.distanceTotal)
        .formatNumber(d3.format('.3s'))
      durationTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.durationTotal)
        .formatNumber(d3.format('.3s'))
      durationAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.durationTotal ? p.durationTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))
      waitingTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.waitingTotal)
        .formatNumber(d3.format('.3s'))
      waitingAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.count ? p.waitingTotal / p.count : 0))
        .formatNumber(d3.format('.1f'))

      // Render scatter chart
      scatterChart
        .width(d3.select('#scatter-chart').node().getBoundingClientRect().width)
        .height(200)
        .margins({ top: 10, right: 10, bottom: 40, left: 40 })
        .x(d3.scaleLinear())
        .brushOn(false)
        .elasticY(true)
        .elasticX(true)
        .ordinalColors(colorPalette)
        .symbolSize(8)
        .clipPadding(10)
        .xAxisLabel('Distance (miles)')
        .yAxisLabel('Price')
        .dimension(scatterDimension)
        .group(scatterGroup)

      /* Add a regression line
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
          .attr('stroke', 'black')
          .attr('stroke-width', 1.5)
          .attr('stroke-opacity', 0.5)
          .attr('stroke-dasharray', '8,8')
          .text('test')

        line
          .transition()
          .duration(scatterChart.transitionDuration())
          .call(doPoints)
      })
      */

      // Render hour bar chart
      hourChart
        .width(d3.select('#hour-chart').node().getBoundingClientRect().width)
        .height(40)
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

      // Render days of week row chart
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
      weekChart
        .width(d3.select('#week-chart').node().getBoundingClientRect().width)
        .height(275)
        .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(dayOfWeekGroup))
        .dimension(dayOfWeekDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .data(group => group.top(10))
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
      const minDate =
        dayDimension.bottom(1).length > 0 ? dayDimension.bottom(1)[0].day : null
      const maxDate =
        dayDimension.top(1).length > 0 ? dayDimension.top(1)[0].day : null
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
      priceChart.xAxis().ticks(4)
      priceChart.filterAll()

      // Render city row chart
      cityChart
        .width(d3.select('#city-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(cityGroup))
        .dimension(cityDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .data(group => group.top(10))
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

#hour-chart g.y {
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
