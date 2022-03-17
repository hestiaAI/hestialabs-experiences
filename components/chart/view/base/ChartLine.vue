<template>
  <ChartFrame v-bind="{ title, subtitle }">
    <div ref="graph" align="center"></div>
  </ChartFrame>
</template>

<script>
import * as d3 from 'd3'
import MixinBase from './MixinBase'
import MixinCoordinateGrid from './MixinCoordinateGrid'

export default {
  mixins: [MixinBase, MixinCoordinateGrid],
  props: {
    dateFormat: {
      type: String,
      default: () => '',
      placeHolder: 'Specify the format of the date'
    }
  },
  data() {
    return {
      width: 600,
      height: 300,
      svg: null,
      xScale: null,
      yScale: null,
      xAccessor: null,
      yAccessor: null,
      xAxisGenerator: null,
      yAxisGenerator: null,
      lineGenerator: null,
      dateParser: null
    }
  },
  watch: {
    yColumn: {
      handler(val) {
        console.log('Update yColumn', val)
      }
    }
  },
  methods: {
    // Define/Update the utility variables needeed for the chart
    updateData() {
      console.log('updateData', this.yColumn)
      // Set width and height depending on container size
      this.width = this.$refs.graph.clientWidth * 0.9
      this.height = this.width / 1.61803398875 // golden ratio

      // Use default Date loader or custom depending on props
      if (this.dateFormat !== '')
        this.dateParser = d3.timeParse(this.dateFormat)
      else this.dateParser = d => new Date(d)

      // Define the accessors for the values array
      this.xAccessor = d => this.dateParser(d[this.xColumn.columnName])
      this.yAccessor = d => parseInt(d[this.yColumn.columnName])

      // Define/update the xScale
      this.xScale = d3
        .scaleTime()
        .domain(d3.extent(this.values, this.xAccessor))
        .range([this.margin.left, this.width - this.margin.right])

      // Define/update the yScale
      this.yScale = d3
        .scaleLinear()
        .domain(d3.extent(this.values, this.yAccessor))
        .range([this.height - this.margin.bottom, this.margin.top])

      // function to create axis from scale
      this.xAxisGenerator = d3.axisBottom().scale(this.xScale).ticks(5)
      this.yAxisGenerator = d3.axisLeft().scale(this.yScale).ticks(5)

      // function to calculate line positions
      this.lineGenerator = d3
        .line()
        .x(d => this.xScale(this.xAccessor(d)))
        .y(d => this.yScale(this.yAccessor(d)))
    },
    initViz() {
      this.updateData()
      console.log('initViz')
      // Add a root SVG element to draw the chart
      d3.select(this.$refs.graph).select('svg').remove()
      this.svg = d3
        .select(this.$refs.graph)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
        .classed('svg-content', true)

      // Draw line
      this.svg
        .append('path')
        .attr('class', 'line')
        .attr('d', this.lineGenerator(this.values))
        .attr('fill', 'none')
        .attr('stroke', '#58539e')
        .attr('stroke-width', 1.5)

      // Draw xAxis
      this.svg
        .append('g')
        .attr('class', 'yAxis')
        .call(this.yAxisGenerator)
        .style('transform', `translateX(${this.margin.left}px)`)

      // Draw yAxis
      this.svg
        .append('g')
        .attr('class', 'xAxis')
        .call(this.xAxisGenerator)
        .style('transform', `translateY(${this.height - this.margin.bottom}px)`)
    },
    updateViz() {
      this.updateData()
      console.log('updateViz')
      // Update line data and position
      this.svg
        .select('path.line')
        .transition()
        .duration(1000)
        .delay(200)
        .attr('d', this.lineGenerator(this.values))
        .attr('fill', 'none')
        .attr('stroke', '#58539e')
        .attr('stroke-width', 1.5)

      // Update yAxis
      this.svg
        .select('g.yAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.yAxisGenerator)
        .style(
          'transform',
          `translateX(${this.margin.left ? this.margin.left : 0}px)`
        )

      // Update xAxis
      this.svg
        .select('g.xAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.xAxisGenerator)
        .style('transform', `translateY(${this.height - this.margin.bottom}px)`)
    },
    validData() {
      return true
    }
  }
}
</script>
