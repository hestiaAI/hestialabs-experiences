<template>
  <g>
    <path
      class="line"
      :d="linePath"
      :stroke="color.color"
      :stroke-width="lineWidth"
      fill="none"
    />
    <path
      v-if="area"
      class="area"
      :d="areaPath"
      stroke="none"
      :stroke-width="0"
      :fill="lighterColor"
    />

    <g v-if="datapoint">
      <circle
        v-for="(point, idx) in values"
        :key="'circle_' + idx"
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
</template>

<script>
import * as d3 from 'd3'
import { Color, ColumnAccessor } from '../../utils/types'

export default {
  props: {
    values: {
      type: Array,
      required: true
    },
    yColumn: {
      type: ColumnAccessor,
      required: true
    },
    xScale: {
      type: Function,
      required: true
    },
    yScale: {
      type: Function,
      required: true
    },
    xAccessor: {
      type: Function,
      required: true
    },
    yExtent: {
      type: Array,
      required: true
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
    areaGenerator() {
      return d3
        .area()
        .x(d => {
          console.log(this.xScale(this.xAccessor(d)))
          return this.xScale(this.xAccessor(d))
        })
        .y0(this.yScale(this.yExtent[0]))
        .y1(d => this.yScale(this.yAccessor(d)))
    },
    yAccessor() {
      return d => parseInt(d[this.yColumn.columnName])
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
  methods: {}
}
</script>
<style scoped></style>
