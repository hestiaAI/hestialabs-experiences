<template>
  <VContainer>
    <VRow>
      <p v-if="config.consent">
        Any filtering you do will also limit what data is shared into the pool
        if you share this tab on the 'Share My Data' tab.
      </p>
      <VCol cols="4" offset="4">
        <VSelect
          v-model="selectedApps"
          :items="apps"
          :label="messages['Applications']"
          :hint="messages['select-applications-hint']"
          persistent-hint
          multiple
          @change="filterApps"
        >
          <template #prepend-item>
            <VListItem ripple @click="toggle">
              <VListItemAction>
                <VIcon
                  :color="selectedApps.length > 0 ? 'indigo darken-4' : ''"
                >
                  {{ icon }}
                </VIcon>
              </VListItemAction>
              <VListItemContent>
                <VListItemTitle>{{ $t('Select All') }}</VListItemTitle>
              </VListItemContent>
            </VListItem>
            <VDivider class="mt-2" />
          </template>
          <template #selection="{ item, index }">
            <span v-if="index < 3">{{ item.length > 13 ? item.slice(0, 13) + '..' : item }}
            </span>
            <span v-if="index < 2">, </span>
            <div v-if="index === 3" class="grey--text text-caption">
              ({{ $tc('plusXOther', selectedApps.length - 3) }})
            </div>
          </template>
        </VSelect>
      </VCol>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12" md="9">
        <VRow>
          <VCol cols="12">
            <div id="volume-chart">
              <span v-t="messages['Amount of tracking over time']" class="font-weight-bold" />
              <ChartViewFilters />
            </div>

            <div id="range-chart">
              <ChartViewTextSelectTimeRange />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="6">
            <div id="category-chart">
              <span v-t="messages['Purposes of third party']" class="font-weight-bold" />
              <ChartViewFilters />
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div id="app-chart">
              <div style="display: flex">
                <span v-t="messages['Applications that use trackers']" class="font-weight-bold" />
                <VSpacer />
                <div id="app-search" class="search" />
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
      </VCol>
      <VCol cols="12" md="3">
        <div id="advertiser-chart">
          <div style="display: flex">
            <span v-t="messages['Companies behind tracking']" class="font-weight-bold" />
            <VSpacer />
            <div id="advertiser-search" />
          </div>
          <ChartViewFilters />
        </div>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <template v-if="filterCount === totalCount">
        <i18n tag="div" :path="kViewBlock('selected-all')">
          <template #totalCount>
            <span class="font-weight-bold" v-text="totalCount" />
          </template>
        </i18n>
        <span v-t="'click-graph'" />
      </template>
      <template v-else>
        <i18n tag="div" :path="kViewBlock('selected-some')">
          <template v-for="(v, k) in { filterCount, totalCount }" #[k]>
            <span :key="k" class="font-weight-bold" v-text="v" />
          </template>
        </i18n>
        <span>&nbsp;| <a v-t="'Reset All'" @click="resetAll" /></span>
      </template>
    </VRow>
    <UnitFilterableTable :id="id" v-bind="{ headers: header, items: results, kViewBlock }" />
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import { mapState } from 'vuex'
import mixin from './mixin'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  data() {
    return {
      apps: [],
      selectedApps: [],
      selectAppDimension: null,
      header: [
        { text: 'App', value: 'app' },
        { text: 'UID', value: 'uid' },
        { text: 'More Info', value: 'url' },
        { text: 'Date', value: 'dateStr' },
        { text: 'Tracker', value: 'tracker' },
        { text: 'Destination Address', value: 'daddr' },
        { text: 'Category', value: 'category' }
      ],
      results: []
    }
  },
  computed: {
    ...mapState(['config']),
    selectAll() {
      return this.selectedApps.length === this.apps.length
    },
    selectSome() {
      return this.selectedApps.length > 0 && !this.selectAll
    },
    icon() {
      if (this.selectAll) { return '$vuetify.icons.mdiCloseBox' }
      if (this.selectSome) { return '$vuetify.icons.mdiMinusBox' }
      return '$vuetify.icons.mdiCheckboxBlankOutline'
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    toggle() {
      this.$nextTick(() => {
        if (this.selectAll) {
          this.selectedApps = []
        } else {
          this.selectedApps = this.apps.slice()
        }
        this.filterApps(this.selectedApps)
      })
    },
    filterApps(items) {
      this.selectAppDimension.filter(null)
      this.selectAppDimension.filterFunction(function(d) {
        return items.includes(d)
      })
      dc.redrawAll()
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
      // Create and bind charts to their respective divs
      const volumeChart = new dc.LineChart('#volume-chart')
      const rangeChart = new dc.BarChart('#range-chart')
      const categoryChart = new dc.PieChart('#category-chart')
      const advertiserChart = new dc.RowChart('#advertiser-chart')
      const appChart = new dc.RowChart('#app-chart')

      const appSearch = this.createTextFilterWidget('#app-search')
      const advertiserSearch = this.createTextFilterWidget('#advertiser-search')

      // Bind reset filters links
      d3.select('#volume-chart a.reset').on('click', function() {
        rangeChart.filterAll()
        volumeChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#category-chart a.reset').on('click', function() {
        categoryChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#advertiser-chart a.reset').on('click', function() {
        advertiserChart.filterAll()
        dc.redrawAll()
      })
      d3.select('#app-chart a.reset').on('click', function() {
        appChart.filterAll()
        dc.redrawAll()
      })

      // Format data to correct types
      const dateFormat = d3.timeParse('%Q')
      const dateFormatParser = d => dateFormat(d) || new Date(d)
      const formatTime = d3.timeFormat('%B %d, %Y')
      this.values.forEach((d) => {
        d.date = dateFormatParser(d.time) || new Date(d.time)
        d.day = d3.timeDay(d.date) // pre-calculate days for better performance
        d.url =
          `https://reports.exodus-privacy.eu.org/en/reports/${d.package}/latest/`
        d.dateStr = formatTime(d.day)
        d.category = d.category === '' ? 'Unknown' : d.category
        d.app = d.app === '' ? 'Unknown' : d.app
        d.tracker = d.tracker === '' ? 'Unknown' : d.tracker
      })

      const ndx = crossfilter(this.values)
      const all = ndx.groupAll()
      // get total number of records
      this.totalCount = ndx.size()
      this.filterCount = this.totalCount
      ndx.onChange(() => {
        // update table
        this.results = dayDimension.top(all.value())
        // update filter count
        this.filterCount = ndx.allFiltered().length
      })

      // Create dimensions
      const dayDimension = ndx.dimension(d => d.day)
      const categoryDimension = ndx.dimension(d => d.category)
      const advertiserDimension = ndx.dimension(d => d.tracker)
      const appDimension = ndx.dimension(d => d.app)
      appSearch.dimension(ndx.dimension(d => d.app.toLowerCase()))
      advertiserSearch.dimension(ndx.dimension(d => d.tracker.toLowerCase()))

      // Dimension for the app selector (has to be different from appDimension)
      this.selectAppDimension = ndx.dimension(d => d.app)
      this.apps = this.selectAppDimension
        .group()
        .top(Infinity)
        .map(e => e.key)
      this.toggle()

      // Create groups from dimension
      const dayGroup = dayDimension.group().reduceCount()
      const categoryGroup = categoryDimension.group().reduceCount()
      const advertiserGroup = advertiserDimension.group().reduceCount()
      const appGroup = appDimension.group().reduceCount()

      // Render volume line chart
      const minDate = d3.min(this.values, function(d) {
        return d.day
      })
      const maxDate = d3.max(this.values, function(d) {
        return d.day
      })
      const maxValue = dayGroup.top(1)[0].value + 2
      let width = d3
        .select('#volume-chart')
        .node()
        .getBoundingClientRect().width
      let height = 200

      volumeChart
        .renderArea(true)
        .width(width)
        .height(height)
        .transitionDuration(1000)
        .margins({ top: 30, right: 50, bottom: 25, left: 40 })
        .group(dayGroup)
        .dimension(dayDimension)
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
        .ordinalColors(['#58539E'])
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
        .yAxisLabel('N° of tracker reach')
        .clipPadding(10)
        // .xAxisLabel("Date")
        .yAxis()
        .ticks(5)

      // volume chart date picker
      rangeChart
        .width(width)
        .height(40)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(dayDimension)
        .group(dayGroup)
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
        .alwaysUseRounding(true)
        .xUnits(d3.timeDays)
        .ordinalColors(['#58539E'])
        .yAxis()
        .ticks(0)

      // Render category pie chart
      width = d3.select('#category-chart').node().getBoundingClientRect().width
      height = 300
      const scale = Math.min(width, height)
      categoryChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(categoryDimension)
        .group(categoryGroup)
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

      categoryChart.on('pretransition', function(chart) {
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
      // Render advertiser row chart
      width = d3
        .select('#advertiser-chart')
        .node()
        .getBoundingClientRect().width
      height = 625
      advertiserChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(advertiserGroup)
        .dimension(advertiserDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(20))
        // .labelOffsetX(0)
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)

      // Render app row chart
      width = d3.select('#app-chart').node().getBoundingClientRect().width
      height = 250
      appChart
        .width(width)
        .height(height)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(this.removeEmptyBins(appGroup))
        .dimension(appDimension)
        .ordinalColors(['#58539E', '#847CEB', '#605BAB', '#4A4685', '#35325E'])
        .label(d => d.key)
        .data(group => group.top(10))
        // .labelOffsetX(0)
        .title(d => d.value)
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

::v-deep #range-chart g.y {
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
