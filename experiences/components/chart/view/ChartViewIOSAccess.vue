<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="6">
            <div :id="`app-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Application</strong>
                  </template>
                  <span>{{ $t('chart-view-ios-access.app-info') }}</span>
                </VTooltip>
                <VSpacer />
                <div :id="`app-search-${graphId}`" />
              </div>
              <p class="filters">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
                <a class="reset" style="display: none">{{ $t('reset') }}</a>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="6">
            <div :id="`category-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Resource</strong>
                  </template>
                  <span>{{ $t('chart-view-ios-access.resource-info') }}</span>
                </VTooltip>
              </div>
              <p class="filters">
                <span>
                  {{ $t('Current filter') }}
                  <span class="filter" />
                </span>
                <a class="reset" style="display: none">{{ $t('reset') }}</a>
              </p>
            </div>
          </VCol>
        </VRow>
        <p v-if="config.consent">
          {{ $t('filter-info') }}
        </p>
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
import { mapState } from 'vuex'
import mixin from './mixin'
import { removeEmptyBins } from './utils/DCHelpers'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  props: {},
  data() {
    return {
      header: [
        { text: 'Application', value: 'app' },
        { text: 'Resource', value: 'category' },
        { text: 'Identifier', value: 'identifier' },
        { text: 'Timestamp', value: 'timestamp' }
      ],
      results: [],
      colorPalette: ['#58539E', '#847CEB', '#605BAB', '#4A4685', '#9498F2']
    }
  },
  computed: {
    ...mapState(['config'])
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    decodeDefault(str) {
      return str ? decodeURIComponent(escape(str)) : 'Unknown'
    },
    createTopRowChart(ndx, fieldAccessor, valueAccessor) {
      // Create and bind charts to their respective divs
      const chart = new dc.RowChart(`#${fieldAccessor}-chart-${this.graphId}`)
      const search = this.createTextFilterWidget(
        `#${fieldAccessor}-search-${this.graphId}`
      )

      // Bind reset filters buttons
      d3.select(`#${fieldAccessor}-chart-${this.graphId} a.reset`).on(
        'click',
        function() {
          chart.filterAll()
          search.filterAll()
          dc.redrawAll()
        }
      )

      // Create dimensions
      const chartDimension = ndx.dimension(d => d[fieldAccessor])
      search.dimension(ndx.dimension(d => d[fieldAccessor].toLowerCase()))

      // Create groups
      const chartGroup = chartDimension
        .group()
        .reduceSum(d => (valueAccessor ? d[valueAccessor] : 1))

      // Render top row chart
      const width = d3
        .select(`#${fieldAccessor}-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width
      chart
        .width(width)
        .height(400)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(chartGroup))
        .dimension(chartDimension)
        .ordinalColors(this.colorPalette)
        .label(d => d.key)
        .data(group => group.top(20))
        .title(d => d.value)
        .elasticX(true)
        .xAxis()
        .ticks(4)
    },
    createPieChart(ndx, fieldAccessor, valueAccessor) {
      // Create and bind charts to their respective divs
      const chart = new dc.PieChart(`#${fieldAccessor}-chart-${this.graphId}`)

      // Bind reset filters buttons
      d3.select(`#${fieldAccessor}-chart-${this.graphId} a.reset`).on(
        'click',
        function() {
          chart.filterAll()
          dc.redrawAll()
        }
      )

      // Create dimensions
      const chartDimension = ndx.dimension(d => d[fieldAccessor])

      // Create groups
      const chartGroup = chartDimension
        .group()
        .reduceSum(d => (valueAccessor ? d[valueAccessor] : 1))

      // Render pie chart
      const width = d3
        .select(`#${fieldAccessor}-chart-${this.graphId}`)
        .node()
        .getBoundingClientRect().width

      chart
        .width(width)
        .height(400)
        .radius(width / 2.5)
        .innerRadius(width / 8)
        .dimension(chartDimension)
        .group(chartGroup)
        .valueAccessor(d => d.value)
        .title(d => d.key + ': ' + d.value + ' records')
        .ordinalColors(this.colorPalette)

      chart.on('pretransition', function(chart) {
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
    },
    drawViz() {
      // Parse and format data
      this.results = this.values.map((d) => {
        return {
          app: this.decodeDefault(d.app),
          category: this.decodeDefault(d.category),
          identifier: this.decodeDefault(d.identifier),
          timestamp: this.decodeDefault(d.timestamp)
        }
      })

      const ndx = crossfilter(this.results)

      this.createTopRowChart(ndx, 'app')
      this.createPieChart(ndx, 'category')

      // const tableCount = new dc.DataCount(`#dc-data-count-${this.graphId}`)

      // Render counter and table
      const all = ndx.groupAll()
      const allDim = ndx.dimension(d => d)
      const tableCount = new dc.DataCount(`#dc-data-count-${this.graphId}`)

      tableCount
        .crossfilter(ndx)
        .groupAll(all)
        .html({
          some:
            `<strong>%filter-count</strong> ${this.$t('selected-out-of')} <strong>%total-count</strong> ` +
            ` | <a class='resetAll'>${this.$t('Reset All')}</a>`,
          all:
            `Total: <strong>%total-count</strong>. ${this.$t('click-graph')}`
        })
        .on('pretransition', (chart, filter) => {
          this.results = allDim.top(all.value())
          d3.select(`#dc-data-count-${this.graphId} a.resetAll`).on(
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
@import 'assets/styles/dc.css';
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
</style>
