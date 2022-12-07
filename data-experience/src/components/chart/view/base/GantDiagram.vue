<template>
  <div>
    <div :id="`GantDiagram-${ _uid }`"></div>
  </div>
</template>
<script>
import * as d3 from 'd3'

export default {
  props: {
    currentExtent: {
      type: Array,
      default: null
    },
    values: {
      type: Array,
      default: () => []
    },
    beginAccessor: {
      type: String,
      default: 'begin_ts'
    },
    endAccessor: {
      type: String,
      default: 'end_ts'
    },
    activityAccessor: {
      type: String,
      default: 'status'
    },
    activities: {
      type: Array,
      default: () => []
    },
    colorScale: {
      type: Function,
      default: () => '#fc8d62'
    }
  },
  data() {
    return {
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      dateParser: d => new Date(d),
      barHeight: 30,
      gap: 20
    }
  },
  computed: {
    width() {
      return d3
        .select(`#GantDiagram-${this._uid}`)
        .node()
        .getBoundingClientRect().width -
        this.margin.right - this.margin.left
    },
    height() {
      return this.activities.length * (this.barHeight + this.gap)
    },
    results() {
      return this.values.map((v) => {
        return {
          ...v,
          [this.beginAccessor]: this.dateParser(v[this.beginAccessor]),
          [this.endAccessor]: this.dateParser(v[this.endAccessor])
        }
      })
    },
    dateExtent() {
      const extentBegin = d3.extent(this.results, d => d[this.beginAccessor])
      const extentEnd = d3.extent(this.results, d => d[this.endAccessor])
      return [Math.min(extentBegin[0], extentEnd[0]), Math.max(extentBegin[1], extentEnd[1])]
    },
    timeScale() {
      return d3.scaleTime()
        .domain(this.currentExtent || this.dateExtent)
        .range([0, this.width])
    }
  },
  watch: {
    currentExtent() {
      this.svg.selectAll('rect')
        .attr('width', d => this.timeScale(d[this.endAccessor]) - this.timeScale(d[this.beginAccessor]))
        .attr('x', d => this.timeScale(d[this.beginAccessor]))
    },
    activities() {
      this.svg.selectAll('.event')
        .attr('y', d => this.activities.indexOf(d[this.activityAccessor]) * (this.barHeight + this.gap))
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      d3.select(`#GantDiagram-${this._uid} svg`).remove()
      this.svg = d3.select(`#GantDiagram-${this._uid}`)
        .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

      const rectangles = this.svg
        .selectAll('rect')
        .data(this.results)

      rectangles.enter()
        .append('rect')
        .classed('event', true)
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('x', d => this.timeScale(d[this.beginAccessor]))
        .attr('y', d => this.activities.indexOf(d[this.activityAccessor]) * (this.barHeight + this.gap))
        .attr('width', d => this.timeScale(d[this.endAccessor]) - this.timeScale(d[this.beginAccessor]))
        .attr('height', this.barHeight)
        .attr('stroke', 'none')
        .attr('fill', d => this.colorScale(d[this.activityAccessor]))

      /*
      rectangles.append('text')
        .text(function(d) {
          return d.task
        })
        .attr('x', function(d) {
          return (timeScale(d[this.endAccessor]) - timeScale(d[this.beginAccessor])) / 2 + timeScale(d[this.beginAccessor]) + sidePadding
        })
        .attr('y', function(d, i) {
          return i * gap + 14 + topPadding
        })
        .attr('font-size', 11)
        .attr('text-anchor', 'middle')
        .attr('text-height', barHeight)
        .attr('fill', '#fff')
        */
    }
  }
}
</script>
