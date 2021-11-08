<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="7">
        <p>Number of informations collected</p>
        <div id="line-chart"></div>
      </v-col>
      <v-col cols="12" md="5">
        <p>Information Type</p>
        <div id="pie-chart"></div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="timeRange" row mandatory>
          <v-radio label="ALL" value="ALL"></v-radio>
          <v-radio label="1Y" value="1Y"></v-radio>
          <v-radio label="3M" value="3M"></v-radio>
          <v-radio label="1M" value="1M"></v-radio>
          <v-radio label="7D" value="7D"></v-radio>
          <v-radio label="1D" value="1D"></v-radio>
          <v-radio label="Custom" value="Custom"></v-radio>
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
      const lineChart = new dc.LineChart('#line-chart')
      const volumeDimension = ndx.dimension(d => d.day)
      const volumeGroup = volumeDimension.group().reduceCount()
      lineChart
        .renderArea(true)
        .width(d3.select('#line-chart').node().getBoundingClientRect().width)
        .height(240)
        .transitionDuration(1000)
        .margins({ top: 30, right: 10, bottom: 30, left: 50 })
        .group(volumeGroup)
        .dimension(volumeDimension)
        .curve(d3.curveCardinal.tension(0.6))
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

      console.log(this.values)

      // Compute and draw pie chart
      const pieChart = new dc.PieChart('#pie-chart')
      const typeDimension = ndx.dimension(d => d.event_type)
      const typeGroup = typeDimension.group().reduceCount()
      const width = d3.select('#pie-chart').node().getBoundingClientRect().width
      pieChart
        .width(width)
        .height(240)
        .slicesCap(10)
        .radius(width / 5)
        .innerRadius(width / 10)
        .externalLabels(50)
        .dimension(typeDimension)
        .group(typeGroup)
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

      pieChart.on('pretransition', function (chart) {
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

      // Render all graphs
      dc.renderAll()
    }
  }
}
</script>
<style></style>
