<template>
  <div ref="graph"></div>
</template>

<script>
import * as d3 from 'd3'

// somewhat inspired by
// https://bost.ocks.org/mike/chart/
function barChart() {
  let width = 440
  let height = 120
  function chart(selection) {
    selection.each(function (data) {
      // Select the svg element, if it exists.
      const svg = d3
        .select(this)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const barHeight = height / data.length
      const scale = width / Math.max(...data)
      svg
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (_, i) => i * barHeight)
        .attr('width', d => d * scale + 'px')
        .attr('height', barHeight)
        .attr('fill', 'peru')
      svg
        .selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 5)
        .attr('y', (_, i) => i * barHeight + 16)
    })
  }

  chart.width = function (_) {
    if (!arguments.length) return width
    width = _
    return chart
  }

  chart.height = function (_) {
    if (!arguments.length) return height
    height = _
    return chart
  }

  return chart
}

export default {
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    // another chart should be using this.values
    // but let's ignore it so we can use this one
    // anywhere regardless of the input
    const values = [44, 8, 15, 16, 23, 42]
    const chart = barChart().height(200).width(this.$refs.graph.clientWidth)
    d3.select(this.$refs.graph).datum(values).call(chart)
  }
}
</script>
