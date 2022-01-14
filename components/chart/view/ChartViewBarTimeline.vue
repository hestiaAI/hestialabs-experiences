<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="10">
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
    <ChartViewVRowWebShare justify="center">
      <VCol cols="12" md="10">
        <DatePicker
          v-if="dataDomain !== null"
          class="d-flex justify-end mr-3"
          :min-date="dataDomain[0]"
          :max-date="dataDomain[1]"
          @change="updateBrush"
        ></DatePicker>
        <div :id="graphId"></div>
      </VCol>
    </ChartViewVRowWebShare>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
// import { addMissingDate } from './utils/D3Helpers'
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
        return { left: 40, right: 10, top: 10, bottom: 50 }
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
        Hours: {
          parser: d3.timeHour,
          format: d3.timeFormat('%B %d, %Y at %H:00'),
          name: 'hours'
        },
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
      if (diffDays * 24 < this.maxDots) {
        return this.intervals.Hours
      } else if (diffDays < this.maxDots) {
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
      return this.interval === undefined
        ? 0
        : d3.sum(this.interval.values, d => d.value)
    }
  },
  methods: {
    // Aggregate per time interval
    timeAggregate(interval) {
      return nest()
        .key(d => interval.parser.floor(this.dateParser(d[this.dateAccessor])))
        .rollup(leaves => leaves.length) // count nb rows
        .entries(this.values)
        .sort((a, b) =>
          d3.descending(this.dateParser(a.key), this.dateParser(b.key))
        )
    },
    // Init TODO: method should change name
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
      this.chartDomain = this.dataDomain
      this.brushDomain =
        this.brushDomain === null ? this.dataDomain : this.brushDomain

      // Precompute aggregation for each time period
      Object.entries(this.intervals).forEach(([name, interval]) => {
        this.intervals[name].values = this.timeAggregate(interval)
      })

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

      // Init scales,
      // Focus is the main graph, Context is the date selector
      this.xFocus = d3.scaleTime().range([0, this.width])
      this.yFocus = d3
        .scaleLinear()
        .range([this.height - this.brushHeight - this.brushTopMargin, 0])
      this.xContext = d3.scaleTime().range([0, this.width])
      this.yContext = d3.scaleLinear().range([this.brushHeight, 0])

      // Init axises
      this.xAxisFocus = d3.axisBottom(this.xFocus)
      this.yAxisFocus = d3.axisLeft(this.yFocus)
      this.xAxisContext = d3.axisBottom(this.xContext)

      // Init brush
      this.brush = d3
        .brushX()
        .extent([
          [0, 0],
          [this.width, this.brushHeight]
        ])
        .on('brush end', evt => {
          d3.select('.brush').call(this.brushHandle, evt.selection)
          const s = evt.selection || this.xContext.range()
          const domain = s.map(this.xContext.invert, this.xContext)
          // change chart domain, will trigger interval function then draw function
          this.chartDomain = domain
          this.draw()
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
      // Init graphs functions
      this.lineFocus = d3
        .line()
        .curve(d3.curveMonotoneX)
        .x(d => this.xFocus(new Date(d.key)))
        .y(
          d =>
            this.height -
            this.brushHeight -
            this.brushTopMargin -
            this.yFocus(d.value)
        )

      this.areaFocus = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => this.xFocus(new Date(d.key)))
        .y0(this.height - this.brushHeight - this.brushTopMargin)
        .y1(
          d =>
            this.height -
            this.brushHeight -
            this.brushTopMargin -
            this.yFocus(d.value)
        )

      this.areaContext = d3
        .area()
        .curve(d3.curveMonotoneX)
        .x(d => this.xContext(new Date(d.key)))
        .y0(this.height)
        .y1(d => this.height - this.yContext(d.value))

      // Init clip
      svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', this.width)
        .attr('height', this.height)

      // Create containers for focus and context graph
      this.focus = svg.append('g').attr('class', 'focus')
      this.context = svg.append('g').attr('class', 'context')

      // Containers for axises
      this.focus
        .append('g')
        .attr('class', 'axis xAxis')
        .attr(
          'transform',
          'translate(0,' +
            (this.height - this.brushHeight - this.brushTopMargin) +
            ')'
        )
      this.focus.append('g').attr('class', 'axis yAxis')
      this.context
        .append('g')
        .attr('class', 'axis xAxis xAxisContext')
        .attr('transform', 'translate(0,' + this.height + ')')

      // Containers for graphs
      this.focus.append('path').attr('class', 'area')
      this.focus.append('path').attr('class', 'line')
      this.context.append('path').attr('class', 'area')

      this.gBrush = this.context
        .append('g')
        .attr('class', 'brush')
        .attr(
          'transform',
          'translate(0,' + (this.height - this.brushHeight) + ')'
        )
        .call(this.brush)

      this.brushHandle = (g, selection) => {
        const s = selection || this.xBrush.range()
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
      this.gBrush.call(this.brush.move, this.xFocus.range())
    },
    draw() {
      // Updates charts scale domain
      this.xFocus.domain(this.chartDomain)
      this.yFocus.domain([0, d3.max(this.interval.values, d => d.value)])
      this.xContext.domain(this.brushDomain)
      this.yContext.domain([0, 100]) // TODO: Change that

      // Update axis
      this.focus.select('.xAxis').call(this.xAxisFocus)
      this.focus.select('.yAxis').call(this.yAxisFocus)
      this.context.select('.xAxisContext').call(this.xAxisContext)

      // Update charts
      this.focus.select('path.area').data([this.interval.values])
      this.focus.select('path.area').attr('d', this.areaFocus)
      this.focus.select('path.line').data([this.interval.values])
      this.focus.select('path.line').attr('d', this.lineFocus)
      this.context.select('path.area').data([this.intervals.Months.values])
      this.context.select('path.area').attr('d', this.areaContext)
      /*
      this.focus
        .selectAll('.point')
        .data(
          this.interval.values.filter(
            d =>
              this.dateParser(d[this.dateAccessor]) > this.chartDomain[0] &&
              this.dateParser(d[this.dateAccessor]) < this.chartDomain[1]
          )
        )
        .enter()
        .append('circle')
        .attr('class', 'point')
        .attr(
          'cy',
          d =>
            this.height -
            this.brushHeight -
            this.brushTopMargin -
            this.yFocus(d.value)
        )
        .attr('cx', d => this.xFocus(new Date(d.key)))
        .attr('r', d => 2.5)
        */
    },
    updateBrush(dates) {
      this.brushDomain = [new Date(dates[0]), new Date(dates[1])]
      this.drawViz()
      console.log(dates)
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
