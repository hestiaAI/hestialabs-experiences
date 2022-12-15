<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="8">
            <div :id="`likes-chart-${graphId}`">
              <div style="display: flex">
                <strong>Likes / Passes / Matches per month</strong>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`app-chart-${graphId}`">
              <div style="display: flex">
                <strong>App</strong>
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="8">
            <div :id="`messages-chart-${graphId}`">
              <div style="display: flex">
                <strong>Messages per month</strong>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`sexualOrientations-chart-${graphId}`">
              <div style="display: flex">
                <strong>Sexual Orientations</strong>
              </div>
              <ChartViewFilters />
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <div :id="`dc-data-count-${graphId}`" class="dc-data-count" />
    </VRow>
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
import { addPiePercentage } from './utils/dc-helpers'
import { isValidDate } from '@/utils/dates'
import ChartViewVRowWebShare from './ChartViewVRowWebShare.vue'
import ChartViewFilters from './filters/ChartViewFilters.vue'
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartViewVRowWebShare, ChartViewFilters, UnitFilterableTable },
  mixins: [mixin],
  props: {},
  data() {
    return {
      header: [
        { text: 'Date', value: 'dateStr' },
        { text: 'App', value: 'app' },
        { text: 'Likes', value: 'likes' },
        { text: 'Passes', value: 'passes' },
        { text: 'Messages sent', value: 'messagesSent' },
        { text: 'Messages received', value: 'messagesReceived' },
        { text: 'Matches', value: 'matches' },
        { text: 'Sexual Orientation', value: 'sexualOrientations' },
        { text: 'User ID', value: 'userId' }
      ],
      results: []
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    decodeDefault(str) {
      try {
        return str && str !== 'undefined'
          ? decodeURIComponent(escape(str))
          : 'Unknown'
      } catch (e) {
        console.error(e)
        return str || 'Unknown'
      }
    },
    drawViz() {
      // Parse and format data
      const dateParser = d3.timeParse('%Y-%m-%d')
      const dateFormatter = d3.timeFormat('%B, %Y')
      this.results = this.values.map((d) => {
        const date = dateParser(d.dateValue) || new Date(d.dateValue)
        return {
          date,
          dateStr: d.dateValue,
          month: d3.timeMonth(date),
          day: d3.timeDay(date),
          app: this.decodeDefault(d.app),
          likes: +this.decodeDefault(d.likes) || 0,
          passes: +this.decodeDefault(d.passes) || 0,
          messagesSent: +this.decodeDefault(d.messagesSent) || 0,
          messagesReceived: +this.decodeDefault(d.messagesReceived) || 0,
          matches: +this.decodeDefault(d.matches) || 0,
          sexualOrientations: d.app === 'tinder'
            ? JSON.parse(d.sexualOrientations).join(' | ')
            : this.decodeDefault(d.sexualOrientations),
          userId: this.decodeDefault(d.userId)
        }
      })
        .filter(d => isValidDate(d.date))
      const ndx = crossfilter(this.results)
      const likesChart = new dc.LineChart(`#likes-chart-${this.graphId}`)
      const messagesChart = new dc.LineChart(`#messages-chart-${this.graphId}`)
      const appChart = new dc.PieChart(`#app-chart-${this.graphId}`)
      const orientationChart = new dc.PieChart(`#sexualOrientations-chart-${this.graphId}`)
      // Bind reset filters buttons
      d3.select(`#likes-chart-${this.graphId} a.reset`).on('click', function() {
        likesChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#messages-chart-${this.graphId} a.reset`).on('click', function() {
        messagesChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#app-chart-${this.graphId} a.reset`).on('click', function() {
        appChart.filterAll()
        dc.redrawAll()
      })
      d3.select(`#sexualOrientations-chart-${this.graphId} a.reset`).on('click', function() {
        orientationChart.filterAll()
        dc.redrawAll()
      })
      // Custom reduce function to get unique user ids per dimension
      function add(p, d) {
        if (d.userId in p.userIds) {
          p.userIds[d.userId]++
        } else {
          p.userIds[d.userId] = 1
        }
        return p
      }
      function remove(p, d) {
        p.userIds[d.userId]--
        if (p.userIds[d.userId] === 0) {
          delete p.userIds[d.userId]
        }
        return p
      }
      function init() {
        return { userIds: {} }
      }
      // Create dimensions
      const appDimension = ndx.dimension(d => d.app)
      const orientDimension = ndx.dimension(d => d.sexualOrientations)
      const dateDimension = ndx.dimension(d => d.month)
      // Create groups
      const appGroup = appDimension.group().reduce(add, remove, init)
      const orientGroup = orientDimension.group().reduce(add, remove, init)
      const likesGroup = dateDimension.group().reduceSum(d => d.likes)
      const passesGroup = dateDimension.group().reduceSum(d => d.passes)
      const matchesGroup = dateDimension.group().reduceSum(d => d.matches)
      const msgSentGroup = dateDimension.group().reduceSum(d => d.messagesSent)
      const msgRcvGroup = dateDimension
        .group()
        .reduceSum(d => d.messagesReceived)
      const height = 250
      // Render pie chart for app
      let width = d3
        .select(`#app-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      const scale = Math.min(width, height)
      appChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(appDimension)
        .group(appGroup)
        .valueAccessor(d => Object.keys(d.value.userIds).length)
        .title(d => d.key + ': ' + Object.keys(d.value.userIds).length + ' user(s)')
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .ordinalColors(this.colorPalette)
      appChart.on('pretransition', addPiePercentage)
      // Render pie chart for sexual orientation
      width = d3
        .select(`#sexualOrientations-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      orientationChart
        .width(width)
        .height(height)
        .slicesCap(10)
        .radius(scale / 4)
        .innerRadius(scale / 8)
        .externalLabels(50)
        .dimension(orientDimension)
        .group(orientGroup)
        .valueAccessor(d => Object.keys(d.value.userIds).length)
        .title(d => d.key + ': ' + Object.keys(d.value.userIds).length + ' user(s)')
        .drawPaths(true)
        .minAngleForLabel(0.1)
        .ordinalColors(this.colorPalette)
      orientationChart.on('pretransition', addPiePercentage)
      // Render Likes / passes chart
      const dateExtent = d3.extent(this.results, d => d.date)
      width = d3
        .select(`#likes-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      likesChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(width)
        .turnOnControls(true)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(height)
        .brushOn(false)
        .renderArea(true)
        .dimension(dateDimension)
        .group(likesGroup, 'Likes')
        .x(d3.scaleTime().domain(dateExtent))
        .title('Likes', d => `${dateFormatter(d.key)}: ${d.value} likes`)
        .legend(new dc.Legend()
          .x(width - 100)
          .y(5)
          .itemHeight(13)
          .gap(5))
        .elasticY(true)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .clipPadding(10)
        .yAxisLabel('Total ')
        .ordinalColors(['#2ecc71', '#e74c3c', '#3498db'])
      likesChart.xAxis().ticks(10)
      likesChart.yAxis().ticks(6)
      likesChart.stack(passesGroup, 'Passes')
      likesChart.title('Passes', d => `${dateFormatter(d.key)}: ${d.value} passes`)
      likesChart.stack(matchesGroup, 'Matches')
      likesChart.title('Matches', d => `${dateFormatter(d.key)}: ${d.value} matches`)
      // Render Messages chart
      width = d3
        .select(`#messages-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      messagesChart
        .margins({ top: 20, left: 40, right: 20, bottom: 20 })
        .width(width)
        .turnOnControls(false)
        .curve(d3.curveMonotoneX)
        .xyTipsOn(true)
        .height(height)
        .brushOn(false)
        .renderArea(true)
        .dimension(dateDimension)
        .group(msgSentGroup, 'Messages Sent')
        .x(d3.scaleTime().domain(dateExtent))
        .legend(new dc.Legend()
          .x(width - 110)
          .y(5)
          .itemHeight(13)
          .gap(5))
        .elasticY(true)
        .renderDataPoints({
          radius: 3,
          fillOpacity: 0.8,
          strokeOpacity: 0
        })
        .clipPadding(10)
        .yAxisLabel('Total ')
        .ordinalColors(['#2c3e50', '#58539E'])
      messagesChart.xAxis().ticks(10)
      messagesChart.yAxis().ticks(6)
      messagesChart.stack(msgRcvGroup, 'Messages Received')
      messagesChart.title('Messages Received', d => `${dateFormatter(d.key)}: ${d.value} messages received`)
      messagesChart.title('Messages Sent', d => `${dateFormatter(d.key)}: ${d.value} messages sent`)
      // Render counter and table
      const all = ndx.groupAll()
      const allDim = ndx.dimension(d => d)
      const tableCount = new dc.DataCount(`#dc-data-count-${this.graphId}`)
      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                    " | <a class='resetAll'>Reset All</a>",
          all: 'All <strong>%total-count</strong> records' +
                    ' selected. Please click on the graph to apply filters.'
        })
        .on('pretransition', (chart, filter) => {
          this.results = allDim.top(all.value())
          d3.select(`#dc-data-count-${this.graphId} a.resetAll`).on('click', () => {
            dc.filterAll()
            dc.renderAll()
          })
        })
      dc.renderAll()
    }
  }
}
</script>
