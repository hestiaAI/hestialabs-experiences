<template>
  <VContainer>
    <VRow class="justify-center">
      <p>
        Select data depending on the currency
        <VSelect
          v-model="currentCurrency"
          :items="currencies"
          @input="filterCurrency"
        ></VSelect>
      </p>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12" md="8">
        <VRow>
          <VCol cols="12" md="12">
            <div id="price-chart">
              <strong>Cumulative expenses</strong>
              <a class="reset" style="display: none">reset</a>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
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
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="4">
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
          </VCol>
          <VCol cols="12" md="4">
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
          </VCol>
          <VCol cols="12" md="4">
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
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="4">
        <VCard class="general-info">
          <VCardTitle>General information</VCardTitle>
          <VCardSubtitle></VCardSubtitle>
          <VCardText>
            <VContainer>
              <VRow dense>
                <VCol cols="12" md="6">
                  <VCard color="#385F73" dark>
                    <VCardTitle class="text-h6">Orders</VCardTitle>
                    <VCardSubtitle></VCardSubtitle>
                    <VCardText class="text-h4 text-center">
                      <div><strong id="number-trip"></strong></div>
                      <span class="text-subtitle-1">trips</span>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol cols="12" md="6">
                  <VCard color="#385F73" dark>
                    <VCardTitle class="text-h6">Speed</VCardTitle>
                    <VCardSubtitle></VCardSubtitle>
                    <VCardText class="text-h4 text-center">
                      <div><strong id="number-speed-avg" /></div>
                      <span class="text-subtitle-1">mph</span>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VContainer>
            <VSimpleTable>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Total</th>
                  <th class="text-left">Average</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Price</strong></td>
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
                  <td><strong>Distance</strong></td>
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
                  <td><strong>Duration</strong></td>
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
                  <td><strong>Waiting time</strong></td>
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
            </VSimpleTable>
          </VCardText>
          <VCardActions>
            <VBtn elevation="2" block @click="resetAll()">
              Reset all filters
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable :data="{ headers: header, items: results }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
// import regression from 'regression'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
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
        d => d['Trip or Order Status'] === 'COMPLETED'
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
        .height(180)
        .margins({ top: 10, left: 10, right: 10, bottom: 20 })
        .group(dayOfWeekGroup)
        .dimension(dayOfWeekDimension)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
      weekChart.ordering(function (d) {
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

      // Render service pie chart
      serviceChart
        .width(d3.select('#service-chart').node().getBoundingClientRect().width)
        .height(180)
        .radius(180 / 2)
        .innerRadius(0)
        .dimension(serviceDimension)
        .group(serviceGroup)
        .valueAccessor(d => {
          return d.value
        })
        .title(d => d.key + ': ' + d.value + ' trips')
        .ordinalColors(colorPalette)
        .label(d => {
          let label = d.key
          if (label.length > 8) label = label.substring(0, 8) + '.. '
          if (serviceChart.hasFilter() && !serviceChart.hasFilter(d.key)) {
            return `${label} (0%)`
          }
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
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(180)
        .brushOn(false)
        .renderArea(true)
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
      priceChart.xAxis().ticks(10)
      priceChart.yAxis().ticks(6)
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

::v-deep #hour-chart g.y {
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

::v-deep ul.list-inline {
  list-style: none;
  padding-left: 0;
}

::v-deep ul.list-inline > li {
  display: inline-block;
}

::v-deep li.border-right {
  border-right: 1px solid #90a4ae;
}

::v-deep .pl-2 {
  padding-left: 1.5rem;
}
::v-deep .pr-2 {
  padding-right: 1.5rem;
}

::v-deep .stat-info {
  font-style: italic;
  font-size: 0.8em;
}
::v-deep p.stat-title {
  margin: 0.5rem;
  padding: 0;
}

::v-deep .stat-elem {
  padding: 1rem;
}
</style>
