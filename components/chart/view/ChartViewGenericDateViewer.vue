<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12" md="7">
        <p class="text-h6">Number of dated events in your files</p>
        <p
          v-if="total === 0 && !currMinDate && !currMaxDate"
          class="text-subtitle-2"
        >
          No dated events were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          From
          <strong>{{ currMinDate }}</strong> to
          <strong>{{ currMaxDate }}</strong> we found
          <strong>{{ total }}</strong> dated events in your file(s).
        </p>
      </VCol>
      <VCol cols="12" md="2">
        <VSelect
          v-model="selectTimeInt"
          :items="intervalNames"
          label="Time interval"
          @change="drawBarChart"
        ></VSelect>
      </VCol>
      <VCol cols="12" md="3">
        <VSelect
          v-model="selectFiles"
          :items="filesNames"
          label="Files"
          multiple
          @change="filterFiles"
        >
          <template #prepend-item>
            <VListItem ripple @click="toggle">
              <VListItemAction>
                <VIcon :color="selectFiles.length > 0 ? 'indigo darken-4' : ''">
                  {{ icon }}
                </VIcon>
              </VListItemAction>
              <VListItemContent>
                <VListItemTitle> Select All </VListItemTitle>
              </VListItemContent>
            </VListItem>
            <VDivider class="mt-2"></VDivider>
          </template>
          <template #selection="{ item, index }">
            <span v-if="index === 0">{{
              item.length > 13 ? item.slice(0, 13) + '..' : item
            }}</span>
            <span v-if="index === 1" class="grey--text text-caption">
              (+{{ selectFiles.length - 1 }} others)
            </span>
          </template>
        </VSelect>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <div :id="graphId"></div>
        <p class="text-subtitle-2">
          Select a <strong>time range</strong> below
          <VBtn
            x-small
            class="ma-1"
            :class="{ hide: !filtered }"
            outlined
            color="indigo"
            @click="resetFilter"
          >
            Reset
          </VBtn>
        </p>
        <div id="range-chart"></div>
      </VCol>
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
      formatDate: d3.timeFormat('%B %d, %Y'),
      formatFullDate: d3.timeFormat('%Y/%m/%d %H:%M:%S'),
      fileDimension: null,
      results: [],
      selectTimeInt: null,
      selectFiles: [],
      filesNames: [],
      filtered: false,
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
  computed: {
    selectAll() {
      return this.selectFiles.length === this.filesNames.length
    },
    selectSome() {
      return this.selectFiles.length > 0 && !this.selectAll
    },
    icon() {
      if (this.selectAll) return '$vuetify.icons.mdiCloseBox'
      if (this.selectSome) return '$vuetify.icons.mdiMinusBox'
      return '$vuetify.icons.mdiCheckboxBlankOutline'
    }
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.selectFiles = []
        } else {
          this.selectFiles = this.filesNames.slice()
        }
        this.filterFiles(this.selectFiles)
      })
    },
    drawViz() {
      if (this.values.length === 0) return
      // Format dates
      this.values.forEach(d => {
        d.date = new Date(d.date)
        d.day = d3.timeDay(d.date)
        d.dateStr = this.formatFullDate(d.date)
      })
      this.results = this.values

      // Build index for crossfiltering
      const ndx = crossfilter(this.values)

      // Build dimension for filesNames selection
      this.fileDimension = ndx.dimension(d => d.filename)
      this.filesNames = this.fileDimension
        .group()
        .top(Infinity)
        .map(e => e.key)
      this.dateDimension = ndx.dimension(d => d.date)
      this.barChart = new dc.BarChart('#' + this.graphId)
      this.rangeChart = new dc.BarChart('#range-chart')

      this.minDate = d3.timeDay.offset(
        this.dateDimension.bottom(1)[0].date,
        -12
      )
      this.currMinDate = this.formatDate(this.minDate)
      this.maxDate = this.dateDimension.top(1)[0].date
      this.currMaxDate = this.formatDate(this.maxDate)
      this.total = this.dateDimension.top(Infinity).length
      const diffDays = d3.timeDay.count(this.minDate, this.maxDate)
      if (diffDays < 100) this.selectTimeInt = 'Days'
      else if (diffDays < 1000) this.selectTimeInt = 'Weeks'
      // else if (diffDays < 3600) this.selectTimeInt = 'Months'
      else this.selectTimeInt = 'Months'

      const width = d3
        .select('#' + this.graphId)
        .node()
        .getBoundingClientRect().width
      this.barChart
        .width(width)
        .height(180)
        .ordinalColors(['#58539E'])
        .x(
          d3
            .scaleTime()
            .domain([
              d3.timeHour.offset(this.minDate, 0),
              d3.timeHour.offset(this.maxDate, 2)
            ])
        )
        .xUnits(this.intervals[this.selectTimeInt].range)
        .margins({ left: 50, top: 20, right: 50, bottom: 20 })
        .dimension(this.dateDimension)
        .group(
          this.dateDimension.group(k => this.intervals[this.selectTimeInt](k))
        )
        .rangeChart(this.rangeChart)
        .brushOn(false)
        .elasticX(false)
        .elasticY(true)
        .mouseZoomable(false)
        .clipPadding(10)
      // .barPadding(0)
      // .gap(this.selectTimeInt === 'Months' ? 20 : 0)

      this.barChart
        .yAxis()
        .tickFormat(v => d3.format(Number.isInteger(v) ? '~s' : '.2~f')(v))

      // volume chart date picker
      this.rangeChart
        .width(width)
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 50 })
        .dimension(this.dateDimension)
        .group(this.dateDimension.group(k => this.intervals.Days(k)))
        .ordinalColors(['#58539E'])
        .x(
          d3
            .scaleTime()
            .domain([
              d3.timeDay.offset(this.minDate, -12),
              d3.timeHour.offset(this.maxDate, 12)
            ])
        )
        .elasticY(true)
        .xUnits(d3.timeDays)
        .brushOn(true)
        .clipPadding(10)
      // .gap(0)

      ndx.onChange(() => {
        this.results = ndx.allFiltered()
        this.total = this.results.length
        const filters = this.dateDimension.currentFilter()
        if (filters) {
          this.filtered = true
          this.currMinDate = this.formatDate(filters[0])
          this.currMaxDate = this.formatDate(filters[1])
        } else {
          this.filtered = false
          this.currMinDate = this.formatDate(this.minDate)
          this.currMaxDate = this.formatDate(this.maxDate)
        }
      })
      dc.renderAll()
      this.toggle()
    },
    drawBarChart() {
      if (this.volumeGroup) this.volumeGroup.dispose()
      const interval = this.intervals[this.selectTimeInt]
      this.barChart.xUnits(interval.range)
      this.volumeGroup = this.dateDimension.group(k => interval(k))
      this.barChart
        .dimension(this.dateDimension)
        .group(this.volumeGroup)
        // .gap(this.selectTimeInt === 'Months' ? 10 : 0)
        .transitionDuration(1000)
        .render()
    },
    calcDomain(chart) {
      let max = chart.dimension().top(1)
      let min = chart.dimension().bottom(1)
      if (max.length > 0) {
        this.currMinDate = this.formatDate(min[0].date)
        this.currMaxDate = this.formatDate(max[0].date)
        min = d3.timeMonth.offset(min[0].date, -1)
        max = d3.timeMonth.offset(max[0].date, 1)
        chart.x().domain([min, max])
      }
    },
    onTableFilter(items) {
      // TODO: Update graph
      // console.log(items)
    },
    filterFiles(files) {
      this.fileDimension.filter(null)
      this.fileDimension.filterFunction(function (d) {
        return files.includes(d)
      })
      this.calcDomain(this.rangeChart)
      this.calcDomain(this.barChart)
      dc.redrawAll()
    },
    resetFilter() {
      dc.filterAll()
      dc.redrawAll()
    }
  }
}
</script>
<style scoped>
#range-chart g.y {
  display: none;
}
.hide {
  display: none;
}
</style>
