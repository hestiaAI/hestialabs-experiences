<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <p>Number of information collected</p>
        <div id="line-chart"></div>
      </v-col>
      <v-col cols="12" md="4">
        <p>Information Type</p>
        <div id="row-chart"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-radio-group
          v-model="timeRange"
          row
          mandatory
          @change="timeRangeChange"
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
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab href="#overview">Overview</v-tab>
          <v-tab href="#details">Details</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item value="overview">
            <p class="text-subtitle-1">
              <strong>{{ title }}</strong> knows about
              <strong>{{ total }}</strong> things that happened during this time
              period.
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
              </v-list-group>
            </v-list>
          </v-tab-item>
          <v-tab-item value="details">
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
  name: 'GenericDateViewer',
  components: { UnitFilterableTable },
  props: {
    values: {
      type: Array,
      default: () => []
    },
    dateFormat: {
      type: String,
      default: () => '%Y-%m-%dT%H:%M:%S.%L%Z'
    }
  },
  data() {
    return {
      title: 'Google My Activity',
      total: null,
      timeRange: null,
      tab: null,
      lineChart: null,
      volumeDimension: null,
      startDate: new Date(),
      endDate: new Date(),
      items: [],
      header: [
        { text: 'Date', value: 'dateStr' },
        { text: 'App', value: 'event_source' },
        { text: 'Event type', value: 'event_type' },
        { text: 'Event value', value: 'event_value' }
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
    timeRangeChange(newValue) {
      switch (newValue) {
        case 'ALL':
          if (this.lineChart !== null) this.lineChart.brushOn(false)
          break
        case '1Y':
          this.lineChart.brushOn(true)
          this.lineChart.extendBrush = function (brushSelection) {
            brushSelection[1] = d3.timeYear.offset(brushSelection[0], 1)
            return brushSelection
          }
          this.lineChart.filter(null)
          this.lineChart.filter(
            dc.filters.RangedFilter(
              d3.max([d3.timeYear.offset(this.startDate, -1), this.endDate]),
              this.startDate
            )
          )
          break
        case '3M':
          this.lineChart.brushOn(true)
          this.lineChart.extendBrush = function (brushSelection) {
            brushSelection[1] = d3.timeMonth.offset(brushSelection[0], 3)
            return brushSelection
          }
          this.lineChart.filter(null)
          this.lineChart.filter(
            dc.filters.RangedFilter(
              d3.max([d3.timeMonth.offset(this.startDate, -3), this.endDate]),
              this.startDate
            )
          )
          break
        case '1M':
          this.lineChart.brushOn(true)
          this.lineChart.extendBrush = function (brushSelection) {
            brushSelection[1] = d3.timeMonth.offset(brushSelection[0], 1)
            return brushSelection
          }
          this.lineChart.filter(null)
          this.lineChart.filter(
            dc.filters.RangedFilter(
              d3.max([d3.timeMonth.offset(this.startDate, -1), this.endDate]),
              this.startDate
            )
          )
          break
        case '7D':
          this.lineChart.brushOn(true)
          this.lineChart.extendBrush = function (brushSelection) {
            brushSelection[1] = d3.timeDay.offset(brushSelection[0], 7)
            return brushSelection
          }
          this.lineChart.filter(null)
          this.lineChart.filter(
            dc.filters.RangedFilter(
              d3.max([d3.timeDay.offset(this.startDate, -7), this.endDate]),
              this.startDate
            )
          )
          break
        case '1D':
          this.lineChart.brushOn(true)
          this.lineChart.extendBrush = function (brushSelection) {
            brushSelection[1] = d3.timeDay.offset(brushSelection[0], 1)
            return brushSelection
          }
          this.lineChart.filter(null)
          this.lineChart.filter(
            dc.filters.RangedFilter(
              d3.max([d3.timeDay.offset(this.startDate, -1), this.endDate]),
              this.startDate
            )
          )
          break
      }
      dc.renderAll()
    },
    tabDetails() {
      this.tab = 'details'
    },
    drawViz() {
      this.results = this.values

      // Format dates
      const dateFormatParser = d3.timeParse(this.dateFormat)
      const formatTime = d3.timeFormat('%Y-%m-%d')
      this.results.forEach(d => {
        d.date = dateFormatParser(d.date)
        d.dateStr = formatTime(d.date)
        d.day = d3.timeDay(d.date) // pre-calculate days for better performance
        d.hour = d3.timeHour(d.date).getHours() // pre-calculate hours for better performance
      })

      const ndx = crossfilter(this.results)
      const all = ndx.groupAll()

      // Compute groupby Count for overview
      const overviewDimension = ndx.dimension(d => [
        d.event_source,
        d.event_type,
        d.icon
      ])
      const overviewGroup = overviewDimension.group().reduceCount()

      const counts = overviewGroup.top(Infinity).reduce((p, c) => {
        if (!Object.prototype.hasOwnProperty.call(p, c.key[0])) {
          p[c.key[0]] = {}
          p[c.key[0]].count = 0
          p[c.key[0]].title = c.key[0]
          p[c.key[0]].action = c.key[2]
          p[c.key[0]].items = []
        }
        p[c.key[0]].count += c.value
        p[c.key[0]].items.push({ title: c.key[1], count: c.value })
        return p
      }, {})

      this.items = Object.values(counts)
      this.total = all.value()

      // Compute and draw line chart
      this.lineChart = new dc.LineChart('#line-chart')
      this.volumeDimension = ndx.dimension(d => d.day)
      const volumeGroup = this.volumeDimension.group().reduceCount()
      this.startDate = this.volumeDimension.top(1)[0].day
      this.endDate = this.volumeDimension.bottom(1)[0].day
      const height = 240
      this.lineChart
        .renderArea(true)
        .width(d3.select('#line-chart').node().getBoundingClientRect().width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 20, right: 10, bottom: 20, left: 20 })
        .group(volumeGroup)
        .dimension(this.volumeDimension)
        .curve(d3.curveCardinal.tension(0.05))
        .x(d3.scaleTime())
        .y(d3.scaleLinear().domain([0, 10]))
        .ordinalColors(['#58539E'])
        .elasticX(true)
        .elasticY(true)
        .brushOn(false)
        .xyTipsOn(true)
        .mouseZoomable(false)
        .renderHorizontalGridLines(false)
        .clipPadding(10)
        .title(d => formatTime(+d.key) + ': ' + d.value)
        .yAxisLabel('')
        .xAxis()
        .ticks(5)

      // When no data available for a specific time period, show an empty message
      function showEmptyMessage(chart) {
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
        empty.transition().duration(1000).style('opacity', 1)
        empty.exit().remove()
      }
      // Compute and draw row chart
      const rowChart = new dc.RowChart('#row-chart')
      const typeDimension = ndx.dimension(d => d.event_type)
      const typeGroup = typeDimension.group().reduceCount()
      const width = d3.select('#row-chart').node().getBoundingClientRect().width

      // Make a Fake group to display only value above 0 on the row graphs
      function removeEmptyBins(group) {
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
      }

      rowChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(typeGroup))
        .dimension(typeDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(10))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      rowChart.on('pretransition', showEmptyMessage)
      // Render all graphs
      dc.renderAll()
    }
  }
}
</script>
<style>
.brush .custom-brush-handle {
  display: none;
}
</style>
