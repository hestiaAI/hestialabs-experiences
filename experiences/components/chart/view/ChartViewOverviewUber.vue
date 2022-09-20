<template>
  <VContainer>
    <VRow class="justify-center">
      <p>
        <span v-text="messages['select-currency']" />
        <VSelect
          v-model="currentCurrency"
          :items="currencies"
          @input="filterCurrency"
        />
      </p>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12" md="8">
        <VRow>
          <VCol cols="12" md="12">
            <div id="price-chart">
              <span class="font-weight-bold" v-text="messages['Cumulative expenses']" />
              <a v-t="'reset'" class="reset" style="display: none" />
              <p class="filters">
                <span>
                  <span v-t="'Current filter'" />
                  <span class="filter" />
                </span>
              </p>
            </div>
            <div id="hour-chart">
              <ChartViewTextSelectTimeRange>
                <a v-t="'reset'" class="reset" style="display: none" />
              </ChartViewTextSelectTimeRange>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="4">
            <div id="service-chart">
              <span class="font-weight-bold" v-text="messages['Service used']" />
              <a v-t="'reset'" class="reset" style="display: none" />
              <p class="filters">
                <span>
                  <span v-t="'Current filter'" />
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div id="week-chart">
              <span class="font-weight-bold" v-text="messages['Day of week']" />
              <a v-t="'reset'" class="reset" style="display: none" />
              <p class="filters">
                <span>
                  <span v-t="'Current filter'" />
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div id="address-chart">
              <span class="font-weight-bold" v-text="messages['Begin trip address']" />
              <a v-t="'reset'" class="reset" style="display: none" />
              <p class="filters">
                <span>
                  <span v-t="'Current filter'" />
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="4">
        <VCard class="general-info">
          <VCardTitle>{{ messages['General information'] }}</VCardTitle>
          <VCardSubtitle />
          <VCardText>
            <VContainer>
              <VRow dense>
                <VCol cols="12" md="6">
                  <VCard color="#385F73" dark>
                    <VCardTitle class="justify-center text-caption">
                      {{ messages['Orders'] }}
                    </VCardTitle>
                    <VCardSubtitle />
                    <VCardText class="text-h4 text-center">
                      <div id="number-trip" />
                      <span class="text-subtitle-1" v-text="messages['trips']" />
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol cols="12" md="6">
                  <VCard color="#385F73" dark>
                    <VCardTitle class="justify-center text-caption">
                      {{ messages['Speed'] }}
                    </VCardTitle>
                    <VCardSubtitle />
                    <VCardText class="text-h4 text-center">
                      <div id="number-speed-avg" class="font-weight-bold" />
                      <span class="text-subtitle-1" v-text="messages['mph']" />
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VContainer>
            <VSimpleTable dense>
              <template #default>
                <thead>
                  <tr>
                    <th class="text-left" />
                    <th class="text-left" v-text="messages['Total']" />
                    <th class="text-left" v-text="messages['Average']" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="font-weight-bold" v-text="messages['Price']" />
                    <td class="text-h6" v-text="priceTotalNumber" />
                    <td class="text-h6" v-text="priceAvgNumber" />
                  </tr>
                  <tr
                    v-for="{ heading, ids, metric } in generalInformationRows"
                    :key="heading"
                  >
                    <td v-text="messages[heading]" />
                    <td v-for="id in ids" :key="id">
                      <span :id="id" class="text-h6" /> <span v-text="messages[metric]" />
                    </td>
                  </tr>
                </tbody>
              </template>
            </VSimpleTable>
          </VCardText>
          <VCardActions>
            <BaseButton elevation="2" block @click="resetAll()">
              {{ messages['Reset all filters'] }}
            </BaseButton>
          </VCardActions>
        </VCard>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: header, items: results }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
import { findNumberFormatIETFCode } from '@/i18n/vue-i18n-number-formats'
// import regression from 'regression'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  data() {
    return {
      header: [
        ['City', 'city'],
        ['Service', 'service'],
        ['Status', 'tripOrOrderStatus'],
        ['Request Time', 'dateRequestStr'],
        ['From', 'beginTripAddress'],
        ['To', 'dropoffAddress'],
        ['Waiting time (min)', 'waitingTime'],
        ['Distance (miles)', 'distanceMiles'],
        ['Duration (min)', 'duration'],
        ['Price', 'priceStr']
      ].map(([text, value]) => ({ text, value })),
      generalInformationRows: [{
        heading: 'Distance',
        metric: 'miles',
        ids: ['number-distance-total', 'number-distance-avg']
      },
      {
        heading: 'Duration',
        metric: 'min',
        ids: ['number-duration-total', 'number-duration-avg']
      },
      {
        heading: 'Waiting time',
        metric: 'min',
        ids: ['number-waiting-total', 'number-waiting-avg']
      }],
      results: [],
      currencies: [],
      currentCurrency: null,
      currencyDimension: null,
      priceAvgNumber: null,
      priceTotalNumber: null
    }
  },
  methods: {
    k(key, prefix = '') {
      return `chart-view.overview-uber.${prefix ? `${prefix}.` : ''}${key}`
    },
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
        d => d.tripOrOrderStatus === 'COMPLETED'
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
      const formatTime = d3.timeFormat(`%B %d, %Y ${this.$t('at')} %H:%M:%S`)
      this.results.forEach((d) => {
        d.service =
          d.productType.charAt(0).toUpperCase() + d.productType.slice(1)
        d.dateRequest = dateFormatParser(d.requestTime)
        d.dateStart = dateFormatParser(d.beginTripTime)
        d.dateEnd = dateFormatParser(d.dropoffTime)
        d.dateRequestStr = formatTime(d.dateRequest)
        d.dateStartStr = formatTime(d.dateStart)
        d.dateEndStr = formatTime(d.dateEnd)
        d.day = d3.timeDay(d.dateStart) // pre-calculate days for better performance
        d.hour = d3.timeHour(d.dateStart).getHours()
        d.duration = d3.timeMinute.count(d.dateStart, d.dateEnd)
        d.waitingTime = d3.timeMinute.count(d.dateRequest, d.dateStart)
        // https://kazupon.github.io/vue-i18n/guide/number.html#number-localization
        d.priceStr = this.$n(Number(d.fareAmount), 'currency', findNumberFormatIETFCode(d.fareCurrency))
        d.price = +d.fareAmount
        d.distance = +d.distanceMiles
        d.address = d.beginTripAddress.replace(/[0-9]/g, '').split(',')[0]
      })

      // Create and bind charts to their respective divs
      const hourChart = new dc.BarChart('#hour-chart')
      const serviceChart = new dc.PieChart('#service-chart')
      const weekChart = new dc.RowChart('#week-chart')
      const priceChart = new dc.LineChart('#price-chart')
      const addressChart = new dc.RowChart('#address-chart')
      const tripNumber = new dc.NumberDisplay('#number-trip')
      const speedNumber = new dc.NumberDisplay('#number-speed-avg')
      const distanceTotalNumber = new dc.NumberDisplay('#number-distance-total')
      const distanceAvgNumber = new dc.NumberDisplay('#number-distance-avg')
      const durationTotalNumber = new dc.NumberDisplay('#number-duration-total')
      const durationAvgNumber = new dc.NumberDisplay('#number-duration-avg')
      const waitingTotalNumber = new dc.NumberDisplay('#number-waiting-total')
      const waitingAvgNumber = new dc.NumberDisplay('#number-waiting-avg')

      // Bind reset filters links
      d3.select('#hour-chart a.reset').on('click', function() {
        hourChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#service-chart a.reset').on('click', function() {
        serviceChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#week-chart a.reset').on('click', function() {
        weekChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#price-chart a.reset').on('click', function() {
        priceChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#address-chart a.reset').on('click', function() {
        addressChart.filterAll()
        dc.redrawAll()
      })
      const ndx = crossfilter(this.results)

      // Create dimensions
      const allDimension = ndx.groupAll()
      const dayOfWeekDimension = ndx.dimension((d) => {
        const day = d.dateStart.getDay()
        const name = this.$days()
        return `${name[day]}`
      })
      const serviceDimension = ndx.dimension(d => d.service)
      const addressDimension = ndx.dimension(d => d.address)
      const dayDimension = ndx.dimension(d => d.day)
      const hourDimension = ndx.dimension(d => d.hour)
      this.currencyDimension = ndx.dimension(d => d.fareCurrency)

      // Create groups
      const allGroup = allDimension.reduce(
        /* Add elem to dim */
        (p, v) => {
          ++p.count
          p.distanceTotal += v.distance
          p.waitingTotal += v.waitingTime
          p.priceTotal += v.price
          p.durationTotal += v.duration
          return p
        },
        /* Remove elem from dim */
        (p, v) => {
          --p.count
          p.distanceTotal -= v.distance
          p.waitingTotal -= v.waitingTime
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
      const addressGroup = addressDimension.group().reduceCount()
      const hourGroup = hourDimension.group().reduceCount()
      const currencyGroup = this.currencyDimension.group()

      this.currentCurrency = currencyGroup.top(1)[0].key
      this.currencyDimension.filter(this.currentCurrency)
      currencyGroup.top(Infinity).forEach(({ key }) => {
        const currencySymbol = this.$n(undefined, 'currency', findNumberFormatIETFCode(key)).replace(/\s*NaN\s*/, '')
        const text = currencySymbol ? `${key} (${currencySymbol})` : key
        this.currencies.push({
          value: key,
          text
        })
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
        .valueAccessor((p) => {
          return p.durationTotal ? (p.distanceTotal * 60) / p.durationTotal : 0
        })
        .formatNumber(d3.format('.1f'))

      const { priceTotal, count } = allGroup.value()
      const numberFormatIETF = findNumberFormatIETFCode(this.currentCurrency)
      this.priceAvgNumber = this.$n(
        count ? priceTotal / count : 0,
        { key: 'currency', locale: numberFormatIETF, maximumFractionDigits: 1 }
      )
      this.priceTotalNumber = this.$n(
        priceTotal,
        { key: 'currency', locale: numberFormatIETF, maximumSignificantDigits: 3 }
      )

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
              .filter(function(d) {
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
      weekChart.ordering(d => this.$days().indexOf(d.key))

      // Render service pie chart
      serviceChart
        .width(d3.select('#service-chart').node().getBoundingClientRect().width)
        .height(180)
        .radius(180 / 2)
        .innerRadius(0)
        .dimension(serviceDimension)
        .group(serviceGroup)
        .valueAccessor((d) => {
          return d.value
        })
        .title(d => d.key + ': ' + d.value + ' trips')
        .ordinalColors(colorPalette)
        .label((d) => {
          let label = d.key
          if (label.length > 8) { label = label.substring(0, 8) + '.. ' }
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
            return group.all().map(function(d) {
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
          fillOpaaddress: 0.8,
          strokeOpaaddress: 0.0
        })
        .clipPadding(10)
        .yAxisLabel(this.$t(this.k('Total price')))
        .brushOn(true)
        .ordinalColors(colorPalette)
      priceChart.xAxis().ticks(10)
      priceChart.yAxis().ticks(6)
      priceChart.filterAll()

      // Render address row chart
      addressChart
        .width(d3.select('#address-chart').node().getBoundingClientRect().width)
        .height(180)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(addressGroup))
        .dimension(addressDimension)
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
