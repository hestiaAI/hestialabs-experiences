<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12">
        <div id="viz" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'

export default {
  name: 'Sunburst',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      test: []
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    toHierarchical(data) {
      const hierarchicalData = []

      data.forEach(element => {
        hierarchicalData.push({
          name: element.targetingValue,
          parent: element.targetingType,
          size: element.count
        })
      })

      // Get count for first level (groupby)
      const firstLevelCounts = nest()
        .key(function (d) {
          return d.parent
        })
        .rollup(function (leaves) {
          return d3.sum(leaves, function (d) {
            return +d.size
          })
        })
        .entries(hierarchicalData)

      // Add first level parents
      firstLevelCounts.forEach(element => {
        hierarchicalData.push({
          name: element.key,
          parent: 'Me',
          size: null
        })
      })

      // Add root
      hierarchicalData.push({
        name: 'Me',
        parent: null,
        size: null
      })

      // transform to hierarchical tree
      return d3
        .stratify()
        .id(function (d) {
          return d.name
        })
        .parentId(function (d) {
          return d.parent
        })(hierarchicalData)
    },
    drawViz() {
      const hierarchicalData = this.toHierarchical(this.values)
      const tree = d3
        .hierarchy(hierarchicalData)
        .sum(d => {
          return d.data.size
        })
        .sort((a, b) => b.data.size - a.data.size)
      const root = d3.partition().size([2 * Math.PI, tree.height + 1])(tree)
      root.each(d => (d.current = d))

      /*
      const colorPalettes = [
        ['#4abdac', '#fc4a1a', '#f7b733'],
        ['#f03b20', '#feb24c', '#ffeda0'],
        ['#007849', '#0375b4', '#ffce00'],
        ['#373737', '#dcd0c0', '#c0b283'],
        ['#e37222', '#07889b', '#eeaa7b'],
        ['#062f4f', '#813772', '#b82601'],
        ['#565656', '#76323f', '#c09f80']
      ]
      */
      // Global Variables
      const width = d3.select('#viz').node().getBoundingClientRect().width
      const radius = width / 8 - 10
      const colorScale = d3.piecewise(d3.interpolateRgb.gamma(100), [
        '#22313f',
        '#2c3e50',
        '#5c97bf'
      ])
      // d3.interpolateSpectral
      const color = d3.scaleOrdinal(
        d3.quantize(colorScale, root.children.length + 1)
      )
      const format = d3.format(',d')
      const arc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

      const svg = d3
        .select('#viz')
        .append('svg')
        .attr('width', width)
        .attr('height', width)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ')')

      const path = svg
        .append('g')
        .selectAll('path')
        .data(root.descendants().slice(1))
        .join('path')
        .attr('fill', d => {
          while (d.depth > 1) d = d.parent
          return color(d.data.id)
        })
        .attr('fill-opacity', d =>
          arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attr('d', d => arc(d.current))

      path
        .filter(d => d.children)
        .style('cursor', 'pointer')
        .on('click', clicked)

      path.append('title').text(
        d =>
          `${d
            .ancestors()
            .map(d => d.data.id)
            .reverse()
            .join(' / ')}\n${format(d.value)}`
      )

      const label = svg
        .append('g')
        .attr('pointer-events', 'none')
        .attr('text-anchor', 'middle')
        .style('user-select', 'none')
        .selectAll('text')
        .data(root.descendants().slice(1))
        .join('text')
        .attr('dy', '0.35em')
        .attr('fill-opacity', d => +labelVisible(d.current))
        .attr('transform', d => labelTransform(d.current))
        .text(d =>
          d.data.id.length > 10 ? d.data.id.substring(0, 10) + '..' : d.data.id
        )
        .style('font-size', '0.8rem')
        .style('font-weight', 'bold')
        .style('fill', 'white')
        .attr('font-family', 'Roboto')

      const parent = svg
        .append('circle')
        .datum(root)
        .attr('r', radius)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('click', clicked)

      function clicked(event, p) {
        parent.datum(p.parent || root)
        root.each(
          d =>
            (d.target = {
              x0:
                Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              x1:
                Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
                2 *
                Math.PI,
              y0: Math.max(0, d.y0 - p.depth),
              y1: Math.max(0, d.y1 - p.depth)
            })
        )

        const t = svg.transition().duration(750)

        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path
          .transition(t)
          .tween('data', d => {
            const i = d3.interpolate(d.current, d.target)
            return t => (d.current = i(t))
          })
          .filter(function (d) {
            return +this.getAttribute('fill-opacity') || arcVisible(d.target)
          })
          .attr('fill-opacity', d =>
            arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
          )
          .attrTween('d', d => () => arc(d.current))

        label
          .filter(function (d) {
            return +this.getAttribute('fill-opacity') || labelVisible(d.target)
          })
          .transition(t)
          .attr('fill-opacity', d => +labelVisible(d.target))
          .attrTween('transform', d => () => labelTransform(d.current))
      }

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0
      }

      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03
      }

      function labelTransform(d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
        const y = ((d.y0 + d.y1) / 2) * radius
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`
      }
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
