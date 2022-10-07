<template>
  <VContainer v-if="validProps">
    <p class="overline font-weight-bold text-subtitle-1 text-center">
      {{ title }}
    </p>
    <div :id="graphId" style="position: relative" />
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    groupsAccessor: {
      type: String,
      required: true
    },
    valuesAccessor: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    margin: {
      type: Number,
      default: 5
    },
    adjVertical: {
      type: Array,
      default: () => [20, 50]
    },
    adjHorizontal: {
      type: Array,
      default: () => [150, 150]
    },
    xLabel: {
      type: String,
      default: 'Sexual Orientation'
    },
    yLabel: {
      type: String,
      default: 'Number of action per day and user'
    },
    formatNumber: {
      type: String,
      default: '.2f'
    },
    colorPalette: {
      type: Array,
      default: () => ['#69B3A2', '#C23636', '#67A4BF']
    }
  },
  data() {
    return {}
  },
  computed: {
    validProps() {
      let valid = true
      if (!this.values.length) {
        console.error('Values is empty')
        return false
      }
      if (!Object.keys(this.values[0]).includes(this.groupsAccessor)) {
        console.error('Group Accessor not found:', this.groupsAccessor)
        valid = false
      }

      this.valuesAccessor.forEach((accessor) => {
        if (!Object.keys(this.values[0]).includes(accessor)
        ) {
          console.error('X Accessor not found:', accessor)
          valid = false
        }
      })
      return valid
    }
  },
  methods: {
    drawViz() {
      try {
      /* create svg element */
        const width = 500
        const height = 380
        const formatNumber = d3.format(this.formatNumber)
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
          .style('margin', this.margin)
          .classed('svg-content', true)

        // List of unique groups
        const groups = [...new Set(this.values.map(d => d[this.groupsAccessor]))]

        // Add X axis
        const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2])
        this.svg
          .append('g')
          .attr('class', 'xAxis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x).tickSize(0))
          .append('text')
          .attr('y', 30)
          .attr('x', width / 2)
          .style('text-anchor', 'middle')
          .text(this.xLabel)

        // Add Y axis
        const max = d3.max(this.values, d => Math.max(...this.valuesAccessor.map(c => d[c])))
        const y = d3.scaleLinear().domain([0, max]).range([height, 0])
        this.svg
          .append('g')
          .attr('class', 'yAxis')
          .call(d3.axisLeft(y))
          .append('text')
          .attr('dy', '.75em')
          .attr('y', -50)
          .attr('x', -height / 2)
          .attr('transform', 'rotate(-90)')
          .style('text-anchor', 'middle')
          .text(this.yLabel)

        // Another scale for subgroup position?
        const xSubgroup = d3
          .scaleBand()
          .domain(this.valuesAccessor)
          .range([0, x.bandwidth()])
          .padding([0.05])

        // color palette = one color per subgroup
        const color = d3
          .scaleOrdinal()
          .domain(this.valuesAccessor)
          .range(this.colorPalette)

        // Show the bars
        this.svg
          .append('g')
          .selectAll('g')
        // Enter in data = loop group per group
          .data(this.values)
          .enter()
          .append('g')
          .attr('transform', d => 'translate(' + x(d[this.groupsAccessor]) + ',0)')
          .selectAll('rect')
          .data(d => this.valuesAccessor.map(function(key) {
            return { key, value: d[key] }
          }))
          .enter()
          .append('rect')
          .attr('x', d => xSubgroup(d.key))
          .attr('y', function(d) {
            return y(d.value)
          })
          .attr('width', xSubgroup.bandwidth())
          .attr('height', d => height - y(d.value))
          .attr('fill', d => color(d.key))
          .on('mouseover', function(evt, d) {
            d3.select(this).style('opacity', 0.7)
            d3.select(this.parentNode)
              .append('text')
              .attr('class', 'barsLabel')
              .text(formatNumber(d.value))
              .attr('text-anchor', 'middle')
              .attr('alignment-baseline', 'middle')
              .attr('x', xSubgroup(d.key) + xSubgroup.bandwidth() / 2)
              .attr('y', y(d.value) - 10)
              .style('font-size', '0.8rem')
              .style('font-weight', 'bold')
              .style('fill', '#0A0A0A')
          })
          .on('mouseleave', function(evt, d) {
            d3.select(this).style('opacity', 1)
            d3.select('.barsLabel').remove()
          })

        // Add one dot in the legend for each name.
        const size = 10
        const positionX = width - 20
        const positionY = 0
        this.svg.selectAll('legendSquare')
          .data(this.valuesAccessor)
          .enter()
          .append('rect')
          .attr('x', positionX)
          .attr('y', function(d, i) { return positionY + i * (size + 5) })
          .attr('width', size)
          .attr('height', size)
          .style('fill', function(d) { return color(d) })

        // Add one label in the legend for each square
        this.svg.selectAll('legendLabels')
          .data(this.valuesAccessor)
          .enter()
          .append('text')
          .attr('x', positionX + size * 1.2)
          .attr('y', function(d, i) { return positionY + i * (size + 5) + (size / 2) })
          .style('fill', function(d) { return color(d) })
          .text(function(d) { return d })
          .attr('text-anchor', 'left')
          .style('alignment-baseline', 'middle')
      } catch (e) {
        console.error(e)
      }
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
</style>
