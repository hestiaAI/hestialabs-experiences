// https://github.com/d3/d3
import * as d3 from 'd3'

// somewhat inspired by
// https://bost.ocks.org/mike/chart/
export default function timeSeriesChart() {
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
        .attr('fill', 'teal')
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
