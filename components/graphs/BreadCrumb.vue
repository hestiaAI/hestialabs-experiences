<template>
  <div id="breadCrumb" />
</template>
<script>
import * as d3 from 'd3'
export default {
  name: 'BreadCrumb',
  props: {
    values: {
      type: Array,
      default: () => [
        { name: 'test1', fill: 'red' },
        { name: 'test2', fill: 'red' },
        { name: 'test3', fill: 'red' },
        { name: 'test444444', fill: 'red' },
        { name: 'test5', fill: 'black' },
        { name: 'test6', fill: 'black' }
      ]
    },
    padding: {
      type: Number,
      default: () => 5
    },
    width: {
      type: Number,
      default: () => 200
    },
    height: {
      type: Number,
      default: () => 50
    },
    fontSize: {
      type: Number,
      default: () => 14
    },
    marginLeft: {
      type: Number,
      default: () => 10
    },
    marginTop: {
      type: Number,
      default: () => 10
    },
    arrowWidth: {
      type: Number,
      default: () => 4
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    // Generate a string that describes the points of a breadcrumb polygon.
    breadcrumbPoints(d, i) {
      const w = 100 // (d.name.length * this.fontSize) / 2
      const points = []
      points.push('0,0')
      points.push(`${w},0`)
      points.push(`${w + this.arrowWidth},${this.height / 2}`)
      points.push(`${w},${this.height}`)
      points.push(`0,${this.height}`)
      if (i > 0) {
        // Leftmost breadcrumb; don't include 6th vertex.
        points.push(`${this.arrowWidth},${this.height / 2}`)
      }
      return points.join(' ')
    },
    drawViz() {
      d3.select('#breadCrumb')
        .append('svg:svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('id', 'trail')

      // Data join; key function combines name and depth (= position in sequence).
      const g = d3
        .select('#trail')
        .selectAll('g')
        .data(this.values, function (d) {
          return d.name + d.depth
        })
      // Add breadcrumb and label for entering nodes.
      const entering = g.enter().append('svg:g')

      entering
        .append('svg:polygon')
        .attr('points', this.breadcrumbPoints)
        .style('fill', d => 'black')

      entering
        .append('svg:text')
        .attr('x', d => (100 + this.arrowWidth) / 2)
        .attr('y', this.height / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(function (d) {
          return d.name
        })
      // Set position for entering and updating nodes.
      g.attr('transform', function (d, i) {
        console.log(d, i)
        return `translate(${i * (100 + this.padding)}, 0)`
      })
      // Remove exiting nodes.
      g.exit().remove()

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select('#trail').style('visibility', '')
    }
  }
}
</script>
<style>
body {
  font-family: 'Roboto';
  color: #22313f;
}
</style>
