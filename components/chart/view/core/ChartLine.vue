<template>
  <ChartFrame v-bind="{ title, subtitle }" class="chart">
    <VContainer class="pr-10 pl-10">
      <svg ref="chart" class="line-chart" :viewBox="viewBox">
        <g v-for="(line, idx) in validLines" :key="'line_' + idx">
          <LineComponent
            v-bind="{ ...line, values, xScale, yScale, xAccessor, yExtent }"
          />
        </g>
        <g
          v-axis:x="xAxisGenerator"
          class="x-axis"
          :transform="`translate(0,${height - margin.bottom})`"
        >
          <text y="50" :x="width / 2" style="text-anchor: middle">
            {{ xLabel }}
          </text>
        </g>
        <g
          v-axis:y="yAxisGenerator"
          class="y-axis"
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
import { ColumnAccessor } from '../utils/types'
import MixinBase from './MixinBase'
import MixinCoordinateGrid from './MixinCoordinateGrid'
import LineComponent from './base/LineComponent.vue'
export default {
  directives: {
    axis(el, binding, vnode) {
      d3.select(el).call(binding.value)
      const component = vnode.context
      d3.select(el)
        .selectAll('g.y-axis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', component.width - component.margin.right)
        .attr('y2', 0)
    }
  },
  components: { LineComponent },
  mixins: [MixinBase, MixinCoordinateGrid],
  props: {
    dateFormat: {
      type: String,
      default: () => '',
      placeHolder: 'Specify the format of the date'
    },
    xColumn: {
      type: ColumnAccessor,
      required: true
    },
    lines: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    validLines() {
      return this.lines.filter(l => l.yColumn)
    },
    dateParser() {
      if (this.dateFormat) return d3.timeParse(this.dateFormat)
      else return d => new Date(d)
    },
    xAccessor() {
      return d => this.dateParser(d[this.xColumn.columnName])
    },
    xExtent() {
      console.log(d3.extent(this.values, this.xAccessor))
      return d3.extent(this.values, this.xAccessor)
    },
    xScale() {
      return d3
        .scaleTime()
        .domain(this.xExtent)
        .range([this.margin.left, this.width - this.margin.right])
    },
    yExtent() {
      const extent = d3.extent(
        this.validLines.flatMap(l =>
          d3.extent(this.values, d => parseInt(d[l.yColumn.columnName]))
        )
      )

      console.log(extent)
      return extent
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
.x-axis ::v-deep line,
.y-axis ::v-deep line {
  stroke: #706f6f;
  stroke-width: 0.5;
  shape-rendering: geometricPrecision;
}
/* axis contour */
.x-axis ::v-deep path,
.y-axis ::v-deep path {
  stroke: #706f6f;
  stroke-width: 0.7;
  shape-rendering: geometricPrecision;
}
.y-axis ::v-deep path {
  display: none;
}
/* axis text */
.x-axis ::v-deep text,
.y-axis ::v-deep text {
  fill: #2b2929;
  font-size: 1rem;
  font-weight: 300;
}
.gridline {
  stroke: lightgray;
  shape-rendering: geometricPrecision;
  stroke-opacity: 0.5;
  stroke-width: 10px;
}
</style>
