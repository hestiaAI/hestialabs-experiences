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
    drawViz() {
      // Transform list to hierarchical object
      const colorDomain = []
      const hierarchicalData = d3
        .stratify()
        .id(function (d) {
          return d.id
        })
        .parentId(function (d) {
          if (d.parent === 0) colorDomain.push(d.name)
          return d.parent
        })(this.values)

      // Sort the hierarchical object per depth
      const tree = hierarchicalData
        .sum(d => d.size)
        .sort((a, b) => b.value - a.value)

      // Compute arcs partitons/positions
      const root = d3.partition().size([2 * Math.PI, tree.height + 1])(tree)
      root.each(d => (d.current = d))

      // Global Variables
      const width = d3.select('#viz').node().getBoundingClientRect().width
      const radius = width / 8 - 10
      const color = d3.scaleOrdinal().domain(colorDomain).range(d3.schemeDark2)
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
          return color(d.data.name)
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
            .map(d => d.data.name)
            .reverse()
            .join(' / ')}\n${format(d.value)}`
      )

      // attach event actions
      path.on('mouseover', mouseover)
      path.on('mouseleave', mouseleave)
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
        .text(d => {
          if (!d.data.name) return 'undefined'
          return d.data.name.length > 10
            ? d.data.name.substring(0, 10) + '..'
            : d.data.name
        })
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
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.05
      }

      function labelTransform(d) {
        const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI
        const y = ((d.y0 + d.y1) / 2) * radius
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`
      }

      function mouseover(e, d) {
        // Find all ancestors of current overred element
        const ancestors = getAncestors(d)
        console.log(ancestors)

        // Fade all the segments.
        d3.selectAll('path').style('opacity', 0.3)

        // Then highlight only those that are an ancestor of the current segment.
        svg
          .selectAll('path')
          .filter(node => ancestors.includes(node))
          .style('opacity', 1)
      }

      function mouseleave(d) {
        // Deactivate all segments during transition.
        // d3.selectAll('path').on('mouseover', null)
        d3.selectAll('path').style('opacity', 1)
        // Transition each segment to full opacity and then reactivate it.
        /*
        d3.selectAll('path')
          .transition()
          .duration(1000)
          .style('opacity', 1)
          .on('end', () => {
            d3.select(this).on('mouseover', mouseover)
          })
        */
      }

      function getAncestors(node) {
        const path = []
        let current = node
        console.log(current)
        while (current.parent) {
          path.unshift(current)
          current = current.parent
        }
        return path
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
