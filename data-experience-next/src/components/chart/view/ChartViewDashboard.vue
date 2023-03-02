<template>
  <VContainer>
    <VRow>
      <VCol
        v-for="graph, idx in graphs"
        :key="idx"
        cols="12"
        :md="graph.cols || '6'"
        :offset-md="graph.offset || '0'"
      >
        <ChartCaller
          v-if="ndx && graph.type"
          :type="graph.type"
          :viz-props="{
            values: values || [],
            ndx,
            position: idx,
            colorPalette,
            ...graph
          }"
        />
      </VCol>
      <VCol
        cols="12"
        class="text-center"
      >
        <div
          :id="`dc-data-count-${graphId}`"
          class="dc-data-count"
        />
      </VCol>
      <VCol cols="12">
        <UnitFilterableTable
          v-show="showTable"
          v-bind="{ headers: headers, items: results, viewBlockTranslationPrefix }"
        />
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
import UnitFilterableTable from '@/components/unit/filterable-table/UnitFilterableTable.vue'

// Remove warning on default colorscheme, even if not used..
dc.config.defaultColors(d3.schemePaired)

export default {
  components: { ChartCaller, UnitFilterableTable },
  mixins: [mixin],
  props: {
    graphs: {
      type: Array,
      required: true
    },
    showTable: {
      type: Boolean,
      default: true
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
                    `${this.$t('records')} | <a class='resetAll'>${this.$t('Reset All')}</a>`,
          all: `Total: <strong>%total-count</strong> ${this.$t('records')}. ${this.$t('click-graph')}`
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
