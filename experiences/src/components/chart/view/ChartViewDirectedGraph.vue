<template>
  <VContainer>
    <div :id="graphId" style="position: relative" />
    <div>
      <p>
        Please take into account the fact that this graph only shows the link
        between data flows that are tagged as Fingerprinting or Advertising.
      </p>
    </div>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import forceBoundary from 'd3-force-boundary' // Faire joli TODO check
import { pick } from 'lodash-es'
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
      default: () => 400
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
      // Là dedans que tu construis ton format
      const categoriesToKeep = [
        'FingerprintingGeneral',
        'FingerprintingInvasive',
        'Advertising'
      ]

      let result = this.values.filter(
        row => categoriesToKeep.includes(row.categ) & (row.app !== 'Unknown')
      )
      result = result.map(o => pick(o, ['app', 'tracker']))

      const nodesToRemove = ['Chrome', 'Firefox', 'Samsung Internet']
      result = result.filter(row => !nodesToRemove.includes(row.app))

      const links = result.map(function(item) {
        return { source: item.app, target: item.tracker, weight: 1 }
      })

      const temp = result.reduce((p, c) => {
        if (!Object.prototype.hasOwnProperty.call(p, c.app)) {
          p[c.app] = 1
        }
        if (!Object.prototype.hasOwnProperty.call(p, c.tracker)) {
          p[c.tracker] = 1
        }
        p[c.tracker]++
        return p
      }, {})

      const nodes = []
      const colors = [
        '#655FB5',
        '#8D88C8',
        '#ACA9D8',
        '#CCCBE6',
        '#EBEBF6',
        '#FFFFFF'
      ].reverse()
      for (const k in temp) {
        nodes.push({
          id: k,
          weight: temp[k],
          size: 10 + temp[k] - 1 * 2,
          color: colors[Math.min(colors.length - 1, temp[k])]
        })
      }

      return {
        nodes,
        links
      }
    }
  },
  methods: {
    drawViz() {
      // Init of everything
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
      this.updateViz()
    },
    updateViz() {
      // Nodes size scale
      const minValue = d3.min(this.jsonData.nodes, function(d) {
        return +d.size
      })
      const maxValue = d3.max(this.jsonData.nodes, function(d) {
        return +d.size
      })
      const size = d3.scaleLinear().domain([minValue, maxValue]).range([10, 40])

      // Init simulation
      const simulation = d3
        .forceSimulation()
        .force(
          'boundary',
          forceBoundary(30, 30, this.width - 30, this.height - 30)
        )
        .force(
          'link',
          d3.forceLink().id(function(d) {
            return d.id
          })
        )
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('charge', d3.forceManyBody().strength(-1000))
        .force(
          'collide',
          d3
            .forceCollide()
            .radius(function(d) {
              return 16 + size(d.size)
            })
            .iterations(2)
        )

      // Draw links
      // Arrow definition
      //      this.svg
      //        .append('defs')
      //        .append('marker')
      //        .attr({
      //          id: 'arrowhead',
      //          viewBox: '-0 -5 10 10',
      //          refX: 13,
      //          refY: 0,
      //          orient: 'auto',
      //          markerWidth: 13,
      //          markerHeight: 13,
      //          xoverflow: 'visible'
      //        })
      //        .append('svg:path')
      //        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      //        .attr('fill', '#999')
      //        .style('stroke', 'none')

      const link = this.svg
        .append('g')
        .attr('id', 'links')
        .selectAll('line')
        .data(this.jsonData.links)
        .enter()
        .append('line')
        .attr('stroke-width', function(d) {
          return 1 * d.weight
        })
        .attr('stroke', 'grey')
        .attr('fill', 'none')
      //        .attr('marker-end', 'url(#arrow)')

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
        .text(function(d) {
          return d.id
        })

        .attr('x', 0)
        .attr('y', 3)
        .attr('text-anchor', 'middle')
        .attr('text-baseline', 'middle')

      // Title for nodes
      node.append('title').text(function(d) {
        return d.id
      })

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
    }
  }
}
</script>
