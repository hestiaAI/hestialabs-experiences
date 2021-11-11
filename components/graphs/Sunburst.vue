<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" class="text-center">
        <div :id="graphId">
          <v-breadcrumbs :items="bcItems" class="breadCrumb"></v-breadcrumbs>
        </div>
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
    },
    graphId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bcItems: []
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

      const totalSize = tree.value
      const rootName = tree.data.name
      this.bcItems = [{ text: rootName, disabled: true }]

      // Compute arcs partitons/positions
      const root = d3.partition().size([2 * Math.PI, tree.height + 1])(tree)
      root.each(d => (d.current = d))

      // Global Variables
      const width = Math.min(
        d3
          .select('#' + this.graphId)
          .node()
          .getBoundingClientRect().width,
        600
      )
      const radius = width / 6
      const color = d3.scaleOrdinal().domain(colorDomain).range(d3.schemeDark2)
      // const format = d3.format(',d')

      const arc = d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))

      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('width', width)
        .attr('height', width)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + width / 2 + ')')

      const infoLabel = svg
        .append('text')
        .attr('x', 0)
        .attr('y', -50)
        .attr('id', 'infoLabel')
        .style('font-size', '1rem')
        .style('font-weight', 'light')
        .attr('text-anchor', 'middle')
        .style('cursor', 'default')
        .style('fill', 'grey')
        .text('')
        .attr('opacity', 0)

      const infoPercent = svg
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('id', 'infoPercent')
        .attr('text-anchor', 'middle')
        .style('font-size', '2.5rem')
        .style('font-weight', 'bold')
        .style('fill', 'grey')
        .attr('font-family', 'Roboto')
        .style('cursor', 'default')
        .text('100%')
        .attr('opacity', 0)

      const infoNumber = svg
        .append('text')
        .attr('x', 0)
        .attr('y', 30)
        .attr('id', 'infoNumber')
        .style('font-size', '1rem')
        .style('font-weight', 'light')
        .attr('text-anchor', 'middle')
        .style('cursor', 'default')
        .style('fill', 'grey')
        .text(totalSize)
        .attr('opacity', 0)

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
      /*
      path.append('title').text(
        d =>
          `${d
            .ancestors()
            .map(d => d.data.name)
            .reverse()
            .join(' / ')}\n${format(d.value)}`
      )
      */

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
        .append('text')
        .datum(root)
        .attr('x', 0)
        .attr('y', 50)
        .style('font-size', '1rem')
        .style('font-weight', 'light')
        .attr('text-anchor', 'middle')
        .attr('text-decoration', 'underline')
        .text('zoom out')
        .attr('opacity', 0)
        .style('cursor', 'pointer')
        .attr('pointer-events', 'all')
        .on('click', clicked)

      let currentLevel = [{ text: rootName, disabled: true }]
      function clicked(event, p) {
        const ancestors = getAncestors(p)
        currentLevel = ancestors.map(d => {
          return {
            text: d.data.name,
            disabled: true
          }
        })
        currentLevel.unshift({ text: rootName, disabled: true })
        this.bcItems = currentLevel
        if (!p.parent) {
          parent.attr('opacity', 0)
          parent.style('cursor', 'default')
        } else {
          parent.attr('opacity', 1)
          parent.style('cursor', 'pointer')
        }
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

      const mouseover = (e, d) => {
        if (d.depth - currentLevel.length > 1) return
        // Find all ancestors of current overred element
        const ancestors = getAncestors(d)

        // Update labels
        const percentage = ((100 * d.value) / totalSize).toPrecision(3)
        let percentageString = percentage + '%'
        if (percentage < 0.1) {
          percentageString = '< 0.1%'
        }
        infoLabel.text(
          d.data.name.length > 15
            ? d.data.name.slice(0, 15) + '..'
            : d.data.name
        )
        this.bcItems = ancestors.map(d => {
          return {
            text: d.data.name,
            disabled: true
          }
        })
        this.bcItems.unshift({ text: 'All', disabled: true })
        infoPercent.text(percentageString)
        infoNumber.text(`${d.value} out of ${totalSize}`)
        infoPercent.attr('opacity', 1)
        infoNumber.attr('opacity', 1)
        infoLabel.attr('opacity', 1)

        // Fade all the segments.
        d3.selectAll('path').style('opacity', 0.3)

        // Then highlight only those that are an ancestor of the current segment.
        svg
          .selectAll('path')
          .filter(node => ancestors.includes(node))
          .style('opacity', 1)
      }

      const mouseleave = (e, d) => {
        this.bcItems = currentLevel
        infoPercent.attr('opacity', 0)
        infoNumber.attr('opacity', 0)
        infoLabel.attr('opacity', 0)
        d3.selectAll('path').style('opacity', 1)
      }
      // attach event actions
      path.on('mouseover', mouseover)
      path.on('mouseleave', mouseleave)

      function getAncestors(node) {
        const path = []
        let current = node
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
.breadCrumb.v-breadcrumbs li {
  font-size: 1.2rem;
}
</style>
