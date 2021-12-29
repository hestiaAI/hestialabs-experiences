<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="12" class="text-center">
        <p>
          You have been targeted by <strong>{{ total }}</strong> ads between
          <strong>{{ minDate }}</strong> and <strong>{{ maxDate }}</strong>
        </p>
      </VCol>
    </VRow>
    <VRow dense justify="center" class="mt-3">
      <VCol cols="12" md="4">
        <VSlider
          v-model="topKSlider"
          label="N° of advertisers"
          thumb-color="primary"
          thumb-label="always"
          min="5"
          :max="Math.min(total, 50)"
          hide-details
          dense
          @change="draw"
        ></VSlider>
      </VCol>
    </VRow>
    <VRow dense justify="center">
      <VCol cols="6" md="2">
        <VCheckbox
          v-model="othersCheck"
          dense
          label="Display Others"
          hide-details
          @change="draw"
        ></VCheckbox>
      </VCol>
      <VCol cols="6" md="2">
        <VSelect
          v-model="agg"
          :items="aggList"
          label="Aggregation"
          dense
          hide-details
          @change="draw"
        ></VSelect>
      </VCol>
    </VRow>
    <VRow justify="center">
      <VCol cols="12" md="7">
        <div :id="graphId" style="position: relative"></div>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    accessor: {
      type: Array,
      default: () => []
    },
    valueFormat: {
      type: String,
      default: () => '~s'
    },
    yLabel: {
      type: String,
      default: () => 'Count'
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
      type: Number,
      default: () => 60
    },
    adjHorizontal: {
      type: Number,
      default: () => 150
    }
  },
  data() {
    return {
      total: 0,
      nbDay: 1,
      minDate: null,
      maxDate: null,
      records: [],
      agg: 'total',
      aggList: ['total', 'average'],
      topKSlider: 0,
      othersCheck: true
    }
  },
  methods: {
    // Update data depending on the current states of the buttons
    draw() {
      const newData = this.records[this.agg].slice(
        0,
        this.othersCheck ? this.topKSlider - 1 : this.topKSlider
      )
      if (this.othersCheck) {
        newData.push({
          key: 'Others',
          value: d3.sum(
            this.records[this.agg].slice(this.topKSlider),
            d => d.value
          )
        })
        newData.sort(function (a, b) {
          return d3.descending(a.value, b.value)
        })
      }

      this.xScale.domain(d3.extent(newData, d => d.value))
      this.yScale.domain(
        newData.map(function (d) {
          return d.key
        })
      )
      // Create/update bars
      const bars = this.svg.selectAll('.bars').data(newData, d => d.key)
      const that = this
      bars
        .enter()
        .append('rect')
        .attr('class', 'bars')
        .attr('x', 5)
        .attr('y', d => this.yScale(d.key))
        .attr('width', 0)
        .attr('height', this.yScale.bandwidth())
        .attr('fill', '#69b3a2')
        .on('mouseover', function (evt, d) {
          d3.select(this).style('opacity', 0.7)
          d3.select(this.parentNode)
            .append('text')
            .attr('class', 'barsLabel')
            .text(d.value)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'middle')
            .attr('x', that.xScale(d.value) + 15)
            .attr('y', that.yScale(d.key) + that.yScale.bandwidth() / 2)
            .style('font-size', '0.8rem')
            .style('font-weight', 'bold')
        })
        .on('mouseleave', function (evt, d) {
          d3.select(this).style('opacity', 1)
          d3.select('.barsLabel').remove()
        })
        .merge(bars)
        .transition()
        .duration(1000)
        .delay(200)
        .attr('y', d => this.yScale(d.key))
        .attr('width', d => this.xScale(d.value) + 5)
        .attr('height', this.yScale.bandwidth())

      // Animate bars when removing
      bars.exit().transition().duration(1000).attr('width', 0).remove()

      d3.select('.yAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .style('font-size', 1.8 / Math.log(this.topKSlider) + 'rem')
        .attr('title', 'test')
        .call(this.yAxis)

      d3.select('.xAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.xAxis)
    },
    drawViz() {
      // Compute date range
      const formatDate = d3.timeFormat('%B %d, %Y')
      const extent = d3.extent(this.values, d => new Date(d.date))
      this.minDate = formatDate(extent[0])
      this.maxDate = formatDate(extent[1])
      this.nbDay = d3.timeDay.count(extent[0], extent[1])

      // Add number of samples
      this.total = this.values.length

      // set default number of samples
      this.topKSlider = 20

      // Precompute aggregation
      this.records = {
        total: nest()
          .key(d => d.advertiserName)
          .rollup(d => d3.sum(d, l => l.count))
          .entries(this.values)
          .sort(function (a, b) {
            return d3.descending(a.value, b.value)
          }),
        average: nest()
          .key(d => d.advertiserName)
          .rollup(d => d3.sum(d, l => l.count) / this.nbDay)
          .entries(this.values)
          .sort(function (a, b) {
            return d3.descending(a.value, b.value)
          })
      }

      /* create svg element */
      const width = 300
      const height = 480
      d3.select('#' + this.graphId + ' svg').remove()
      this.svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            this.adjHorizontal +
            ' -' +
            this.adjVertical +
            ' ' +
            (width + this.adjHorizontal * 2) +
            ' ' +
            (height + this.adjVertical * 2)
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
        .text(this.yLabel)
      this.svg.append('g').attr('class', 'yAxis').call(yAxis)
      this.draw()
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
