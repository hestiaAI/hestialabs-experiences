<template>
  <VContainer>
    <VRow>
      <VCol cols="12" md="7">
        <p class="text-h6">Number of dated events in your files</p>
        <p
          v-if="currValues.length === 0 && !currMinDate && !currMaxDate"
          class="text-subtitle-2"
        >
          No dated events were found in your file(s).
        </p>
        <p v-else class="text-subtitle-2">
          From
          <strong>{{ currMinDate }}</strong> to
          <strong>{{ currMaxDate }}</strong> we found
          <strong>{{ currValues.length }}</strong> dated events in your file(s).
        </p>
      </VCol>
    </VRow>
    <ChartViewVRowWebShare>
      <VCol cols="12">
        <DatePicker
          v-if="minDate !== null && maxDate !== null"
          class="d-flex justify-end mr-3"
          :min-date="minDate"
          :max-date="maxDate"
        ></DatePicker>
        <div :id="graphId"></div>
      </VCol>
    </ChartViewVRowWebShare>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    valueFormat: {
      type: String,
      default: () => '~s'
    },
    dateFormat: {
      type: String,
      default: () => null
    },
    dateAccessor: {
      type: String,
      default: () => 'date'
    },
    // if not set will just count the rows
    valueAccessor: {
      type: String,
      default: () => null
    },
    margin: {
      type: Object,
      default() {
        return { left: 50, right: 50, top: 10, bottom: 50 }
      }
    },
    width: {
      type: Number,
      default: () => 600
    },
    height: {
      type: Number,
      default: () => 150
    },
    brushHeight: {
      type: Number,
      default: () => 30
    },
    brushTopMargin: {
      type: Number,
      default: () => 30
    },
    maxNumBars: {
      type: Number,
      default: () => 50
    }
  },
  data() {
    return {
      currValues: [],
      currMinDate: null,
      currMaxDate: null,
      minDate: null,
      maxDate: null,
      dateParser: null,
      intervals: {
        Days: {
          parser: d3.timeDay,
          format: d3.timeFormat('%B %d, %Y')
        },
        Weeks: {
          parser: d3.timeWeek,
          format: d3.timeFormat('%B %d, %Y')
        },
        Months: {
          parser: d3.timeMonth,
          format: d3.timeFormat('%B %Y')
        },
        Years: {
          parser: d3.timeYear,
          format: d3.timeFormat('%Y')
        }
      }
    }
  },
  methods: {
    aggPerTimePeriod() {
      // Filter data for curr interval
      this.currValues = this.values.filter(
        d =>
          this.dateParser(d[this.dateAccessor]) > this.currMinDate &&
          this.dateParser(d[this.dateAccessor]) < this.currMaxDate
      )

      // Choose interval aggregator
      const diffDays = d3.timeDay.count(this.currMinDate, this.currMaxDate)
      let interval = null
      if (diffDays < this.maxNumBars) interval = this.intervals.Days
      else if (diffDays < 7 * this.maxNumBars) interval = this.intervals.Weeks
      else if (diffDays < 31 * this.maxNumBars) interval = this.intervals.Months
      else if (diffDays < 360 * this.maxNumBars) interval = this.intervals.Years

      // Aggregate data
      this.currValues = nest()
        .key(d => interval.parser(this.dateParser(d[this.dateAccessor])))
        .rollup(leaves => leaves.length) // count nb rows
        .entries(this.currValues)
        .sort((a, b) =>
          d3.descending(this.dateParser(a.key), this.dateParser(b.key))
        )
    },
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
      this.minDate = extent[0]
      this.maxDate = extent[1]
      this.currMinDate = extent[0]
      this.currMaxDate = extent[1]

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
        .on('brush end', brushed)

      // init zoom
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

      this.aggPerTimePeriod()
      x.domain([this.currMinDate, this.currMaxDate])
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
      /*
      svg
        .append('rect')
        .attr('class', 'zoom')
        .attr('width', this.width)
        .attr('height', this.height)
        .call(zoom)
      */
      function brushed(evt) {
        d3.select(this).call(brushHandle, evt.selection)
        if (!evt.sourceEvent) return // ignore brush-by-zoom
        const s = evt.selection || xBrush.range()
        x.domain(s.map(xBrush.invert, xBrush))
        focus.select('.area').attr('d', area)
        focus.select('.line').attr('d', line)
        focus.selectAll('.point').attr('cx', d => x(new Date(d.key)))
        focus.select('.xAxis').call(xAxis)
        svg
          .select('.zoom')
          .call(
            zoom.transform,
            d3.zoomIdentity
              .scale(this.width / (s[1] - s[0]))
              .translate(-s[0], 0)
          )
      }

      function zoomed(evt) {
        if (!evt.sourceEvent) return // ignore zoom-by-brush
        const t = evt.transform
        x.domain(t.rescaleX(xBrush).domain())
        focus.select('.area').attr('d', area)
        focus.select('.xAxis').call(xAxis)
        context.select('.brush').call(brush.move, x.range().map(t.invertX, t))
      }
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
  pointer-events: all;
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
