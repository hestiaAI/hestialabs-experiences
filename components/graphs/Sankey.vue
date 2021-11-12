<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="12" class="text-center">
        <div :id="graphId"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3'
import { nest, keys } from 'd3-collection'
import * as d3Sankey from 'd3-sankey'

export default {
  name: 'Sankey',
  props: {
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    toJSONGraph(data) {
      const graph = { nodes: [], links: [] }

      data.forEach(function (d) {
        graph.nodes.push({ name: d.source, namedId: d.source + 's' })
        graph.nodes.push({ name: d.target, namedId: d.source + 't' })
        graph.links.push({
          source: d.source,
          target: d.target,
          value: +d.value
        })
      })

      console.log(graph)

      // return only the distinct / unique nodes
      graph.nodes = keys(
        nest()
          .key(d => d.namedId)
          .object(graph.nodes)
      )

      // loop through each link replacing the text with its index from node
      graph.links.forEach(function (d, i) {
        graph.links[i].source = graph.nodes.indexOf(graph.links[i].source)
        graph.links[i].target = graph.nodes.indexOf(graph.links[i].target)
      })

      // now loop through each nodes to make nodes an array of objects
      // rather than an array of strings
      graph.nodes.forEach(function (d, i) {
        graph.nodes[i] = { name: d }
      })

      return graph
    },
    drawViz() {
      console.log(this.values)
      // Format data
      this.values.forEach(d => {
        d.source = d['Begin Trip Address']
        d.target = d['Dropoff Address']
        d.value = 1
      })
      const linksData = this.toJSONGraph(this.values)
      console.log(linksData)
      // set the dimensions and margins of the graph
      const margin = { top: 10, right: 10, bottom: 10, left: 10 }
      const width = 700 - margin.left - margin.right
      const height = 300 - margin.top - margin.bottom

      // format variables
      const color = d3.scaleOrdinal(d3.schemeCategory10)

      // append the svg object to the body of the page
      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // Set the sankey diagram properties
      const sankey = d3Sankey
        .sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height])

      sankey.links()

      // set up graph in same style as original example but empty
      const graph = sankey(linksData)

      const link = svg
        .append('g')
        .selectAll('.link')
        .data(graph.links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', d3Sankey.sankeyLinkHorizontal())
        .attr('stroke-width', function (d) {
          return d.width
        })

      // add the link titles
      link.append('title').text(function (d) {
        return d.source.name + ' → ' + d.target.name + '\n'
      })

      // add in the nodes
      const node = svg
        .append('g')
        .selectAll('.node')
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
        .style('fill', function (d) {
          return (d.color = color(d.name.replace(/ .*/, '')))
        })
        .style('stroke', function (d) {
          return d3.rgb(d.color).darker(2)
        })
        .append('title')
        .text(function (d) {
          return d.name
        })

      // add in the title for the nodes
      node
        .append('text')
        .attr('x', d => d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'end')
        .text(d => d.name)
        .filter(d => d.x0 < width / 2)
        .attr('x', d => d.x1 + 6)
        .attr('text-anchor', 'start')
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
