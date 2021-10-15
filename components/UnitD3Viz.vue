<template>
  <div ref="graph"></div>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: {
    d3File: {
      type: Object,
      default: () => {}
    },
    values: {
      type: Array,
      default: () => []
    },
    height: {
      type: Number,
      default: 300
    }
  },
  mounted() {
    const chart = this.d3File.module
      .default()
      .height(this.height)
      .width(this.$refs.graph.clientWidth)
    d3.select(this.$refs.graph).datum(this.values).call(chart)
  }
}
</script>
