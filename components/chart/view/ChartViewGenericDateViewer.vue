<template>
  <VContainer v-if="values.length > 0">
    <p v-if="total === 0 && !currMinDate && !currMaxDate">
      No dated events were found in your file(s).
    </p>
    <p v-else>
      From
      <strong>{{ currMinDate }}</strong> to
      <strong>{{ currMaxDate }}</strong> we found
      <strong>{{ total }}</strong> dated events in your file(s).
    </p>
    <VRow>
      <VCol cols="9">
        <p class="text-h6">Number of dated event in your files</p>
        <p class="text-subtitle-2">
          (click and drag on the graph to select a time range)
        </p>
      </VCol>
      <VCol cols="3">
        <VSelect
          v-model="select"
          :items="intervalNames"
          label="Time interval"
          @change="drawBarChart"
        ></VSelect>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12"><div :id="graphId"></div></VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable
          v-bind="{ data: { headers: header, items: results } }"
          @current-items="onTableFilter"
        />
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else>
    <p class="text-center">No relevant data found</p>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'

export default {
  mixins: [mixin],
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
      currMinDate: null,
      currMaxDate: null,
      total: 0,
      barChart: null,
      dateDimension: null,
      volumeGroup: null,
      graphId: 'graph_' + this._uid,
      header: [
        { text: 'File name', value: 'filename' },
        { text: 'Date', value: 'dateStr' },
        { text: 'Description', value: 'description' }
      ]
    }
  },
  methods: {
    drawViz() {
      if (this.values.length === 0) return

      // Format dates
      const formatDate = d3.timeFormat('%B %d, %Y')
      const formatFullDate = d3.timeFormat('%Y/%m/%d %H:%M:%S')
      this.values.forEach(d => (d.dateStr = formatFullDate(d.date)))
      this.results = this.values

      // Build index for crossfiltering
      const ndx = crossfilter(this.values)
      this.dateDimension = ndx.dimension(d => d.date)
      this.barChart = new dc.BarChart('#' + this.graphId)
      this.minDate = this.dateDimension.bottom(1)[0].date
      this.currMinDate = formatDate(this.minDate)
      this.maxDate = this.dateDimension.top(1)[0].date
      this.currMaxDate = formatDate(this.maxDate)
      this.total = this.dateDimension.top(Infinity).length
      const diffDays = d3.timeDay.count(this.minDate, this.maxDate)
      if (diffDays < 100) this.select = 'Days'
      else if (diffDays < 1000) this.select = 'Weeks'
      else if (diffDays < 3600) this.select = 'Months'
      else this.select = 'Years'

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
        .gap(this.select === 'Months' ? 10 : 0)

      this.barChart.yAxis().tickFormat(d3.format('~s'))
      this.drawBarChart()
      this.barChart.on('preRender', this.calcDomain)
      this.barChart.on('preRedraw', this.calcDomain)
      ndx.onChange(() => {
        this.results = ndx.allFiltered()
        const filters = this.dateDimension.currentFilter()
        this.total = this.results.length
        if (filters) {
          this.currMinDate = formatDate(filters[0])
          this.currMaxDate = formatDate(filters[1])
        } else {
          this.currMinDate = formatDate(this.minDate)
          this.currMaxDate = formatDate(this.maxDate)
        }
      })
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
        .gap(this.select === 'Months' ? 10 : 0)
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
