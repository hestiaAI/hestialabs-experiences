<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-row>
          <v-col cols="8"><p>Amount of information collected</p></v-col>
          <spacer />
          <v-col cols="4" class="text-right">
            <v-checkbox
              v-model="checkbox"
              dense
              :label="`Cumulative`"
              @change="changeAgg"
            ></v-checkbox>
          </v-col>
        </v-row>
        <div id="line-chart"></div>
        <div id="range-chart"></div>
      </v-col>
      <v-col cols="12" md="4">
        <p>Information Type</p>
        <div id="row-chart"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <v-radio-group
          v-model="timeRange"
          row
          mandatory
          @change="filterTimeRange"
        >
          <template #label>
            <div>Select a <strong>time range</strong></div>
          </template>
          <v-radio label="ALL" value="ALL"></v-radio>
          <v-radio label="1Y" value="1Y"></v-radio>
          <v-radio label="3M" value="3M"></v-radio>
          <v-radio label="1M" value="1M"></v-radio>
          <v-radio label="7D" value="7D"></v-radio>
          <v-radio label="1D" value="1D"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="3">
        <v-btn class="ma-2" outlined color="indigo" @click="resetAll()">
          Reset all filters
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab href="#overview" @click="resetSourceFilter">Overview</v-tab>
          <v-tab href="#details">Details</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="overview">
            <p class="text-subtitle-1">
              <strong>{{ title }}</strong> knows about
              <strong>{{ total }}</strong> things that happened between
              <strong>{{ currMinDateStr }}</strong> and
              <strong>{{ currMaxDateStr }}</strong>
              <v-btn class="ma-2" outlined color="indigo" @click="tabDetails()">
                See All
              </v-btn>
            </p>
            <v-list>
              <v-list-group
                v-for="item in items"
                :key="item.title"
                v-model="item.active"
                :prepend-icon="item.action"
                no-action
              >
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ item.count }}</strong>
                      were regarding your
                      <strong>{{ item.title }}</strong>
                      activity.
                    </v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="child in item.items" :key="child.title">
                  <v-list-item-content>
                    <v-list-item-title>
                      <strong>{{ child.count }}</strong>
                      records of
                      <strong>{{ child.title }}</strong>
                      .
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item key="child.showMore">
                  <v-btn
                    class="ma-1"
                    outlined
                    color="indigo"
                    @click="filterSource(item.title)"
                  >
                    See All {{ item.title }} activity
                  </v-btn>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-tab-item>
          <v-tab-item value="details">
            <p v-if="currSourceFilter" class="text-subtitle-1 text-right">
              Current Filter:
              <v-btn small elevation="2" @click="resetSourceFilter">
                <strong>{{ currSourceFilter }}</strong>
                <v-icon x-small> $vuetify.icons.mdiClose </v-icon>
              </v-btn>
            </p>
            <unit-filterable-table
              v-bind="{ headers: header, items: results }"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import UnitFilterableTable from '~/components/UnitFilterableTable'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  name: 'TimedObservationsViewer',
  components: { UnitFilterableTable },
  props: {
    title: {
      type: String,
      default: () => 'Google'
    },
    values: {
      type: Array,
      default: () => []
    },
    dateFormats: {
      type: Array,
      default: () => ['%Y-%m-%dT%H:%M:%S%Z', '%Y-%m-%dT%H:%M:%S.%L%Z']
    }
  },
  data() {
    return {
      total: null,
      timeRange: null,
      tab: null,
      lineChart: null,
      rangeChart: null,
      timeDimension: null,
      overviewDimension: null,
      minDate: null,
      maxDate: null,
      currMinDateStr: 'NaN',
      currMaxDateStr: 'NaN',
      currSourceFilter: null,
      checkbox: false,
      timelineGroup: null,
      formatTimeDay: null,
      formatTimeMonth: null,
      formatTimeHour: null,
      items: [],
      header: [
        { text: 'Date', value: 'dateStr' },
        { text: 'App', value: 'eventSource' },
        { text: 'Event type', value: 'eventType' },
        { text: 'Event value', value: 'eventValue' }
      ],
      results: []
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
    resetAll() {
      dc.filterAll()
      dc.redrawAll()
      this.resetSourceFilter()
    },
    // Change tab
    tabDetails() {
      this.tab = 'details'
    },
    // When no data available for a specific time period, show an empty message
    showEmptyMessage(chart) {
      const isEmpty =
        d3.sum(chart.group().all().map(chart.valueAccessor())) === 0
      const data = isEmpty ? [1] : []
      const empty = chart
        .svg()
        .selectAll('.empty-message')
        .data(data)
        .enter()
        .append('text')
        .text('No data during this time period')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('x', chart.margins().left + chart.effectiveWidth() / 2)
        .attr('y', chart.margins().top + chart.effectiveHeight() / 2)
        .attr('class', 'empty-message')
        .style('opacity', 0)
      if (!isEmpty) {
        chart.svg().selectAll('.empty-message').remove()
      } else {
        empty.transition().duration(1000).style('opacity', 1)
      }
    },
    // Make a Fake group to display only value above 0 on the row graphs
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
    createCumulativeGroup(sourceGroup) {
      return {
        all() {
          let cumulate = 0
          return sourceGroup.all().map(function (d) {
            cumulate += d.value

            return { key: d.key, value: cumulate }
          })
        }
      }
    },
    changeAgg() {
      if (this.checkbox)
        this.lineChart.group(this.createCumulativeGroup(this.timelineGroup))
      else this.lineChart.group(this.timelineGroup)
      dc.redrawAll()
    },
    // Main function to init component
    drawViz() {
      // Init table values
      this.results = this.values

      // Format dates
      const dateFormatParsers = this.dateFormats.map(d => d3.timeParse(d))
      this.formatTimeDay = d3.timeFormat('%Y-%m-%d')
      this.formatTimeMonth = d3.timeFormat('%B %Y')
      this.formatTimeHour = d3.timeFormat('%H:%M:%S')
      const formatTimeS = d3.timeFormat('%d %B %Y')
      this.results.forEach(d => {
        d.dateSrc = d.date
        dateFormatParsers.some(parser => {
          d.date = parser(d.dateSrc)
          return d.date != null
        })
        d.dateStr = this.formatTimeDay(d.date)
        d.month = d3.timeMonth(d.date) // pre-calculate months for better performance
        d.day = d3.timeDay(d.date) // pre-calculate days for better performance
        d.hour = d3.timeHour(d.date) // pre-calculate hours for better performance
      })
      // Build index for crossfiltering
      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Compute groupby Count for overview
      const overviewDimension = ndx.dimension(d => [
        d.eventSource,
        d.eventType,
        d.icon
      ])
      const overviewGroup = overviewDimension.group().reduceCount()
      this.filterItems(overviewGroup)
      this.total = all.value()

      // Dimension to filter by source
      this.activityDimension = ndx.dimension(d => d.eventSource)

      // Update items on each change of crossfilter
      ndx.onChange(() => {
        this.filterItems(overviewGroup)
        this.total = all.value()
        this.results = ndx.allFiltered()
        this.currMinDateStr = formatTimeS(this.minDate)
        this.currMaxDateStr = formatTimeS(this.maxDate)
      })

      // Compute and draw line chart
      this.lineChart = new dc.LineChart('#line-chart')
      this.rangeChart = new dc.BarChart('#range-chart')
      this.timeDimension = ndx.dimension(d => d.date)
      this.timelineGroup = this.timeDimension
        .group(d => d3.timeMonth(d))
        .reduceCount()
      this.maxDate = this.timeDimension.top(1)[0].month
      this.currMaxDateStr = formatTimeS(this.maxDate)
      this.minDate = this.timeDimension.bottom(1)[0].month
      this.currMinDateStr = formatTimeS(this.minDate)
      const height = 240
      this.lineChart
        .renderArea(true)
        .width(d3.select('#line-chart').node().getBoundingClientRect().width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 20, right: 20, bottom: 20, left: 50 })
        .group(this.timelineGroup)
        .dimension(this.timeDimension)
        .curve(d3.curveMonotoneX)
        .x(d3.scaleTime().domain([this.minDate, this.maxDate]))
        .y(d3.scaleLinear())
        .ordinalColors(['#58539E'])
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .xyTipsOn(true)
        .mouseZoomable(false)
        .rangeChart(this.rangeChart)
        .renderHorizontalGridLines(false)
        .clipPadding(10)
        .title(d => this.formatTimeMonth(+d.key) + ': ' + d.value)
        .yAxisLabel('')
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0.0
        })
        .xAxis()
        .ticks(5)

      this.rangeChart.on('filtered', () => {
        const filters = this.timeDimension.currentFilter()
        if (filters) {
          this.currMinDateStr = formatTimeS(filters[0])
          this.currMaxDateStr = formatTimeS(filters[1])
        } else {
          this.currMinDateStr = formatTimeS(this.minDate)
          this.currMaxDateStr = formatTimeS(this.maxDate)
        }
      })

      // Compute and draw range chart
      this.rangeChart
        .width(d3.select('#range-chart').node().getBoundingClientRect().width)
        .height(40)
        .margins({ top: 0, right: 20, bottom: 20, left: 50 })
        .dimension(this.timeDimension)
        .group(this.timelineGroup)
        .centerBar(true)
        .brushOn(false)
        .gap(1)
        .x(
          d3
            .scaleTime()
            .domain([this.minDate, d3.timeDay.offset(this.maxDate, 1)])
        )
        // .round(d3.timeDay.round)
        // .alwaysUseRounding(true)
        // .xUnits(d3.timeDays)
        .ordinalColors(['#58539E'])
        .yAxis()
        .ticks(0)

      // Compute and draw row chart
      const rowChart = new dc.RowChart('#row-chart')
      const typeDimension = ndx.dimension(d => d.eventType)
      const typeGroup = typeDimension.group().reduceCount()
      const width = d3.select('#row-chart').node().getBoundingClientRect().width
      rowChart
        .width(width)
        .height(height + 55)
        .margins({ top: 20, left: 10, right: 30, bottom: 20 })
        .group(this.removeEmptyBins(typeGroup))
        .dimension(typeDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(10))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      rowChart.on('pretransition', this.showEmptyMessage)
      // Render all graphs
      dc.renderAll()
    },
    filterTimeRange(newValue) {
      if (this.rangeChart === null) return

      this.rangeChart.filter(null)
      let minDate = null
      const maxDate = d3.timeDay.offset(this.maxDate, 1)
      let dateFormat = null
      switch (newValue) {
        case 'ALL':
          this.timelineGroup = this.timeDimension.group(d => d3.timeMonth(d))
          dateFormat = this.formatTimeMonth
          break
        case '1Y':
          minDate = d3.max([d3.timeYear.offset(this.maxDate, -1), this.minDate])
          this.timelineGroup = this.timeDimension.group(d => d3.timeMonth(d))
          dateFormat = this.formatTimeMonth
          break
        case '3M':
          minDate = d3.max([
            d3.timeMonth.offset(this.maxDate, -3),
            this.minDate
          ])
          this.timelineGroup = this.timeDimension.group(d => d3.timeDay(d))
          dateFormat = this.formatTimeDay
          break
        case '1M':
          minDate = d3.max([
            d3.timeMonth.offset(this.maxDate, -1),
            this.minDate
          ])
          this.timelineGroup = this.timeDimension.group(d => d3.timeDay(d))
          dateFormat = this.formatTimeDay
          break
        case '7D':
          minDate = d3.max([d3.timeDay.offset(this.maxDate, -7), this.minDate])
          this.timelineGroup = this.timeDimension.group(d => d3.timeDay(d))
          dateFormat = this.formatTimeDay
          break
        case '1D':
          minDate = d3.max([d3.timeDay.offset(this.maxDate, -1), this.minDate])
          this.timelineGroup = this.timeDimension.group(d => d3.timeHour(d))
          dateFormat = this.formatTimeHour
          break
      }
      if (minDate !== null)
        this.rangeChart.filter(dc.filters.RangedFilter(minDate, maxDate))

      this.lineChart
        .dimension(this.timeDimension)
        .group(this.timelineGroup)
        .title(d => dateFormat(+d.key) + ': ' + d.value)
        .transitionDuration(1000)
        .render()
      dc.redrawAll()

      /*
      this.lineChart
        .dimension()
        .group(postsGroup)
        .transitionDuration(1000)
        .render()
      */
    },
    filterItems(overviewGroup) {
      const counts = overviewGroup.top(Infinity).reduce((p, c) => {
        if (!Object.prototype.hasOwnProperty.call(p, c.key[0])) {
          p[c.key[0]] = {}
          p[c.key[0]].count = 0
          p[c.key[0]].title = c.key[0]
          p[c.key[0]].action = c.key[2]
          p[c.key[0]].items = []
        }
        p[c.key[0]].count += c.value
        if (c.value > 0)
          p[c.key[0]].items.push({ title: c.key[1], count: c.value })
        return p
      }, {})
      this.items = Object.values(counts).filter(d => d.count > 0)
    },
    filterSource(title) {
      this.currSourceFilter = title
      this.activityDimension.filter(title)
      dc.redrawAll()
      this.tabDetails()
    },
    resetSourceFilter() {
      this.currSourceFilter = null
      this.activityDimension.filter(null)
      dc.redrawAll()
    }
  }
}
</script>
<style>
#range-chart g.y {
  display: none;
}
.brush .custom-brush-handle {
  display: auto;
}
</style>
