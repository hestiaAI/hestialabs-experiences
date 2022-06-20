import * as d3 from 'd3'
import * as dc from 'dc'

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

/**
 * Transform a simple group to a cumulative one in order
 * to make cumulative line chart
 * @param {Crossfilter group} group the group to transform
 * @returns the cumulative group
 */
export function createCumulativeGroup(group) {
  return {
    all() {
      const cumulate = {}
      return group.all().map(function (d) {
        if (cumulate[d.key[0]]) {
          cumulate[d.key[0]] += d.value
        } else {
          cumulate[d.key[0]] = d.value
        }
        return { key: d.key, value: cumulate[d.key[0]] }
      })
    }
  }
}

/**
 * Remove datapoints that are null in a crossfilter group
 * Used to hide empty bins in a bar graph
 * @param {Crossfilter group} group the group to transform
 * @returns the cleaned group
 */
export function removeEmptyBins(group) {
  return {
    top(n) {
      return group
        .top(Infinity)
        .filter(function (d) {
          return d.value.count !== 0 && d.value !== 0
        })
        .slice(0, n)
    }
  }
}

export function addPiePercentage(chart) {
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
}
