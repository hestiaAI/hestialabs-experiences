// Functions to add x-label & y-label to Row Charts (Unsupported by dc.js)
// https://www.intothevoid.io/data-visualization/row-chart-axis-labels-dc-js/
// Use with:
// contentChart.on('postRender', function (chart) {
//  addXLabel(chart, 'Hours watched')
// })
export function addXLabel(chartToUpdate, displayText) {
  const textSelection = chartToUpdate
    .svg()
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('text-anchor', 'middle')
    .attr('x', chartToUpdate.width() / 2)
    .attr('y', chartToUpdate.height() - 10)
    .text(displayText)
  const textDims = textSelection.node().getBBox()
  const chartMargins = chartToUpdate.margins()

  // Dynamically adjust positioning after reading text dimension from DOM
  textSelection
    .attr(
      'x',
      chartMargins.left +
        (chartToUpdate.width() - chartMargins.left - chartMargins.right) / 2
    )
    .attr('y', chartToUpdate.height() - Math.ceil(textDims.height) / 2)
}
export function addYLabel(chartToUpdate, displayText) {
  const textSelection = chartToUpdate
    .svg()
    .append('text')
    .attr('class', 'y-axis-label')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr('x', -chartToUpdate.height() / 2)
    .attr('y', 10)
    .text(displayText)
  const textDims = textSelection.node().getBBox()
  const chartMargins = chartToUpdate.margins()

  // Dynamically adjust positioning after reading text dimension from DOM
  textSelection
    .attr(
      'x',
      -chartMargins.top -
        (chartToUpdate.height() - chartMargins.top - chartMargins.bottom) / 2
    )
    .attr(
      'y',
      Math.max(
        Math.ceil(textDims.height),
        chartMargins.left - Math.ceil(textDims.height) - 5
      )
    )
}
