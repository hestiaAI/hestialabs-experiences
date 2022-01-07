<template>
  <VRow>
    <VCol cols="12" md="8" offset-md="2">
      <VRow dense>
        <VCol cols="9">
          <p class="text-h6">{{ title }}</p>
        </VCol>
        <VCol cols="3">
          <VSelect
            v-model="selectedInterval"
            :items="namesInterval"
            label="Time interval"
            dense
            @change="draw"
          ></VSelect>
        </VCol>
      </VRow>
      <ChartViewVRowWebShare dense>
        <VCol cols="12">
          <div :id="graphId"></div>
        </VCol>
      </ChartViewVRowWebShare>
    </VCol>
  </VRow>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import mixin from './mixin'

// Inspired by
// https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
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
    lineWidth: {
      type: Number,
      default: () => 2
    },
    dotWidth: {
      type: Number,
      default: () => 2
    },
    dotRadius: {
      type: Number,
      default: () => 4
    },
    padding: {
      type: Number,
      default: () => 5
    },
    margin: {
      type: Number,
      default: () => 5
    },
    title: {
      type: String,
      default: () => 'Title of the Graph'
    },
    legendOffset: {
      type: Number,
      default: () => 0
    },
    legendPadding: {
      type: Number,
      default: () => 10
    }
  },
  data() {
    return {
      slices: [],
      selectedInterval: null,
      intervals: {},
      namesInterval: []
    }
  },
  methods: {
    drawViz() {
      /* Init the possible aggregations dpending on dates extent */
      const extent = d3.extent(this.values, d => new Date(d.date))
      const diffDays = d3.timeDay.count(extent[0], extent[1])
      if (diffDays > 2 && diffDays < 93)
        this.intervals.Days = {
          parser: d3.timeDay,
          format: d3.timeFormat('%B %d, %Y')
        }
      if (diffDays > 14 && diffDays < 651)
        this.intervals.Weeks = {
          parser: d3.timeWeek,
          format: d3.timeFormat('%B %d, %Y')
        }
      if (diffDays > 62 && diffDays < 1800)
        this.intervals.Months = {
          parser: d3.timeMonth,
          format: d3.timeFormat('%B %Y')
        }
      if (diffDays > 730)
        this.intervals.Years = {
          parser: d3.timeYear,
          format: d3.timeFormat('%Y')
        }
      this.namesInterval = Object.keys(this.intervals)

      /* Pivot the data */
      let accessor = this.accessor
      if (this.accessor.length === 0) {
        accessor = this.headers.slice(1).map(h => {
          return { text: h, value: h }
        })
      }
      this.slices = accessor.map(a => {
        return {
          id: a.text,
          values: this.values.map(function (d) {
            return {
              date: new Date(d.date),
              value: +d[a.value]
            }
          })
        }
      })

      /* PreCompute aggregation per day, month, etc... */
      Object.entries(this.intervals).forEach(([intervalName, interval]) => {
        this.slices.forEach(lineData => {
          lineData[intervalName] = nest()
            .key(function (d) {
              return interval.parser(new Date(d.date))
            })
            .rollup(leaves => d3.sum(leaves, l => l.value))
            .entries(lineData.values)
        })
      })
      this.selectedInterval = this.namesInterval[this.namesInterval.length - 1]
      this.draw(this.selectedInterval)
    },
    draw(intervalName) {
      const width = 800
      const height = 300
      const adj = 50

      /* create svg element */
      d3.select('#' + this.graphId + ' svg').remove()
      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            adj +
            ' -' +
            adj +
            ' ' +
            (width + adj * 2) +
            ' ' +
            (height + adj * 2)
        )
        .style('padding', this.padding)
        .style('margin', this.margin)
        .classed('svg-content', true)
      function nestedExtent(data, dataAccessor, valueAccessor) {
        return d3.extent(
          data.reduce(function (prevArr, currArr) {
            const extentArr = d3.extent(currArr[dataAccessor], valueAccessor)
            prevArr.push(extentArr[0])
            prevArr.push(extentArr[1])
            return prevArr
          }, [])
        )
      }

      /* Scales */
      const xScale = d3.scaleTime().range([0, width])
      const yScale = d3.scaleLinear().rangeRound([height, 0])

      xScale.domain(
        nestedExtent(this.slices, intervalName, d => new Date(d.key))
      )
      yScale.domain([
        0,
        nestedExtent(this.slices, intervalName, d => d.value)[1]
      ])

      /* Axis */
      const yAxis = d3.axisLeft().ticks(5).scale(yScale) // .ticks(slices[0].values.length)
      const xAxis = d3
        .axisBottom()
        .ticks(8)
        // .ticks(d3.timeDay.every(1))
        // .tickFormat(d3.timeFormat('%b %d'))
        .scale(xScale)

      svg
        .append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
      svg
        .append('g')
        .attr('class', 'yAxis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('dy', '.75em')
        .attr('y', -50)
        .style('text-anchor', 'end')
        .text(this.yLabel)

      /* GridLayout */
      d3.selectAll('g.yAxis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0)
      /*
      d3.selectAll('g.xAxis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', -height)
        .attr('x2', 0)
        .attr('y2', 0)
      */
      /* Color Scale */
      const keys = this.slices.map(d => d.id)
      const color = d3.scaleOrdinal().domain(keys).range(d3.schemeDark2)

      /* Legend */
      const legend = svg.selectAll('.legend').data(keys).enter().append('g')
      // add circles
      legend
        .append('circle')
        .attr('r', 7)
        .attr('cx', -20)
        .attr('cy', -40)
        .attr('fill', d => color(d))
      // add text
      legend
        .append('text')
        .attr('x', -5)
        .attr('y', -37)
        .text(function (d) {
          return d
        })
      // space the groups depending on their size
      legend.attr('transform', (d, i) => {
        const x = d3.sum(keys, (e, j) =>
          j < i ? legend.nodes()[j].getBBox().width : 0
        )
        return (
          'translate(' +
          (x + this.legendOffset + this.legendPadding * i) +
          ',0)'
        )
      })

      /* Tooltip */
      d3.select('#' + this.graphId + '.tooltip').remove()
      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', this.graphId)
        .style('opacity', 0)

      const that = this
      const f = d3.format(this.valueFormat)
      function showTooltip(evt, d) {
        tooltip.transition().duration(60).style('opacity', 0.98)
        tooltip
          .html(
            '<b>' +
              that.intervals[intervalName].format(new Date(d.key)) +
              '</b><br/>' +
              f(d.value)
          ) // d.name
          .style('left', evt.pageX - 55 + 'px')
          .style('top', evt.pageY - 45 + 'px')
      }

      function hideTooltip() {
        tooltip.transition().duration(60).style('opacity', 0)
      }
      /* Line */
      const line = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x(d => xScale(new Date(d.key)))
        .y(d => yScale(d.value))

      /* Draw lines */
      const lines = svg.selectAll('lines').data(this.slices).enter().append('g')
      const path = lines
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => color(d.id))
        .attr('stroke-width', this.lineWidth)
        .attr('d', d => line(d[intervalName]))

      path
        .attr('stroke-dashoffset', function () {
          return d3.select(this).node().getTotalLength()
        })
        .attr('stroke-dasharray', function () {
          return d3.select(this).node().getTotalLength()
        })
        .transition()
        .duration(5000)
        .ease(d3.easeSin)
        .attr('stroke-dashoffset', 0)

      /* Draw points */
      const points = lines
        .selectAll('circle')
        .data(d =>
          d[intervalName].map(v => {
            v.color = color(d.id)
            v.name = d.id
            return v
          })
        )
        .enter()
        .append('circle')

      points
        .attr('stroke', d => d.color)
        .attr('fill', 'white')
        .attr('stroke-width', this.dotWidth)
        .attr('cy', d => yScale(d.value))
        .attr('cx', d => xScale(new Date(d.key)))
        .transition()
        .duration(1500)
        .delay((d, i) => i * 100 + 500)
        .ease(d3.easeSin)
        .attr('cy', d => yScale(d.value))
        .attr('cx', d => xScale(new Date(d.key)))
        .attr('r', this.dotRadius)
        .attr('class', 'datapoint')
        .attr('id', (d, i) => i)
        .style('opacity', 1)

      const radius = this.dotRadius
      points.on('mouseover', function (evt, d) {
        d3.select(this)
          .attr('fill', d => d.color)
          .transition()
          .duration(60)
          .attr('r', radius + 5)
        showTooltip(evt, d)
      })
      points.on('mouseleave', function () {
        d3.select(this)
          .attr('fill', 'white')
          .transition()
          .duration(60)
          .attr('r', radius)
        hideTooltip()
      })
    }
  }
}
</script>
<style>
/* AXES */
/* ticks */
.xAxis line,
.yAxis line {
  stroke: #706f6f;
  stroke-width: 0.5;
  shape-rendering: geometricPrecision;
}

/* axis contour */
.xAxis path,
.yAxis path {
  stroke: #706f6f;
  stroke-width: 0.7;
  shape-rendering: geometricPrecision;
}

.yAxis path {
  display: none;
}

/* axis text */
.xAxis text,
.yAxis text {
  fill: #2b2929;
  font-size: 1rem;
  font-weight: 300;
}

.gridline {
  stroke: lightgray;
  shape-rendering: geometricPrecision;
  stroke-opacity: 0.5;
  stroke-width: 10;
}

div.tooltip {
  position: absolute;
  text-align: center;
  width: 110px;
  height: 30px;
  padding: 2px;
  font: 12px sans-serif;
  background: white;
  color: #565656;
  border: 0px;
  border-radius: 2px;
  pointer-events: none;
  box-shadow: 0 0px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
</style>
