<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="9">
        <div id="bubble-chart">
          <strong
            >Compute how much you spent depending on the time and distance of of
            of your trips</strong
          >
          <a class="reset" style="display: none">reset</a>
          <p class="filters">
            <span>
              Current filter:
              <span class="filter"></span>
            </span>
          </p>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <div class="general-info">
          <strong>General information</strong>
          <p>
            Number of trip:
            <span id="number-trip" class="number-trip"></span>
          </p>
          <p>
            Average price:
            <span id="number-price-avg" class="number-price-avg"></span>
          </p>
          <p>
            Total price:
            <span id="number-price-total" class="number-price-total"></span>
          </p>
          <p>
            Average distance:
            <span id="number-distance-avg" class="number-distance-avg"></span>
          </p>
        </div>
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
    drawViz() {
      // Add data to table
      this.results = this.values

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
        d.duration = d3.timeMinute.count(d.dateStart, d.dateEnd)
        d.waiting_time = d3.timeMinute.count(d.dateRequest, d.dateStart)
        d.priceStr = d['Fare Amount'] + d['Fare Currency']
        d.price = +d['Fare Amount']
        d.distance = +d['Distance (miles)']
      })

      // Create and bind charts to their respective divs
      // const bubbleChart = new dc.BubbleChart('#bubble-chart')
      const tripNumber = new dc.NumberDisplay('#number-trip')
      const priceAvgNumber = new dc.NumberDisplay('#number-price-avg')
      const priceTotalNumber = new dc.NumberDisplay('#number-price-total')
      const distanceAvgNumber = new dc.NumberDisplay('#number-distance-avg')
      // const serviceChart = new dc.PieChart('#service-chart')
      const weekChart = new dc.RowChart('#week-chart')
      // const priceChart = new dc.LineChart('#price-chart')
      // const cityChart = new dc.RowChart('#city-chart')

      // Bind reset filters links
      /*
      d3.select('#bubble-chart a.reset').on('click', function () {
        bubbleChart.filterAll()
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
      */
      const ndx = crossfilter(this.results)

      // Create dimensions
      const allDimension = ndx.groupAll()
      const dayOfWeekDimension = ndx.dimension(d => {
        const day = d.dateStart.getDay()
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${day}.${name[day]}`
      })
      // const dayDimension = ndx.dimension(d => d.day)
      // const priceDimension = ndx.dimension(d => d.price)
      // const distanceDimension = ndx.dimension(d => d.distance)
      // const durationDimension = ndx.dimension(d => d.duration)
      // const waitingDimension = ndx.dimension(d => d.waiting_time)

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
      const dayOfWeekGroup = dayOfWeekDimension.group()

      // Render general Information
      tripNumber.group(allGroup).valueAccessor(p => p.count)
      priceAvgNumber
        .group(allGroup)
        .valueAccessor(p => {
          return p.count ? p.priceTotal / p.count : 0
        })
        .formatNumber(d3.format('.3s'))
      priceTotalNumber
        .group(allGroup)
        .valueAccessor(p => p.priceTotal)
        .formatNumber(d3.format('.3g'))
      distanceAvgNumber
        .group(allGroup)
        .valueAccessor(p => (p.count ? p.distanceTotal / p.count : 0))
        .formatNumber(d3.format('.3g'))

      // Render days of week
      weekChart
        .width(180)
        .height(180)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDimension)
        .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        .label(d => d.key.split('.')[1])
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
