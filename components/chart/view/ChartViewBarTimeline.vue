<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="7">
        <p class="text-h6">Number of dated events in your files</p>
        <p v-if="nbDataPoints === 0 && !chartDomain" class="text-subtitle-2">
          No dated events were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          From
          <strong>{{ interval.format(chartDomain[0]) }}</strong> to
          <strong>{{ interval.format(chartDomain[1]) }}</strong> we found
          <strong>{{ nbDataPoints }}</strong> dated events in your file(s).
        </p>
      </VCol>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <DatePicker
          v-if="dataDomain !== null"
          v-model="brushDomain"
          class="d-flex justify-end mr-3"
          :min-date="dataDomain[0]"
          :max-date="dataDomain[1]"
        ></DatePicker>
        <div :id="graphId"></div>
      </VCol>
    </ChartViewVRowWebShare>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import { addMissingDate } from './utils/D3Helpers'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    /*
     * Optional d3 format for the values, see: https://github.com/d3/d3-format
     */
    valueFormat: {
      type: String,
      default: () => '~s'
    },
    /*
     * Optional date format of the data, see: https://github.com/d3/d3-time-format
     * if not specify, will use Javascript Date contructor
     */
    dateFormat: {
      type: String,
      default: () => null
    },
    /*
     * Name of the field where there is the dates, default 'date'
     */
    dateAccessor: {
      type: String,
      default: () => 'date'
    },
    /*
     * Name of the field where there is the values to sum up
     * if not specify, will count the rows
     */
    valueAccessor: {
      type: String,
      default: () => null
    },
    /*
     * Margin to apply on the graph, expect a dict of the form
     * { left: 50, right: 50, top: 10, bottom: 50 }
     */
    margin: {
      type: Object,
      default() {
        return { left: 50, right: 50, top: 10, bottom: 50 }
      }
    },
    /*
     * Width of the graph, we use a viewbox so it will only change the width/height ratio
     */
    width: {
      type: Number,
      default: () => 600
    },
    /*
     * Height of the graph, we use a viewbox so it will only change the width/height ratio
     */
    height: {
      type: Number,
      default: () => 150
    },
    /*
     * Height of the brush in respect to total height
     */
    brushHeight: {
      type: Number,
      default: () => 30
    },
    /*
     * Margin between focus and context (brush) graph
     */
    brushTopMargin: {
      type: Number,
      default: () => 30
    },
    /*
     * Max number of datapoints before we aggregate the data
     */
    maxDots: {
      type: Number,
      default: () => 50
    }
  },
  data() {
    return {
      currValues: [], // The values used by the graphs
      chartDomain: null, // The date range of the focus graph
      brushDomain: null, // The date range of the context (brush) graph
      dataDomain: null, // The initial date range of the data
      dateParser: null, // a Parser for converting date string to dates
      // Supported time aggregations
      intervals: {
        Days: {
          parser: d3.timeDay,
          format: d3.timeFormat('%B %d, %Y'),
          name: 'days'
        },
        Weeks: {
          parser: d3.timeWeek,
          format: d3.timeFormat('%B %d, %Y'),
          name: 'weeks'
        },
        Months: {
          parser: d3.timeMonth,
          format: d3.timeFormat('%B %Y'),
          name: 'months'
        },
        Years: {
          parser: d3.timeYear,
          format: d3.timeFormat('%Y'),
          name: 'years'
        }
      }
    }
  },
  computed: {
    // Compute new interval each time curr date range change
    interval() {
      if (this.chartDomain === null) return
      // Choose interval aggregator
      const diffDays = d3.timeDay.count(...this.chartDomain)
      if (diffDays < this.maxDots) {
        return this.intervals.Days
      } else if (diffDays < 7 * this.maxDots) {
        return this.intervals.Weeks
      } else if (diffDays < 31 * this.maxDots) {
        return this.intervals.Months
      } else {
        return this.intervals.Years
      }
    },
    nbDataPoints() {
      return d3.sum(this.currValues, d => d.value)
    }
  },
  watch: {
    // whenever interval changes, aggregate data with new interval
    interval(newInterval, oldInterval) {
      // if (newInterval === oldInterval || this.chartDomain === null) return
      // Filter data for curr interval
      this.currValues = this.values.filter(
        d =>
          this.dateParser(d[this.dateAccessor]) > this.chartDomain[0] &&
          this.dateParser(d[this.dateAccessor]) < this.chartDomain[1]
      )

      // Aggregate data
      this.currValues = nest()
        .key(d =>
          newInterval.parser.floor(this.dateParser(d[this.dateAccessor]))
        )
        .rollup(leaves => leaves.length) // count nb rows
        .entries(this.currValues)
        .sort((a, b) =>
          d3.descending(this.dateParser(a.key), this.dateParser(b.key))
        )

      // Fill missing values
      this.currValues = addMissingDate(
        this.currValues,
        'key',
        'value',
        newInterval.parser,
        0,
        this.chartDomain[0],
        this.chartDomain[0]
      )

      // Sort the result
      this.currValues = this.currValues.sort(
        (e1, e2) => new Date(e1.key) - new Date(e2.key)
      )

      this.draw()
    }
  },
  methods: {
    // init method should change name
    drawViz() {
      // Use either a predefined date format or Javascript date constructor
      this.dateParser =
        this.dateFormat !== null
          ? d3.timeParse(this.dateFormat)
          : d => new Date(d)
      const extent = d3.extent(this.values, d =>
        this.dateParser(d[this.dateAccessor])
      )

      // Init date ranges
      this.dataDomain = extent
      this.chartDomain = extent
      console.log('initiated')

      // Create svg container
      d3.select('#' + this.graphId + ' svg').remove()
      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            this.margin.left +
            ' -' +
            this.margin.top +
            ' ' +
            (this.width + this.margin.right + this.margin.left) +
            ' ' +
            (this.height + this.margin.top + this.margin.bottom)
        )
        .style('padding', this.padding)
        .style('display', 'block')
        .classed('svg-content', true)

      // Init scales and axis
      const x = d3.scaleTime().range([0, this.width])
      const xBrush = d3.scaleTime().range([0, this.width])
      const y = d3
        .scaleLinear()
        .range([this.height - this.brushHeight - this.brushTopMargin, 0])
      const yBrush = d3.scaleLinear().range([this.brushHeight, 0])

      const xAxis = d3.axisBottom(x)
      const xAxisBrush = d3.axisBottom(xBrush)
      const yAxis = d3.axisLeft(y)

      // init brush
      const brush = d3
        .brushX()
        .extent([
          [0, 0],
          [this.width, this.brushHeight]
        ])
        .on('brush end', evt => {
          const s = evt.selection || xBrush.range()
          const domain = s.map(xBrush.invert, xBrush)
          this.chartDomain = domain

          x.domain(domain)
          focus.select('.xAxis').call(xAxis)
          y.domain([
            0,
            d3.max(this.currValues, function (d) {
              return d.value
            }) + 10
          ])
          focus.select('.yAxis').call(yAxis)
          const areaPath = focus.select('path.area')
          areaPath.data([this.currValues])
          areaPath.attr('d', area)
          const linePath = focus.select('path.line')
          linePath.data([this.currValues])
          linePath.attr('d', line)

          const circles = focus.selectAll('.point').data(this.currValues)
          circles.exit().remove()
          circles.enter().append('circle').attr('class', 'point').attr('r', 2.5)
          circles
            .attr(
              'cy',
              d =>
                this.height -
                this.brushHeight -
                this.brushTopMargin -
                y(d.value)
            )
            .attr('cx', d => x(new Date(d.key)))
          d3.select('.brush').call(brushHandle, evt.selection)
        })

      // init zoom
      /*
      const zoom = d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
          [0, 0],
          [this.width, this.height]
        ])
        .extent([
          [0, 0],
          [this.width, this.height]
        ])
        .on('zoom', zoomed)
      */
      // init both graphs
      const line = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x(d => x(new Date(d.key)))
        .y(
          d => this.height - this.brushHeight - this.brushTopMargin - y(d.value)
        )
      const area = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => x(new Date(d.key)))
        .y0(this.height - this.brushHeight - this.brushTopMargin)
        .y1(
          d => this.height - this.brushHeight - this.brushTopMargin - y(d.value)
        )

      const area2 = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => xBrush(new Date(d.key)))
        .y0(this.height)
        .y1(d => this.height - yBrush(d.value))
      // init brush
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', this.width)
        .attr('height', this.height)

      const focus = svg.append('g').attr('class', 'focus')
      const context = svg.append('g').attr('class', 'context')

      x.domain(this.chartDomain)
      y.domain([0, d3.max(this.currValues, d => d.value)])
      xBrush.domain(x.domain())
      yBrush.domain(y.domain())

      focus
        .append('g')
        .attr('class', 'axis xAxis')
        .attr(
          'transform',
          'translate(0,' +
            (this.height - this.brushHeight - this.brushTopMargin) +
            ')'
        )
        .call(xAxis)

      focus.append('g').attr('class', 'axis yAxis').call(yAxis)
      focus
        .append('path')
        .datum(this.currValues)
        .attr('class', 'area')
        .attr('d', area)

      focus
        .append('path')
        .datum(this.currValues)
        .attr('class', 'line')
        .attr('d', line)
      /*
      focus
        .selectAll('.point')
        .data(this.currValues)
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr(
          'cy',
          d => this.height - this.brushHeight - this.brushTopMargin - y(d.value)
        )
        .attr('cx', d => x(new Date(d.key)))
        .attr('r', d => 2.5)
      */
      context
        .append('path')
        .datum(this.currValues)
        .attr('class', 'area')
        .attr('d', area2)

      context
        .append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(xAxisBrush)

      const gBrush = context
        .append('g')
        .attr('class', 'brush')
        .attr(
          'transform',
          'translate(0,' + (this.height - this.brushHeight) + ')'
        )
        .call(brush)

      const brushHandle = (g, selection) => {
        const s = selection || xBrush.range()
        g.selectAll('.handle--custom-max')
          .data([{ type: 'w' }, { type: 'e' }])
          .join(enter =>
            enter
              .append('rect')
              .attr('class', 'handle--custom-max')
              .attr('fill', '#666')
              .attr('cursor', 'ew-resize')
              .attr('transform', 'translate(-2,8)')
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('height', this.brushHeight)
              .attr('width', 3)
          )
          .attr('display', s === null ? 'none' : null)
          .attr(
            'transform',
            s === null ? null : (d, i) => `translate(${s[i] - 1.5},0)`
          )
        g.selectAll('.handle--custom-min')
          .data([{ type: 'w' }, { type: 'e' }])
          .join(enter =>
            enter
              .append('rect')
              .attr('class', 'handle--custom-min')
              .attr('fill', '#ffff')
              .attr('fill-opacity', 1)
              .attr('stroke', '#666')
              .attr('cursor', 'ew-resize')
              .attr('transform', 'translate(-2,8)')
              .attr('rx', 3)
              .attr('ry', 3)
              .attr('height', this.brushHeight / 3)
              .attr('width', 6)
          )
          .attr('display', s === null ? 'none' : null)
          .attr(
            'transform',
            s === null
              ? null
              : (d, i) => `translate(${s[i] - 3},${this.brushHeight / 3})`
          )
      }
      gBrush.call(brush.move, x.range())
    },
    draw() {
      console.log(this.currValues)
    }
  }
}
</script>
<style scoped>
::v-deep .point {
  stroke: #5f5ba2;
  fill: white;
  stroke-width: 1.5px;
  clip-path: url(#clip);
}
::v-deep .line {
  fill: none;
  stroke: #5f5ba2;
  stroke-width: 1.5px;
  clip-path: url(#clip);
}
::v-deep .selection {
  stroke: none;
  fill: #5f5ba2;
  fill-opacity: 0.1;
}
::v-deep .handle--custom-min {
  stroke: #5f5ba2;
  fill: white;
}

::v-deep .handle--custom-max {
  fill: #5f5ba2;
}
::v-deep .area {
  fill: #5f5ba2;
  opacity: 0.15;
  clip-path: url(#clip);
}

::v-deep .zoom {
  cursor: move;
  fill: none;
}

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
  font-size: 0.5rem;
  font-weight: 300;
}
</style>
