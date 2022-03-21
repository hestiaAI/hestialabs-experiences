<template>
  <ChartFrame v-bind="{ title, subtitle }" class="chart">
    <VContainer class="pr-10 pl-10">
      <svg class="line-chart" :viewBox="viewBox">
        <g>
          <path
            class="line"
            :d="line"
            :stroke="color.color"
            :stroke-width="lineWidth"
            fill="none"
          />
        </g>
        <g
          v-axis:x="xAxisGenerator"
          class="xAxis"
          :transform="`translate(0,${height - margin.bottom})`"
        >
          <text y="50" :x="width / 2" style="text-anchor: middle">
            {{ xLabel }}
          </text>
        </g>
        <g
          v-axis:y="yAxisGenerator"
          class="yAxis"
          :transform="`translate(${margin.left}, 0)`"
        >
          <text
            transform="rotate(-90)"
            y="-50"
            :x="-height / 2"
            style="text-anchor: middle"
          >
            {{ yLabel }}
          </text>
        </g>
      </svg>
    </VContainer>
  </ChartFrame>
</template>

<script>
import * as d3 from 'd3'
import { Color } from '../utils/types'
import MixinBase from './MixinBase'
import MixinCoordinateGrid from './MixinCoordinateGrid'

export default {
  directives: {
    axis(el, binding) {
      d3.select(el).call(binding.value)
    }
  },
  mixins: [MixinBase, MixinCoordinateGrid],
  props: {
    dateFormat: {
      type: String,
      default: () => '',
      placeHolder: 'Specify the format of the date'
    },
    color: {
      type: Color,
      default: () => new Color(),
      placeHolder: 'Specify the color of the line'
    },
    lineWidth: {
      type: Number,
      default: () => 2,
      placeHolder: 'Specify the width of the line'
    },
    area: {
      type: Boolean,
      default: () => false,
      placeHolder: ''
    },
    dot: {
      type: Boolean,
      default: () => false,
      placeHolder: ''
    }
  },
  computed: {
    dateParser() {
      if (this.dateFormat !== '') return d3.timeParse(this.dateFormat)
      else return d => new Date(d)
    },
    xAccessor() {
      return d => this.dateParser(d[this.xColumn.columnName])
    },
    yAccessor() {
      return d => parseInt(d[this.yColumn.columnName])
    },
    xScale() {
      return d3
        .scaleTime()
        .domain(d3.extent(this.values, this.xAccessor))
        .range([this.margin.left, this.width - this.margin.right])
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(d3.extent(this.values, this.yAccessor))
        .range([this.height - this.margin.bottom, this.margin.top])
    },
    xAxisGenerator() {
      return d3.axisBottom().scale(this.xScale).ticks(5)
    },
    yAxisGenerator() {
      return d3.axisLeft().scale(this.yScale).ticks(5)
    },
    lineGenerator() {
      return d3
        .line()
        .x(d => this.xScale(this.xAccessor(d)))
        .y(d => this.yScale(this.yAccessor(d)))
    },
    line() {
      return this.lineGenerator(this.values)
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
    initViz() {
      // this.updateData()
      /*
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
      */
    },
    updateViz() {
      // this.updateData()
      /*
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
        */
    },
    validData() {
      return true
    }
  }
}
</script>
<style scoped>
::v-deep g path.line {
  fill: 'none';
}
</style>
