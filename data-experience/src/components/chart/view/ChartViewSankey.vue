<template>
  <VContainer>
    <ChartViewVRowWebShare>
      <VCol cols="12" md="12" class="text-center">
        <!-- https://kazupon.github.io/vue-i18n/guide/interpolation.html#slots-syntax-usage -->
        <i18n :path="kViewBlock('labelTotal')" tag="p">
          <template #total>
            <span class="font-weight-bold" v-text="total" />
          </template>
        </i18n>
        <div :id="graphId" style="position: relative" />
      </VCol>
    </ChartViewVRowWebShare>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import { nest, keys } from 'd3-collection'
import * as d3Sankey from 'd3-sankey'
import mixin from './mixin'
import ChartViewVRowWebShare from './ChartViewVRowWebShare.vue'

export default {
  name: 'ChartViewSankey',
  mixins: [mixin],
  props: {
    topN: {
      type: Number,
      default: 10
    },
    displayLinksLabels: {
      type: Boolean,
      default: true
    },
    nodeWidth: {
      type: Number,
      default: 40
    },
    nodePadding: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      total: 0
    }
  },
  methods: {
    k(key) {
      return `chart-view.sankey.${key}`
    },
    toJSONGraph(data) {
      // group, count each similar links and limit to top n links
      const groupedData = d3
        .flatRollup(data, v => v.length, d => d.source, d => d.target)
        .map((d) => {
          return { source: d[0], target: d[1], value: d[2] }
        })
        .filter(d => d.source !== '' &&
                d.target !== '' &&
                d.value &&
                d.source !== d.target)
        .sort((a, b) => d3.descending(+a.value, +b.value))
        .slice(0, this.topN)
      const graph = { nodes: [], links: [] }
      groupedData.forEach(function(d) {
        d.sourceName = d.source
        d.targetName = d.target
        // Avoid circular links
        d.source = d.source + 's'
        d.target = d.target + 't'
        graph.nodes.push({ id: d.source })
        graph.nodes.push({ id: d.target })
        graph.links.push({
          source: d.source,
          target: d.target,
          sourceName: d.sourceName,
          targetName: d.targetName,
          value: d.value
        })
      })
      // return only the distinct / unique nodes
      graph.nodes = keys(nest()
        .key(d => d.id)
        .object(graph.nodes))
      // loop through each link replacing the text with its index from node
      graph.links.forEach(function(d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source)
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target)
      })
      // make nodes an array of objects instead than an array of strings
      graph.nodes.forEach(function(d, i) {
        graph.nodes[i] = { name: d }
      })
      return graph
    },
    drawViz() {
      this.total = this.values.length
      // transform to graph format
      const linksData = this.toJSONGraph(this.values)
      // set the dimensions and margins of the graph
      const margin = { top: 50, right: 250, bottom: 10, left: 250 }
      const width = d3
        .select('#' + this.graphId)
        .node()
        .getBoundingClientRect().width -
                margin.left -
                margin.right
      const height = this.topN * 50 - margin.top - margin.bottom
      // format variables
      const color = d3
        .scaleOrdinal()
        .domain(linksData.nodes.map(d => d.name.slice(0, -1)))
        .range(d3.schemeDark2)
      // create a tooltip for the links and append it to the viz
      const linkTooltip = d3
        .select('#' + this.graphId)
        .append('div')
        .style('opacity', 1)
        .html(`(${this.$t(this.k('hoverMessage'))})`)
        .style('left', width / 2 + margin.left + 'px')
        .style('top', 0 + 'px')
      // append the svg object to the viz
      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      // create a tooltip
      const tooltip = d3
        .select('#' + this.graphId)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
      // Add source text (on the left)
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', 0)
        .attr('y', -margin.top / 2)
        .text(this.$t(this.kViewBlock('sourceText')))
      // Add target text (on the right)
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'end')
        .text(this.$t(this.kViewBlock('targetText')))
      // Set the sankey diagram properties
      const sankey = d3Sankey
        .sankey()
        .nodeWidth(this.nodeWidth)
        .nodePadding(this.nodePadding)
        .size([width, height])
      sankey.links()
      // set up graph in same style as original example but empty
      const graph = sankey(linksData)
      svg
        .append('g')
        .selectAll('#' + this.graphId + '.link')
        .data(graph.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke-width', d => d.width)
        .attr('opacity', 0.2)
        .on('mouseover', (evt, d) => {
          const textToDisplay = this.$t(this.kViewBlock('linkMouseoverHTML'), d)
          linkTooltip.html(textToDisplay).style('opacity', 1)
          // highlight current one
          d3.select(this).attr('opacity', 0.7)
        })
        .on('mouseleave', function(d) {
          d3.select(this).attr('opacity', 0.2)
          linkTooltip.style('opacity', 0)
        })
      // add in the nodes
      const node = svg
        .append('g')
        .selectAll('#' + this.graphId + '.node')
        .data(graph.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
      // add the rectangles for the nodes
      node
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => d.y1 - d.y0)
        .attr('width', sankey.nodeWidth())
        .style('fill', d => (d.color = color(d.name.slice(0, -1))))
        .style('stroke', function(d) {
          return d3.rgb(d.color).darker(1)
        })
      node
        .on('mouseover', (evt, d) => {
          const textToDisplay = this.$t(this.kViewBlock('nodeMouseoverHTML'), {
            name: d.name.slice(0, -1),
            value: d.value,
            fromTo: this.$t(this.kViewBlock(d.name.slice(-1) === 's' ? 'from' : 'to'))
          })
          // const x = d.x1 // (d.x0 + d.x1) / 2
          // const tooltipWidth = tooltip.node().getBoundingClientRect().width
          // const tooltipHeight = tooltip.node().getBoundingClientRect().height
          // const mapWidth = svg.node().getBoundingClientRect().width
          const labelHeight = linkTooltip.node().getBoundingClientRect().height
          tooltip
            .html(textToDisplay)
            .style('left', d.x1 + margin.left + 8 + 'px')
            .style('top', d.y0 + labelHeight + 35 + 'px')
          tooltip.style('opacity', 1)
          // highlight current node
          d3.select(this).attr('opacity', 0.7)
          // Fade all the links.
          d3.selectAll('#' + this.graphId + '.link').attr('opacity', 0.2)
          // Then highlight only those that are linked to the current node.
          svg
            .selectAll('#' + this.graphId + '.link')
            .filter(link => d.index === link.source.index || d.index === link.target.index)
            .attr('opacity', 0.7)
        })
        .on('mouseleave', function(d) {
          d3.selectAll('#' + this.graphId + '.link').attr('opacity', 0.2)
          d3.select(this).attr('opacity', 1)
          tooltip.style('opacity', 0)
        })
      // add in the title for the nodes
      if (this.displayLinksLabels) {
        node
          .append('text')
          .attr('x', d => d.x1 + 6)
          .attr('y', d => (d.y1 + d.y0) / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'start')
          .text((d) => {
            let name = d.name.split(',')[0]
            if (name.length > 20) {
              name = name.slice(0, 20) + '..'
            }
            return name
          })
          .filter(d => d.x0 < width / 2)
          .attr('x', d => d.x0 - 6)
          .attr('text-anchor', 'end')
      }
    }
  },
  components: { ChartViewVRowWebShare }
}
</script>
<style scoped>
::v-deep body {
  font-family: 'Roboto';
  color: #22313f;
}

::v-deep .node rect {
  fill-opacity: 0.9;
  shape-rendering: crispEdges;
}

::v-deep .node text {
  pointer-events: none;
  text-shadow: 0 1px 0 #fff;
}

::v-deep .link {
  fill: none;
  stroke: rgb(87, 86, 87);
}

::v-deep .label {
  font-size: 1.1rem;
  font-weight: bold;
}

::v-deep .tooltip {
  font-size: 0.7rem;
  background-color: white;
  border: solid white;
  border-width: 2px;
  border-radius: 5px;
  text-align: left;
  padding: 5px;
  position: absolute;
  width: 150px;
  pointer-events: none;
  webkit-box-shadow: 0px 0px 10px grey;
  moz-box-shadow: 0px 0px 10px grey;
  box-shadow: 0px 0px 10px grey;
}
::v-deep .tooltip:before {
  content: '';
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid white;
  left: -9px;
  top: 7px;
}
</style>
