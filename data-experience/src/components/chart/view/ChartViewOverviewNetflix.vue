<template>
  <VContainer>
    <ChartViewVRowWebShare dense>
      <VCol cols="8">
        <VRow dense>
          <VCol cols="12">
            <div :id="'watch-time-chart' + graphId">
              <strong>{{ $t(k('watch-time')) }}</strong>
              <a class="reset" style="display: none">{{ $t('reset') }}</a>
              <p class="filters ma-0">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
              </p>
            </div>
            <div :id="'range-chart' + graphId" class="range-chart">
              <p
                class="muted pull-right text-subtitle-2"
                style="margin-right: 15px; margin-bottom: 5px"
              >
                {{ $t('select-time-range') }}
              </p>
            </div>
          </VCol>
        </VRow>
        <VRow dense>
          <VCol cols="8">
            <div :id="'hour-chart' + graphId">
              <strong>{{ $t(k('time-of-day')) }}</strong>
              <a class="reset" style="display: none">{{ $t('reset') }}</a>
              <p class="filters ma-0">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
          <VCol cols="4">
            <div :id="'week-chart' + graphId">
              <strong>{{ $t(k('day')) }}</strong>
              <a class="reset" style="display: none">{{ $t('reset') }}</a>
              <p class="filters ma-0">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="4">
        <div :id="'content-chart' + graphId">
          <strong>{{ $t(k('most-watched')) }}</strong>
          <a class="reset" style="display: none">{{ $t('reset') }}</a>
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
    </ChartViewVRowWebShare>
    <ChartViewVRowWebShare dense>
      <VCol cols="4">
        <div :id="'user-chart' + graphId">
          <strong>Profiles</strong>
          <a class="reset" style="display: none">{{ $t('reset') }}</a>
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
      <VCol cols="4">
        <div :id="'country-chart' + graphId">
          <strong>{{ $t(k('country')) }}</strong>
          <a class="reset" style="display: none">{{ $t('reset') }}</a>
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
      <VCol cols="4">
        <div :id="'device-chart' + graphId">
          <strong>{{ $t(k('device')) }}</strong>
          <a class="reset" style="display: none">{{ $t('reset') }}</a>
          <p class="filters ma-0">
            <span>
              {{ $t('Current filter') }}
              <span class="filter" />
            </span>
          </p>
        </div>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <div :id="'dc-data-count' + graphId" class="dc-data-count" />
    </VRow>
    <UnitFilterableTable v-bind="{ headers: header, items: results }" />
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
        { text: 'Date', value: 'startTime' },
        { text: 'Duration', value: 'duration' },
        { text: 'Content', value: 'title' },
        { text: 'User', value: 'profileName' },
        { text: 'Country', value: 'country' }
      ],
      results: []
    }
  },
  methods: {
    k(localKey) {
      return `chart-view.overview-netflix.${localKey}`
    },
    removeEmptyBins(group) {
      return {
        top(n) {
          return group
            .top(Infinity)
            .filter(function(d) {
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
        '#7570b3',
        // '#371D52',
        // '#35334A',
        '#6652A1',
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
      const formatNumber = d3.format('.1f')

      // Keeps only movies and tv shows (not trailer etc..)
      this.results = this.values.filter(
        d => d.supplementalVideoType === ''
      )
      this.results.forEach((d) => {
        const time = d.duration.split(':')
        d.date = dateFormatParser(d.startTime)
        d.month = d3.timeMonth(d.date) // pre-calculate months for better performance
        d.dateStr = formatTime(d.day)
        d.hour = d3.timeHour(d.date).getHours()
        const title = d.title.split(':')
        d.content = title[0].includes('HIDDEN TITLE') ? title[1] : title[0]
        d.device = d.deviceType === '' ? 'Unknown' : d.deviceType
        d.durationHour = +time[0] + +time[1] / 60 + +time[2] / 60 / 60
        d.user = d.profileName
      })
      // Create crossfilter indexing
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Create and bind charts to their respective divs
      const watchChart = new dc.LineChart('#watch-time-chart' + this.graphId)
      const rangeChart = new dc.BarChart('#range-chart' + this.graphId)
      const userChart = new dc.PieChart('#user-chart' + this.graphId)
      const countryChart = new dc.RowChart('#country-chart' + this.graphId)
      const contentChart = new dc.RowChart('#content-chart' + this.graphId)
      const weekChart = new dc.RowChart('#week-chart' + this.graphId)
      const deviceChart = new dc.RowChart('#device-chart' + this.graphId)
      const hourChart = new dc.BarChart('#hour-chart' + this.graphId)
      const tableCount = new dc.DataCount('#dc-data-count' + this.graphId)

      // Bind reset filters links
      d3.select('#watch-time-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          rangeChart.filterAll()
          watchChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#user-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          userChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#country-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          countryChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#content-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          contentChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#week-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          weekChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#device-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          deviceChart.filterAll()
          dc.redrawAll()
        }
      )
      d3.select('#hour-chart' + this.graphId + ' a.reset').on(
        'click',
        function() {
          hourChart.filterAll()
          dc.redrawAll()
        }
      )

      // Create dimensions
      const monthDimension = ndx.dimension(d => d.month)
      // const typeDimension = ndx.dimension(d => d.type)
      const userDimension = ndx.dimension(d => d.user)
      const deviceDimension = ndx.dimension(d => d.device)
      const contentDimension = ndx.dimension(d => d.content)
      const countryDimension = ndx.dimension(d => d.country)
      const hourDimension = ndx.dimension(d => d.hour)
      const weekDimension = ndx.dimension((d) => {
        const day = d.date.getDay()
        const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        return `${name[day]}`
      })

      // Create groups from dimension
      const monthGroup = monthDimension.group().reduceSum(d => d.durationHour)
      // const typeGroup = typeDimension.group().reduceSum(d => d.duration)
      const userGroup = userDimension.group().reduceSum(d => d.durationHour)
      const deviceGroup = deviceDimension.group().reduceSum(d => d.durationHour)
      const contentGroup = contentDimension.group().reduceSum(d => d.durationHour)
      const countryGroup = countryDimension.group().reduceSum(d => d.durationHour)
      const hourGroup = hourDimension.group().reduceSum(d => d.durationHour)
      const weekGroup = weekDimension.group().reduceSum(d => d.durationHour)

      // Render watch time line chart
      const minDate = monthDimension.bottom(1)[0].date
      const maxDate = monthDimension.top(1)[0].date
      const maxValue = monthGroup.top(1)[0].value + 2
      let width = d3
        .select('#watch-time-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
      let height = 150

      watchChart
        .renderArea(true)
        .width(width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 20, right: 50, bottom: 25, left: 40 })
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
        .ordinalColors([colorPalette[1]])
        .valueAccessor(d => d.value)
        .title(
          d =>
            formatTime(d.key) + ': ' + formatNumber(d.value) + ' hours watched'
        )
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
        .yAxisLabel('Hours watched')
        .clipPadding(10)
        // .xAxisLabel("Date")
        .yAxis()
        .ticks(5)
      watchChart.xAxis().ticks(5)

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
        .valueAccessor(d => d.value)
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(colorPalette)
        .yAxis()
        .ticks(0)

      // Render user pie chart
      width = d3
        .select('#user-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
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
        .valueAccessor(d => d.value)
        .title(d => d.key + ': ' + formatNumber(d.value) + ' hours watched')
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .ordinalColors(colorPalette)

      userChart.on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice.pie-label').call(function(t) {
          t.each(function(d) {
            const self = d3.select(this)
            let text = self.text()
            if (text.length > 14) { text = text.substring(0, 14) + '.. ' }
            if (text.length > 0) {
              text =
                text +
                ' (' +
                dc.utils.printSingleValue(
                  ((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100
                ) +
                '%)'
            }
            self.text(text)
          })
        })
      })

      // Render country row chart
      width = d3
        .select('#country-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
      height = 200
      countryChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(countryGroup)
        .dimension(countryDimension)
        .ordinalColors(colorPalette)
        .valueAccessor(d => d.value)
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.key + ': ' + formatNumber(d.value) + ' hours watched')
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render day of week row chart
      width = d3
        .select('#week-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
      height = 150
      weekChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(weekGroup)
        .dimension(weekDimension)
        .valueAccessor(d => d.value)
        .ordinalColors(colorPalette)
        .label(d => d.key)
        .title(d => formatNumber(d.value) + ' hours watched')
        .elasticX(true)
        .xAxis()
        .ticks(4)
      weekChart.ordering(function(d) {
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
        .width(
          d3
            .select('#hour-chart' + this.graphId)
            .node()
            .getBoundingClientRect().width
        )
        .height(150)
        .margins({ top: 20, right: 10, bottom: 20, left: 40 })
        .dimension(hourDimension)
        .group(hourGroup)
        .valueAccessor(d => d.value)
        .centerBar(false)
        .gap(1)
        .x(d3.scaleLinear().domain([0, 24]))
        .ordinalColors(colorPalette)
        .yAxisLabel('Hours watched')
        .yAxis()
        .ticks(5)
      hourChart
        .xAxis()
        .tickFormat(d => d + ':00')
        .ticks(7)

      // Render content row chart
      width = d3
        .select('#content-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
      height = 420
      contentChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(contentGroup)
        .dimension(contentDimension)
        .ordinalColors([colorPalette[0]])
        .valueAccessor(d => d.value)
        .title(d => d.key + ': ' + formatNumber(d.value) + ' hours watched')
        .label(d => d.key)
        .data(group => group.top(20))
        // .labelOffsetX(0)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render device row chart
      width = d3
        .select('#device-chart' + this.graphId)
        .node()
        .getBoundingClientRect().width
      height = 200
      deviceChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(this.removeEmptyBins(deviceGroup))
        .dimension(deviceDimension)
        .ordinalColors([colorPalette[2]])
        .valueAccessor(d => d.value)
        .title(
          d =>
            formatTime(d.key) + ': ' + formatNumber(d.value) + ' hours watched'
        )
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.key + ': ' + formatNumber(d.value) + ' hours watched')
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render counter and table
      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some:
            `<strong>%filter-count</strong> ${this.$t('selected-out-of')} <strong>%total-count</strong> ` +
            `${this.$t(this.k('views'))} | <a class='resetAll'>${this.$t('Reset All')}</a>`,
          all:
            `Total: <strong>%total-count</strong> ${this.$t(this.k('views'))}. ${this.$t('click-graph')}`
        })
        .on('pretransition', () => {
          this.results = monthDimension.top(all.value())
          d3.select('#dc-data-count' + this.graphId + ' a.resetAll').on(
            'click',
            () => {
              dc.filterAll()
              dc.renderAll()
            }
          )
        })
      dc.renderAll()
    }
  }
}
</script>
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
</style>