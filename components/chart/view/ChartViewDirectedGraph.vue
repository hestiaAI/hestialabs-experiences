<template>
  <VContainer>
    <div :id="graphId" style="position: relative"></div>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import forceBoundary from 'd3-force-boundary'
import mixin from './mixin'
export default {
  name: 'NetworkXGraph',
  mixins: [mixin],
  props: {
    width: {
      type: Number,
      default: () => 900
    },
    height: {
      type: Number,
      default: () => 900
    },
    padding: {
      type: Number,
      default: () => 0
    },
    margin: {
      type: Number,
      default: () => 0
    }
  },
  computed: {
    jsonData() {
      return {
        nodes: [],
        edges: []
      }
    }
  },
  methods: {
    drawViz() {
      // Init Svg container
      d3.select('#' + this.graphId + ' svg').remove()
      this.svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
        .style('padding', this.padding)
        .style('margin', this.margin)
        .classed('svg-content', true)
    },
    updateViz() {
      // Nodes size scale
      const minValue = d3.min(this.jsonData.nodes, function (d) {
        return +d.size
      })
      const maxValue = d3.max(this.jsonData.nodes, function (d) {
        return +d.size
      })
      const size = d3.scaleLinear().domain([minValue, maxValue]).range([2, 40])

      // Init simulation
      const simulation = d3
        .forceSimulation()
        .force(
          'boundary',
          forceBoundary(30, 30, this.width - 30, this.height - 30)
        )
        .force(
          'link',
          d3.forceLink().id(function (d) {
            return d.id
          })
        )
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('charge', d3.forceManyBody().strength(-150))
        .force(
          'collide',
          d3
            .forceCollide()
            .radius(function (d) {
              return 16 + size(d.size)
            })
            .iterations(2)
        )

      // Draw links
      const link = this.svg
        .append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(this.jsonData.links)
        .enter()
        .append('line')
        .attr('stroke-width', function (d) {
          return 0.1 * d.weight
        })
        .attr('stroke', 'grey')

      // Draw nodes
      const node = this.svg
        .append('g')
        .attr('class', 'nodes')
        .selectAll('g')
        .data(this.jsonData.nodes)
        .enter()
        .append('g')

      node
        .append('circle')
        .attr('r', d => size(d.size))
        .attr('fill', d => d.color)
        .attr('stroke', 'white')
        .attr('stroke-opacity', 1)
        .attr('stroke-width', function (d) {
          return 0.05 * size(d.size)
        })
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )

      // Draw labels of nodes
      node
        .append('text')
        .text(function (d) {
          return d.id
        })

        .attr('x', 0)
        .attr('y', 3)
        .attr('text-anchor', 'middle')
        .attr('text-baseline', 'middle')

      // Title for nodes
      node.append('title').text(function (d) {
        return d.id
      })

      // Start simulation
      simulation.nodes(this.jsonData.nodes).on('tick', ticked)

      simulation.force('link').links(this.jsonData.links)

      function ticked() {
        node.attr('transform', function (d) {
          // radius = 3 + Math.sqrt(d.size)*2;
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        link
          .attr('x1', function (d) {
            return d.source.x
          })
          .attr('y1', function (d) {
            return d.source.y
          })
          .attr('x2', function (d) {
            return d.target.x
          })
          .attr('y2', function (d) {
            return d.target.y
          })
      }

      // Add Legend
      /*
      svg.append("g")
        .attr("class", "legend")
        .style("font-size", "0.5rem")
        .attr("transform", "translate(20,20)");

      const colorLegend = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .cells(3)
        .title("")
        .labelWrap(40)
        .titleWidth(60)
        .orient("vertical")
        .scale(color)
        .labelOffset(12);

      svg.select(".legend")
        .call(colorLegend);
      */
      function dragstarted(evt) {
        if (!evt.active) simulation.alphaTarget(0.3).restart()
        evt.subject.fx = evt.subject.x
        evt.subject.fy = evt.subject.y
      }

      function dragged(evt) {
        evt.subject.fx = evt.x
        evt.subject.fy = evt.y
      }

      function dragended(evt) {
        if (!evt.active) simulation.alphaTarget(0)
        evt.subject.fx = null
        evt.subject.fy = null
      }
    }
  }
}
</script>
<style scoped></style>
