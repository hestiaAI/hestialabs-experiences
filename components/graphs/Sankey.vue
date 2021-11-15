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
    },
    circular: {
      type: Boolean,
      default: () => false
    },
    topN: {
      type: Number,
      default: () => 10
    }
  },
  data() {
    return {
      graphId: 'graph_' + this._uid,
      test: {
        nodes: [
          { node: 0, name: 'node0' },
          { node: 1, name: 'node1' },
          { node: 2, name: 'node2' },
          { node: 3, name: 'node3' },
          { node: 4, name: 'node4' }
        ],
        links: [
          { source: 0, target: 2, value: 2 },
          { source: 1, target: 2, value: 2 },
          { source: 1, target: 3, value: 2 },
          { source: 0, target: 4, value: 2 },
          { source: 2, target: 3, value: 2 },
          { source: 2, target: 4, value: 2 },
          { source: 3, target: 4, value: 4 }
        ]
      }
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    toJSONGraph(data) {
      // group and count each similar links
      const groupedData = d3
        .flatRollup(
          data,
          v => v.length,
          d => d.source,
          d => d.target
        )
        .map(d => {
          return { source: d[0], target: d[1], value: d[2] }
        })
        .filter(
          d =>
            d.source !== '' &&
            d.target !== '' &&
            d.value &&
            d.source !== d.target
        )
        .sort((a, b) => d3.descending(+a.value, +b.value))
        .slice(0, this.topN)

      const graph = { nodes: [], links: [] }

      const avoidCircular = !this.circular
      groupedData.forEach(function (d) {
        // Avoid circular graphs
        if (avoidCircular) {
          d.source = d.source + 's'
          d.target = d.target + 't'
        }
        graph.nodes.push({ name: d.source })
        graph.nodes.push({ name: d.target })
        graph.links.push({
          source: d.source,
          target: d.target,
          value: d.value
        })
      })

      // return only the distinct / unique nodes
      graph.nodes = keys(
        nest()
          .key(d => d.name)
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
      // Format data
      this.values.forEach(d => {
        d.source = d['Begin Trip Address']
        d.target = d['Dropoff Address']
        d.value = 1
      })
      const linksData = this.toJSONGraph(this.values)

      // set the dimensions and margins of the graph
      const margin = { top: 50, right: 150, bottom: 10, left: 150 }
      const width =
        d3
          .select('#' + this.graphId)
          .node()
          .getBoundingClientRect().width -
        margin.left -
        margin.right
      const height = this.topN * 50 - margin.top - margin.bottom

      // format variables
      const color = d3
        .scaleOrdinal()
        .domain(linksData.nodes.map(d => d.name))
        .range(d3.schemeDark2)

      // append the svg object to the body of the page
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

      // Add Label source addresses
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', 0)
        .attr('y', -margin.top / 2)
        .text('Pickup places')

      // Add Label target addresses
      svg
        .append('text')
        .attr('class', 'label')
        .attr('x', width)
        .attr('y', -margin.top / 2)
        .attr('text-anchor', 'end')
        .text('Dropoff places')

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
        .attr('stroke-width', d => d.width)
        .on('mouseover', function (evt, d) {
          d3.select(this).attr('opacity', 0.7)
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
        .style('fill', d => (d.color = color(d.name)))
        .style('stroke', function (d) {
          return d3.rgb(d.color).darker(1)
        })
      node.append('title').text(function (d) {
        return d.name
      })

      node
        .on('mouseover', function (evt, d) {
          const textToDisplay = `<b>${d.name}</b><br><center><b>${d.value}</b> trips from this place</center>`
          tooltip
            .html(textToDisplay)
            .style('left', margin.left - (d.x0 + d.x1) / 2 + 'px')
            .style('top', d.y0 + margin.top + 100 + 'px')
          tooltip.style('opacity', 1)

          d3.select(this).attr('opacity', 0.7)

          // Fade all the links.
          d3.selectAll('path').style('opacity', 0.3)

          // Then highlight only those that are linked to the current node.
          svg
            .selectAll('path')
            .filter(
              link =>
                d.index === link.source.index || d.index === link.target.index
            )
            .style('opacity', 1)
        })
        .on('mouseleave', function (d) {
          d3.selectAll('path').style('opacity', 1)
          tooltip.style('opacity', 0)
        })

      // add in the title for the nodes
      /*
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
        */
    }
  }
}
</script>
<style>
body {
  font-family: 'Roboto';
  color: #22313f;
}

.node rect {
  fill-opacity: 0.9;
  shape-rendering: crispEdges;
}

.node text {
  pointer-events: none;
  text-shadow: 0 1px 0 #fff;
}

.link {
  fill: none;
  stroke: #000;
  stroke-opacity: 0.2;
}

.tooltip {
  font-size: 0.7rem;
  background-color: white;
  border: solid white;
  border-width: 2px;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  width: 150px;
  pointer-events: none;
  webkit-box-shadow: 0px 0px 10px grey;
  moz-box-shadow: 0px 0px 10px grey;
  box-shadow: 0px 0px 10px grey;
}
</style>
