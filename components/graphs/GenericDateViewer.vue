<template>
  <v-container>
    <v-row>
      <p>
        From
        <strong>{{ minDate }}</strong> to <strong>{{ maxDate }}</strong> we
        found <strong>{{ total }}</strong> dated events in your file(s).
      </p>
    </v-row>
    <v-row>
      <v-col cols="9">
        <p class="text-h6">Number of dated event in your files</p>
        <p class="text-subtitle-2">
          click and drag on the graph to select a time range
        </p>
      </v-col>
      <v-col cols="3">
        <v-select
          v-model="select"
          :items="intervalNames"
          label="Time interval"
          @change="drawBarChart"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"><div :id="graphId"></div></v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <unit-filterable-table
          v-bind="{ data: { headers: header, items: results } }"
          @current-items="onTableFilter"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import UnitFilterableTable from '~/components/UnitFilterableTable'

export default {
  name: 'GenericDateViewer',
  components: { UnitFilterableTable },
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      results: [],
      select: null,
      intervals: {
        Days: d3.timeDay,
        Weeks: d3.timeWeek,
        Months: d3.timeMonth,
        Years: d3.timeYear
      },
      intervalNames: ['Days', 'Weeks', 'Months', 'Years'],
      aggregate: true,
      minDate: null,
      maxDate: null,
      total: 0,
      barChart: null,
      dateDimension: null,
      volumeGroup: null,
      graphId: 'graph_' + this._uid,
      header: [
        { text: 'Date', value: 'dateStr' },
        { text: 'Description', value: 'description' }
      ]
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
    drawViz() {
      const formatDate = d3.timeFormat('%B %d, %Y')
      const formatFullDate = d3.timeFormat('%Y/%m/%d %H:%M:%S')
      this.values.forEach(d => (d.dateStr = formatFullDate(d.date)))
      this.results = this.values
      // Build index for crossfiltering
      const ndx = crossfilter(this.values)
      this.dateDimension = ndx.dimension(d => d.date)
      this.barChart = new dc.BarChart('#' + this.graphId)
      this.minDate = formatDate(this.dateDimension.bottom(1)[0].date)
      this.maxDate = formatDate(this.dateDimension.top(1)[0].date)
      this.total = this.dateDimension.top(Infinity).length
      this.select = 'Months'

      this.barChart
        .width(
          d3
            .select('#' + this.graphId)
            .node()
            .getBoundingClientRect().width
        )
        .height(200)
        .ordinalColors(['#58539E'])
        .x(d3.scaleTime())
        .xUnits(this.intervals[this.select].range)
        .margins({ left: 50, top: 20, right: 50, bottom: 20 })
        .elasticY(true)
        .clipPadding(10)
      this.barChart.yAxis().tickFormat(d3.format('.3s'))
      this.drawBarChart()
      this.barChart.on('preRender', this.calcDomain)
      this.barChart.on('preRedraw', this.calcDomain)
      ndx.onChange(() => (this.results = ndx.allFiltered()))
      dc.renderAll()
    },
    drawBarChart() {
      if (this.volumeGroup) this.volumeGroup.dispose()
      const interval = this.intervals[this.select]
      this.barChart.xUnits(interval.range)
      this.volumeGroup = this.dateDimension.group(k => interval(k))
      this.barChart
        .dimension(this.dateDimension)
        .group(this.volumeGroup)
        .transitionDuration(1000)
        .render()
    },
    calcDomain(chart) {
      const min = d3.min(chart.group().all(), function (kv) {
        return kv.key
      })
      let max = d3.max(chart.group().all(), function (kv) {
        return kv.key
      })
      max = d3.timeMonth.offset(max, 1)
      chart.x().domain([min, max])
    },
    onTableFilter(items) {
      // TODO: Update graph
      // console.log(items)
    }
  }
}
</script>
