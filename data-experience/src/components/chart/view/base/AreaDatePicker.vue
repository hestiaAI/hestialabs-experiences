<template>
  <div>
    <div :id="`AreaDatePicker-${ _uid }`"></div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
// import { addMissingDate } from '../utils/d3-helpers'

export default {
  props: {
    value: {
      type: Array,
      default: null
    },
    values: {
      type: Array,
      default: () => []
    },
    dateAccessor: {
      type: String,
      default: 'date'
    },
    valueAccessor: {
      type: String,
      default: 'value'
    }
  },
  data() {
    return {
      margin: { top: 50, right: 50, bottom: 20, left: 50 },
      dateParser: d => new Date(d),
      dateFormatter: d3.timeFormat('%d %b %Y'),
      intervals: {
        Day: {
          parser: d3.timeDay,
          format: d3.timeFormat('%B %d, %Y')
        },
        Week: {
          parser: d3.timeWeek,
          format: d3.timeFormat('%B %d, %Y')
        },
        Month: {
          parser: d3.timeMonth,
          format: d3.timeFormat('%B %Y')
        },
        Year: {
          parser: d3.timeYear,
          format: d3.timeFormat('%Y')
        }
      }
    }
  },
  computed: {
    results() {
      return this.values.map((v) => {
        return {
          ...v,
          [this.valueAccessor]: v[this.valueAccessor] || 1,
          [this.dateAccessor]: this.dateParser(v[this.dateAccessor])
        }
      })
    },
    dateExtent() {
      return d3.extent(this.results, d => d[this.dateAccessor])
    },
    interval() {
      const diffDays = d3.timeDay.count(this.dateExtent[0], this.dateExtent[1])
      if (diffDays > 365 * 20) {
        return this.intervals.Year
      } else if (diffDays > 30 * 20) {
        return this.intervals.Month
      } else if (diffDays > 7 * 20) {
        return this.intervals.Week
      } else {
        return this.intervals.Day
      }
    },
    aggValues() {
      // Aggregate per time period
      let values = nest()
        .key(d => this.interval.parser(d[this.dateAccessor]))
        .rollup(v => d3.sum(v, d => d[this.valueAccessor]))
        .entries(this.results)
        .map((v) => { return { key: new Date(v.key), value: +v.value } })

      // Add missing datapoints
      // values = addMissingDate(values, 'key', 'value', this.interval.parser, 0, this.dateExtent[0], this.dateExtent[1])

      // Sort the result
      values = values.sort((e1, e2) => this.dateParser(e1.key) - this.dateParser(e2.key))

      return values
    }
  },
  watch: {
    aggValues() {
      this.drawViz()
    }
  },
  mounted() {
    this.drawViz()
  },
  methods: {
    drawViz() {
      const width = d3
        .select(`#AreaDatePicker-${this._uid}`)
        .node()
        .getBoundingClientRect().width -
        this.margin.right - this.margin.left
      const height = 100

      // Create svg container
      d3.select(`#AreaDatePicker-${this._uid} svg`).remove()
      const svg = d3.select(`#AreaDatePicker-${this._uid}`)
        .append('svg')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

      // Create Time scale
      const x = d3.scaleTime()
        .domain(d3.extent(this.aggValues, d => d.key))
        .range([0, width])

      // Add x Axis
      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // Create Value scale
      const y = d3.scaleLinear()
        .domain([0, d3.max(this.aggValues, d => d.value)])
        .range([height, 0])

      // Add Y axis
      svg.append('g')
        .call(d3.axisLeft(y).ticks(4))

      // Add the area graph
      svg.append('path')
        .datum(this.aggValues)
        .attr('fill', '#cce5df')
        .attr('stroke', '#69b3a2')
        .attr('stroke-width', 1.5)
        .attr('d', d3.area()
          .curve(d3.curveMonotoneX)
          // .curve(d3.curveNatural)
          .x(d => x(d.key))
          .y0(y(0))
          .y1(d => y(d.value))
        )

      // Create zoom
      const zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])

      // Create Brush
      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])

      /** BRUSH BEHAVIOR */
      // Customize brush handles
      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius((height) / 10)
        .startAngle(0)
        .endAngle((d, i) => i ? 2 * Math.PI : -2 * Math.PI)

      const brushHandle = (g, selection) => g
        .selectAll('.handle--custom')
        .data([{ type: 'w' }, { type: 'e' }])
        .join(
          enter => enter.append('path')
            .attr('class', 'handle--custom')
            .attr('fill', '#8D9FCA')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .attr('cursor', 'ew-resize')
            .attr('d', arc)
        )
        .attr('display', selection === null ? 'none' : null)
        .attr('transform', selection === null ? null : (d, i) => `translate(${selection[i]},${(height) / 2})`)

      // Add Brush action
      brush
        .on('start brush end', (event) => {
          const selection = event.selection || [0, width]
          const dateExtent = event.selection ? event.selection.map(v => x.invert(v)) : [0, width].map(v => x.invert(v))
          this.$emit('input', dateExtent)
          svg.select('.label-extent-0').text(this.dateFormatter(dateExtent[0]))
          svg.select('.label-extent-1').text(this.dateFormatter(dateExtent[1]))
          svg.select('.brush').call(brushHandle, event.selection)

          if (!event.sourceEvent) return // Don't call zoom if this event were fired by zoom
          svg.call(zoom.transform, d3.zoomIdentity
            .scale(width / (selection[1] - selection[0]))
            .translate(-selection[0], 0))
        })

      // Append brush to graph
      svg.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, this.value.map(v => x(v)))

      /** ZOOM BEHAVIOUR */
      // Add Zoom action
      zoom
        .on('zoom', (event) => {
          if (!event.sourceEvent) return // Don't call brush if this event were fired by brush

          // Update brush
          const t = event.transform
          svg.select('.brush').call(brush.move, x.range().map(t.invertX, t))
        })

      // Append zoom to graph
      svg
        .classed('zoom', true)
        // Add zoom behaviour
        .call(zoom)
        // Disable Pan
        .on('mousedown.zoom', null)
        .on('touchstart.zoom', null)
        .on('touchmove.zoom', null)
        .on('touchend.zoom', null)

      // Add current date range labels
      svg.append('text')
        .attr('class', 'label-extent-0')
        .attr('x', -30)
        .attr('y', -30)
        .attr('dy', '.35em')
        .text(this.dateFormatter(this.value[0]))

      svg.append('text')
        .attr('class', 'label-extent-1')
        .attr('text-anchor', 'end')
        .attr('x', width + 30)
        .attr('y', -30)
        .attr('dy', '.35em')
        .text(this.dateFormatter(this.value[1]))
    }
  }
}
</script>
