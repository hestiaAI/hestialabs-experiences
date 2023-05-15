<template>
  <VContainer>
    <div :id="graphId" class="svg-container"/>
    <div>
      <p>
        {{ $t('directed-graph-disclaimer') }}
      </p>
    </div>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import mixin from './mixin'
import panzoom from 'panzoom'
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
      default: () => 500
    },
    padding: {
      type: Number,
      default: () => 0
    },
    margin: {
      type: Number,
      default: () => 0
    },
    nodeStrength: {
      type: Number,
      default: -400
    }
  },
  data() {
    return {
      jsonData: this.values[0].jsonData || { nodes: [], links: {} }
    }
  },
  methods: {
    zoomToFit() {
      const bounds = this.svg.node().getBBox()
      const parent = this.svg.node().parentElement
      const fullWidth = parent.clientWidth
      const fullHeight = parent.clientHeight
      const width = bounds.width
      const height = bounds.height
      const midX = bounds.x + width / 2
      const midY = bounds.y + height / 2
      if (width === 0 || height === 0) return // nothing to fit
      const scale = (0.9) / Math.max(width / fullWidth, height / fullHeight)
      const translate = [fullWidth / 2 - (scale * midX), fullHeight / 2 - (scale * midY)]

      const transform = d3.zoomIdentity
        .translate(translate[0], translate[1])
        .scale(scale)

      this.svg.attr('transform', transform)
    },
    drawViz() {
      // Init of everything
      // Init Svg container

      const height = Math.max(window.innerHeight / 2, 500)
      d3.select('#' + this.graphId + ' svg').remove()
      this.svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        // .attr('preserveAspectRatio', 'xMinYMin meet')
        // .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
        .classed('svg-content', true)
        .append('g')
        .attr('id', `g-${this.graphId}`)
      this.updateViz()
    },
    updateViz() {
      // Nodes size scale
      const sizeExtent = d3.extent(this.jsonData.links, d => +d.weight)
      const size = d3.scaleLinear().domain(sizeExtent).range([10, 40])

      // Edges size scale
      const weightExtent = d3.extent(this.jsonData.links, d => +d.weight)
      const weight = d3.scaleLinear().domain(weightExtent).range([1, 10])

      // Init forces
      const forceNode = d3.forceManyBody()
      const forceLink = d3.forceLink().id(d => d.id)
      const forceCollide = d3.forceCollide().radius(d => 16 + size(d.size)).iterations(2)
      if (this.nodeStrength) forceNode.strength(this.nodeStrength)
      if (this.linkStrength) forceLink.strength(this.linkStrength)

      // Init simulation
      const simulation = d3
        .forceSimulation()
        .force('link', forceLink)
        .force('charge', forceNode)
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('collide', forceCollide)

      // Draw links
      const link = this.svg
        .append('g')
        .attr('id', 'links')
        .selectAll('line')
        .data(this.jsonData.links)
        .enter()
        .append('line')
        .attr('stroke-width', d => weight(d.weight))
        .attr('stroke', 'grey')
        .attr('fill', 'none')

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
        .attr('stroke-width', function(d) {
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
        .text(d => d.id)
        .attr('x', 0)
        .attr('y', 3)
        .attr('text-anchor', 'middle')
        .attr('text-baseline', 'middle')
        // prevent text-selection
        .style('user-select', 'none')
        // prevent pointer events on text node
        // to enable dragging the circle element
        // when the text element is clicked
        .style('pointer-events', 'none')

      // Title for nodes
      node.append('title').text(d => d.id)

      // Start simulation
      simulation.nodes(this.jsonData.nodes).on('tick', ticked)
      simulation.force('link').links(this.jsonData.links)

      function ticked() {
        node.attr('transform', function(d) {
          // radius = 3 + Math.sqrt(d.size)*2;
          return 'translate(' + d.x + ',' + d.y + ')'
        })

        link
          .attr('x1', function(d) {
            return d.source.x
          })
          .attr('y1', function(d) {
            return d.source.y
          })
          .attr('x2', function(d) {
            return d.target.x
          })
          .attr('y2', function(d) {
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
        if (!evt.active) { simulation.alphaTarget(0.3).restart() }
        evt.subject.fx = evt.subject.x
        evt.subject.fy = evt.subject.y
      }

      function dragged(evt) {
        evt.subject.fx = evt.x
        evt.subject.fy = evt.y
      }

      function dragended(evt) {
        if (!evt.active) { simulation.alphaTarget(0) }
        evt.subject.fx = null
        evt.subject.fy = null
      }

      // Add pan & zoom
      const element = document.getElementById(`g-${this.graphId}`)
      panzoom(element)
    }
  }
}
</script>
<style scoped>
::v-deep .svg-content {
  outline: none;
}
</style>
