<template>
  <VContainer>
    <VRow>
      <VCol v-for="graph, idx in graphs" :key="idx" cols="12" :md="graph.cols || '6'">
        <ChartCaller
          v-if="ndx"
          :type="graph.type"
          :viz-props="{
            values: values || [],
            ndx,
            ...graph
          }"
        />
      </VCol>
      <VCol cols="12" class="text-center">
        <div :id="`dc-data-count-${graphId}`" class="dc-data-count" />
      </VCol>
      <VCol cols="12">
        <UnitFilterableTable v-bind="{ headers: headers, items: results }" />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import * as dc from 'dc'
import crossfilter from 'crossfilter2'
import mixin from './mixin'
import ChartCaller from './dc/ChartCaller.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartCaller },
  mixins: [mixin],
  props: {
    graphs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      ndx: null,
      results: this.values
    }
  },
  methods: {
    resetAll() {
      dc.filterAll()
      dc.renderAll()
    },
    drawViz() {
      this.ndx = crossfilter(this.results)
      // Create and bind charts to their respective divs
      const tableCount = new dc.DataCount(`#dc-data-count-${this.graphId}`)
      const all = this.ndx.groupAll()
      // Render counter and table
      tableCount
        .crossfilter(this.ndx)
        .groupAll(all)
        .html({
          some: `<strong>%filter-count</strong> ${this.$t('selected-out-of')} <strong>%total-count</strong> ` +
                    `records | <a class='resetAll'>${this.$t('Reset All')}</a>`,
          all: `Total: <strong>%total-count</strong> records. ${this.$t('click-graph')}`
        })
        .on('pretransition', (chart, filter) => {
          this.results = this.ndx.allFiltered()
          d3.select(`#dc-data-count-${this.graphId} a.resetAll`).on('click', this.resetAll)
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
