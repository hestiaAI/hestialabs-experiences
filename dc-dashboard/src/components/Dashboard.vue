<template>
  <div class="dc-dashboard">
    <div class="row">
      <div v-for="graph, idx in graphs" :class="`c-${graph.cols}`">
          <ChartCaller
            v-if="ndx && graph.chart"
            :chart="graph.chart"
            :params="{
              values: values || [],
              ndx,
              position: idx,
              colorPalette,
              ...graph
            }"
          />
        </div>
    </div>
  </div>
</template>
<script>
import crossfilter from 'crossfilter2'
import ChartCaller from './ChartCaller.vue'

export default {
  components: { ChartCaller },
  props: {
    graphs: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    },
    colorPalette: {
      type: Array,
      default: () => ['#bebada', '#8dd3c7', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#bc80bd', '#ccebc5', '#64B5CD', '#8C8C8C', '#CCB974']
    },
    messages: {
      type: Object,
      default: () => {}
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    ndx() {
      return crossfilter(this.values)
    }
  }
}
</script>
<style src="../assets/style/grid.css"></style>
<style src="../assets/style/dc.css"></style>
<style src="../assets/style/main.css"></style>
