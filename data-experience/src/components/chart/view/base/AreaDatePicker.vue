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
      margin: { top: 50, right: 20, bottom: 20, left: 50 },
      dateParser: d => new Date(d),
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
      // d3.select(`#AreaDatePicker-${this._uid} svg`).remove()
      const svg = d3.select(`#AreaDatePicker-${this._uid}`)
        .append('svg')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.top + this.margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')

      // Add X axis --> it is a date format
      const x = d3.scaleTime()
        .domain(d3.extent(this.aggValues, d => d.key))
        .range([0, width])

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, d3.max(this.aggValues, d => d.value)])
        .range([height, 0])

      svg.append('g')
        .call(d3.axisLeft(y))

      // Add the area
      svg.append('path')
        .datum(this.aggValues)
        .attr('fill', '#cce5df')
        .attr('stroke', '#69b3a2')
        .attr('stroke-width', 1.5)
        .attr('d', d3.area()
          .curve(d3.curveMonotoneX)
          .x(d => x(d.key))
          .y0(y(0))
          .y1(d => y(d.value))
        )

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

      const brush = d3.brushX()
        .extent([[0, 0], [width, height]])
        .on('start brush end', ({ selection }) => {
          if (selection === null) {
            console.log('Selection NULL')
          } else {
            this.$emit('input', selection.map(v => x.invert(v)))
            console.log('Emitted', selection.map(v => x.invert(v)))
          }
          svg.select('.brush').call(brushHandle, selection)
        })
      svg.append('g')
        .attr('class', 'brush')
        .call(brush)
        .call(brush.move, this.value.map(v => x(v)))
    }
  }
}
</script>
