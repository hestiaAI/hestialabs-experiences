<template>
  <VContainer>
    <div class="overline" style="text-align: center">{{ title }}</div>
    <div :id="graphId" style="position: relative"></div>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    xAccessor: {
      type: String,
      required: true
    },
    yAccessor: {
      type: String,
      required: true
    },
    xFormat: {
      type: String,
      default: () => '~s'
    },
    yAxisMaxTickLength: {
      type: Number,
      default: () => 20
    },
    padding: {
      type: Number,
      default: () => 5
    },
    margin: {
      type: Number,
      default: () => 5
    },
    adjVertical: {
      type: Array,
      default: () => [20, 50]
    },
    adjHorizontal: {
      type: Array,
      default: () => [100, 100]
    },
    xLabel: {
      type: String,
      default: () => 'records'
    },
    barsColor: {
      type: String,
      default: () => '#69b3a2'
    }
  },
  methods: {
    initViz() {
      /* create svg element */
      const width = 300
      const height = 380
      d3.select('#' + this.graphId + ' svg').remove()
      this.svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            this.adjHorizontal[0] +
            ' -' +
            this.adjVertical[0] +
            ' ' +
            (width + d3.sum(this.adjHorizontal)) +
            ' ' +
            (height + d3.sum(this.adjVertical))
        )
        .style('padding', this.padding)
        .style('margin', this.margin)
        .classed('svg-content', true)

      /* Scales */
      this.xScale = d3.scaleLinear().range([0, width])
      this.yScale = d3.scaleBand().range([0, height]).paddingInner(0.1)

      /* Axis */
      function cutLongNames(name, maxLength) {
        if (name.length > maxLength) return name.slice(0, maxLength) + '..'
        else return name
      }
      const yAxis = d3
        .axisLeft(this.yScale)
        .tickFormat(x => cutLongNames(x, this.yAxisMaxTickLength))
        .tickSizeOuter(0)
      const xAxis = d3.axisBottom(this.xScale).ticks(4)
      this.xAxis = xAxis
      this.yAxis = yAxis

      this.svg
        .append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('dy', '.75em')
        .attr('y', 30)
        .attr('x', width / 2)
        .style('text-anchor', 'middle')
        .text(this.xLabel)
      this.svg.append('g').attr('class', 'yAxis').call(yAxis)
      this.updateViz()
    },
    updateViz() {
      this.xScale.domain(d3.extent(this.values, d => d[this.xAccessor]))
      this.yScale.domain(this.values.map(d => d[this.yAccessor]))

      // Create/update bars
      const bars = this.svg
        .selectAll('.bars')
        .data(this.values, d => d[this.yAccessor])
      const that = this
      this.svg.selectAll('.bars').attr('fill', this.barsColor)
      bars
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('x', 5)
        .attr('y', d => this.yScale(d[this.yAccessor]))
        .attr('width', 0)
        .attr('height', this.yScale.bandwidth())
        .attr('fill', this.barsColor)
        .on('mouseover', function (evt, d) {
          d3.select(this).style('opacity', 0.7)
          d3.select(this.parentNode)
            .append('text')
            .attr('class', 'barsLabel')
            .text(d[that.xAccessor])
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('x', that.xScale(d[that.xAccessor]) + 15)
            .attr(
              'y',
              that.yScale(d[that.yAccessor]) + that.yScale.bandwidth() / 2
            )
            .style('font-size', '0.8rem')
            .style('font-weight', 'bold')
            .style('fill', '#0A0A0A')
        })
        .on('mouseleave', function (evt, d) {
          d3.select(this).style('opacity', 1)
          d3.select('.barsLabel').remove()
        })
        .merge(bars)
        .transition()
        .duration(1000)
        .delay(200)
        .attr('y', d => this.yScale(d[this.yAccessor]))
        .attr('width', d => this.xScale(d[this.xAccessor]) + 5)
        .attr('height', this.yScale.bandwidth())

      // Animate bars when removing
      bars.exit().transition().duration(1000).attr('width', 0).remove()

      d3.select('.yAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.yAxis)
      d3.selectAll('.yAxis g text')
        .transition()
        .duration(1000)
        .delay(200)
        .style('font-size', 1.8 / Math.log(this.values.length) + 'rem')

      d3.select('.xAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.xAxis)
    }
  }
}
</script>
<style scoped>
/* AXES */
/* ticks */
::v-deep .xAxis line,
::v-deep .yAxis line {
  stroke: #706f6f;
  stroke-width: 0.5;
  shape-rendering: geometricPrecision;
}

/* axis contour */
::v-deep .xAxis path,
::v-deep .yAxis path {
  stroke: #706f6f;
  stroke-width: 0.7;
  shape-rendering: geometricPrecision;
}

::v-deep .yAxis path {
  display: none;
}

/* axis text */
::v-deep .xAxis text,
::v-deep .yAxis text {
  fill: #2b2929;
  font-weight: 300;
}
::v-deep .xAxis text {
  fill: #2b2929;
  font-weight: 300;
  font-size: 1rem;
}
</style>
