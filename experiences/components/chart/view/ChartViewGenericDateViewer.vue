<template>
  <VContainer v-if="values.length > 0">
    <VRow>
      <VCol cols="12" md="7">
        <p class="text-h6">
          {{ $t(kViewBlock('graphTitle')) }}
        </p>
        <p
          v-if="total === 0 && !currMinDate && !currMaxDate"
          class="text-subtitle-2"
        >
          {{ $t(kViewBlock('graphNoDate')) }}
        </p>
        <!-- https://kazupon.github.io/vue-i18n/guide/interpolation.html#slots-syntax-usage -->
        <i18n v-else :path="kViewBlock('datedEvents')" tag="p" class="text-subtitle-2">
          <template
            v-for="(value, key) in { currMinDate, currMaxDate, total }"
            #[key]
          >
            <span :key="key" class="font-weight-bold" v-text="value" />
          </template>
        </i18n>
      </VCol>
      <VCol cols="12" md="2">
        <VSelect
          v-model="selectTimeInt"
          :items="intervalNames"
          :label="$t('Time interval')"
          @change="drawBarChart"
        />
      </VCol>
      <VCol cols="12" md="3">
        <VSelect
          v-model="selectFiles"
          :items="filesNames"
          :label="$tc('File', 2)"
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
                <VListItemTitle> {{ $t('Select All') }} </VListItemTitle>
              </VListItemContent>
            </VListItem>
            <VDivider class="mt-2" />
          </template>
          <template #selection="{ item, index }">
            <span v-if="index === 0">{{
              item.length > 13 ? item.slice(0, 13) + '..' : item
            }}</span>
            <span v-if="index === 1" class="grey--text text-caption">
              ({{ $tc('plusXOther', selectFiles.length - 1) }})
            </span>
          </template>
        </VSelect>
      </VCol>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <div :id="graphId" />
        <ChartViewTextSelectTimeRange>
          <VBtn
            x-small
            class="ma-1"
            :class="{ hide: !filtered }"
            outlined
            color="indigo"
            @click="resetFilter"
          >
            {{ $t('reset') }}
          </VBtn>
        </ChartViewTextSelectTimeRange>
        <div :id="'range-chart' + graphId" class="range-chart" />
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <VCol cols="12">
        <UnitFilterableTable
          :id="id"
          v-bind="{ headers: header, items: results, kViewBlock }"
          @current-items="onTableFilter"
        />
      </VCol>
    </VRow>
  </VContainer>
  <VContainer v-else>
    <p class="text-center">
      {{ $t('No relevant data found') }}
    </p>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
import { datetimeFormatter } from '@/utils/dates'

export default {
  mixins: [mixin],
  data() {
    const intervals = {
      Day: d3.timeDay,
      Week: d3.timeWeek,
      Month: d3.timeMonth,
      Year: d3.timeYear
    }
    const intervalNames = Object.keys(intervals).map(value => ({
      value,
      text: this.$tc(value, 2)
    }))
    return {
      formatDate: d3.timeFormat('%B %d, %Y'),
      fileDimension: null,
      results: [],
      selectTimeInt: null,
      selectFiles: [],
      filesNames: [],
      filtered: false,
      intervals,
      intervalNames,
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
        ['File name', 'filename'],
        ['Date', 'dateStr'],
        ['Description', 'description']
      ].map(([text, value]) => ({ text, value }))
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
      if (this.selectAll) { return '$vuetify.icons.mdiCloseBox' }
      if (this.selectSome) { return '$vuetify.icons.mdiMinusBox' }
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
      if (this.values.length === 0) { return }
      // Format dates
      this.values.forEach((d) => {
        d.date = new Date(d.date)
        d.day = d3.timeDay(d.date)
        d.dateStr = datetimeFormatter(d.date)
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
      this.rangeChart = new dc.BarChart('#range-chart' + this.graphId)

      this.minDate = d3.timeDay.offset(
        this.dateDimension.bottom(1)[0].date,
        -12
      )
      this.currMinDate = this.formatDate(this.minDate)
      this.maxDate = this.dateDimension.top(1)[0].date
      this.currMaxDate = this.formatDate(this.maxDate)
      this.total = this.dateDimension.top(Infinity).length
      const diffDays = d3.timeDay.count(this.minDate, this.maxDate)
      if (diffDays < 100) {
        this.selectTimeInt = 'Day'
      } else if (diffDays < 1000) {
        this.selectTimeInt = 'Week'
      } else {
        this.selectTimeInt = 'Month'
      }

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
      // .gap(this.selectTimeInt === 'Month' ? 20 : 0)

      this.barChart.yAxis().tickFormat(v => (Number.isInteger(v) ? v : ''))

      // volume chart date picker
      this.rangeChart
        .width(width)
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 50 })
        .dimension(this.dateDimension)
        .group(this.dateDimension.group(k => this.intervals.Day(k)))
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
      if (this.volumeGroup) { this.volumeGroup.dispose() }
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
    },
    filterFiles(files) {
      this.fileDimension.filter(null)
      this.fileDimension.filterFunction(function(d) {
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
::v-deep .range-chart > svg > g > g.axis.y {
  display: none;
}
::v-deep .hide {
  display: none;
}
</style>
