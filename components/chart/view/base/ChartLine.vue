<template>
  <ChartFrame v-bind="{ title, subtitle }" class="chart">
    <VContainer class="pr-10 pl-10">
      <svg class="line-chart" :viewBox="viewBox">
        <g>
          <path
            v-if="area"
            class="area"
            :d="areaPath"
            stroke="none"
            :stroke-width="0"
            :fill="lighterColor"
          />
          <path
            class="line"
            :d="linePath"
            :stroke="color.color"
            :stroke-width="lineWidth"
            fill="none"
          />
          <g v-if="datapoint">
            <circle
              v-for="point in values"
              :key="xScale(xAccessor(point))"
              class="data-points"
              :cx="xScale(xAccessor(point))"
              :cy="yScale(yAccessor(point))"
              r="5"
              stroke="white"
              stroke-width="1"
              :fill="color.color"
            />
          </g>
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
    datapoint: {
      type: Boolean,
      default: () => false,
      placeHolder: ''
    }
  },
  computed: {
    lighterColor() {
      const color = d3.color(this.color.color)
      color.opacity = 0.15
      return color
    },
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
    xExtent() {
      return d3.extent(this.values, this.xAccessor)
    },
    xScale() {
      return d3
        .scaleTime()
        .domain(this.xExtent)
        .range([this.margin.left, this.width - this.margin.right])
    },
    yExtent() {
      return d3.extent(this.values, this.yAccessor)
    },
    yScale() {
      return d3
        .scaleLinear()
        .domain(this.yExtent)
        .range([this.height - this.margin.bottom, this.margin.top])
    },
    xAxisGenerator() {
      return d3.axisBottom().scale(this.xScale).ticks(5)
    },
    yAxisGenerator() {
      return d3.axisLeft().scale(this.yScale).ticks(5)
    },
    areaGenerator() {
      return d3
        .area()
        .x(d => this.xScale(this.xAccessor(d)))
        .y0(this.yScale(this.yExtent[0]))
        .y1(d => this.yScale(this.yAccessor(d)))
    },
    lineGenerator() {
      return d3
        .line()
        .x(d => this.xScale(this.xAccessor(d)))
        .y(d => this.yScale(this.yAccessor(d)))
    },
    areaPath() {
      return this.areaGenerator(this.values)
    },
    linePath() {
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
    initViz() {},
    updateViz() {},
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
