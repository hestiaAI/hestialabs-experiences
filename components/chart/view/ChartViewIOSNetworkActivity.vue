<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <VRow>
          <VCol cols="12" md="4">
            <div :id="`app-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Application ID</strong>
                  </template>
                  <span>The bundle identifier of the initiating app.</span>
                </VTooltip>
                <VSpacer />
                <div :id="`app-search-${graphId}`"></div>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`domain-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Domain</strong>
                  </template>
                  <span>The domain of the network connection.</span>
                </VTooltip>
                <VSpacer />
                <div :id="`domain-search-${graphId}`"></div>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`domainType-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Profiling user</strong>
                  </template>
                  <span
                    >Whether the domain has been identified as potentially
                    collecting information across apps and sites, and
                    potentially profiling users.</span
                  >
                </VTooltip>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
        </VRow>
        <VRow>
          <VCol cols="12" md="4">
            <div :id="`context-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Context</strong>
                  </template>
                  <span
                    >The website that made the connection, if applicable.</span
                  >
                </VTooltip>
                <VSpacer />
                <div :id="`context-search-${graphId}`"></div>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`domainOwner-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on">Domain owner</strong>
                  </template>
                  <span>The owner of the domain, if applicable.</span>
                </VTooltip>
                <VSpacer />
                <div :id="`domainOwner-search-${graphId}`"></div>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
          <VCol cols="12" md="4">
            <div :id="`initiatedType-chart-${graphId}`">
              <div style="display: flex">
                <VTooltip left max-width="200">
                  <template #activator="{ on, attrs }">
                    <strong v-bind="attrs" v-on="on"
                      >Initiated by the app</strong
                    >
                  </template>
                  <span
                    >Whether the app or the user initiated the connection.</span
                  >
                </VTooltip>
              </div>
              <p class="filters">
                <span>
                  Current filter:
                  <span class="filter"></span>
                </span>
                <a class="reset" style="display: none">reset</a>
              </p>
            </div>
          </VCol>
        </VRow>
      </VCol>
    </ChartViewVRowWebShare>
    <VRow>
      <div :id="`dc-data-count-${graphId}`" class="dc-data-count"></div>
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
import { removeEmptyBins } from './utils/DCHelpers'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  mixins: [mixin],
  props: {},
  data() {
    return {
      header: [
        { text: 'App', value: 'bundleID' },
        { text: 'Domain', value: 'domain' },
        { text: 'Domain Type', value: 'domainType' },
        { text: 'Domain Owner', value: 'domainOwner' },
        { text: 'Context', value: 'context' },
        { text: 'Initated by', value: 'initiatedType' },
        { text: 'Hits', value: 'hits' }
      ],
      results: [],
      colorPalette: ['#58539E', '#847CEB', '#605BAB', '#4A4685', '#9498F2']
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    decodeDefault(str) {
      try {
        return str ? decodeURIComponent(escape(str)) : 'Unknown'
      } catch (e) {
        console.error(e)
        return str || 'Unknown'
      }
    },
    createTopRowChart(ndx, fieldAccessor, valueAccessor) {
      // Create and bind charts to their respective divs
      const chart = new dc.RowChart(`#${fieldAccessor}-chart-${this.graphId}`)
      const search = new dc.TextFilterWidget(
        `#${fieldAccessor}-search-${this.graphId}`
      )

      // Bind reset filters buttons
      d3.select(`#${fieldAccessor}-chart-${this.graphId} a.reset`).on(
        'click',
        function () {
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
        .height(252)
        .margins({ top: 20, left: 10, right: 10, bottom: 20 })
        .group(removeEmptyBins(chartGroup))
        .dimension(chartDimension)
        .ordinalColors(this.colorPalette)
        .label(d => d.key)
        .data(group => group.top(10))
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
        function () {
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
        .height(220)
        .radius(width / 2.5)
        .innerRadius(width / 8)
        .dimension(chartDimension)
        .group(chartGroup)
        .valueAccessor(d => d.value)
        .title(d => d.value + ' records')
        .ordinalColors(this.colorPalette)

      chart.on('pretransition', function (chart) {
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
    },
    drawViz() {
      // Parse and format data
      this.results = this.values.map(d => {
        return {
          app: this.decodeDefault(d.bundleID),
          domain: this.decodeDefault(d.domain),
          domainType:
            d.domainType === '2' || d.domainType === false ? 'No' : 'Yes',
          domainOwner: this.decodeDefault(d.domainOwner),
          context: this.decodeDefault(d.context),
          initiatedType:
            d.initiatedType === 'NonAppInitiated' || d.initiatedType === false
              ? 'No'
              : 'Yes',
          hits: +d.hits
        }
      })

      const ndx = crossfilter(this.results)

      this.createTopRowChart(ndx, 'app', 'hits')
      this.createTopRowChart(ndx, 'domain', 'hits')
      this.createTopRowChart(ndx, 'context', 'hits')
      this.createTopRowChart(ndx, 'domainOwner', 'hits')
      this.createPieChart(ndx, 'domainType', 'hits')
      this.createPieChart(ndx, 'initiatedType', 'hits')

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
            '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            " | <a class='resetAll'>Reset All</a>",
          all:
            'All <strong>%total-count</strong> records' +
            ' selected. Please click on the graph to apply filters.'
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
