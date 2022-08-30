<template>
  <VRow>
    <VCol cols="12" md="8" offset-md="2">
      <VRow dense>
        <VCol cols="9">
          <p class="text-h6">
            {{ title }}
          </p>
        </VCol>
        <VSpacer />
        <VCol cols="3" class="text-right">
          <VSelect
            v-if="filters.length === 0"
            v-model="selectedInterval"
            :items="namesInterval"
            :label="$t('Time interval')"
            dense
            @change="
              applyFilters()
              draw()
            "
          />
          <VDialog
            v-if="filters.length > 0"
            v-model="settingDialog"
            persistent
            max-width="300px"
          >
            <template #activator="{ on, attrs }">
              <VBtn
                color="primary"
                dark
                small
                fab
                v-bind="attrs"
                v-on="on"
              >
                <VIcon small>
                  $vuetify.icons.mdiTuneVariant
                </VIcon>
              </VBtn>
            </template>
            <VCard>
              <VCardTitle>
                <span class="text-h5">Settings/Filters</span>
              </VCardTitle>
              <VCardText>
                <VContainer>
                  <VRow>
                    <VCol cols="6" sm="12">
                      <VSelect
                        v-model="selectedInterval"
                        :items="namesInterval"
                        :label="$t('Time interval')"
                        dense
                      />
                    </VCol>
                    <VCol
                      v-for="filter in filters"
                      :key="filter.value"
                      cols="6"
                      sm="12"
                    >
                      <VSelect
                        v-model="filterModel[filter.value]"
                        :items="
                          filterItems[filter.value]
                            ? filterItems[filter.value]
                            : []
                        "
                        :label="filter.text"
                        dense
                      />
                    </VCol>
                  </VRow>
                </VContainer>
              </VCardText>
              <VCardActions>
                <VSpacer />
                <VBtn color="red darken-1" text @click="resetFilters()">
                  Reset
                </VBtn>
                <VBtn color="blue darken-1" text @click="settingDialog = false">
                  Close
                </VBtn>
                <VBtn
                  color="blue darken-1"
                  text
                  @click="
                    settingDialog = false
                    applyFilters()
                    draw()
                  "
                >
                  Save
                </VBtn>
              </VCardActions>
            </VCard>
          </VDialog>
        </VCol>
      </VRow>
      <ChartViewVRowWebShare dense>
        <VCol cols="12">
          <div :id="graphId" />
        </VCol>
      </ChartViewVRowWebShare>
    </VCol>
  </VRow>
</template>

<script>
import * as d3 from 'd3'
import { nest } from 'd3-collection'
import { addMissingDate } from './utils/D3Helpers'
import mixin from './mixin'

// Inspired by
// https://datawanderings.com/2019/10/28/tutorial-making-a-line-chart-in-d3-js-v-5/
export default {
  mixins: [mixin],
  props: {
    dateAccessor: {
      type: Object,
      required: true
    },
    seriesAccessor: {
      type: Object,
      required: true
    },
    // if not set will just count the rows
    valueAccessor: {
      type: String,
      default: () => null
    },
    valueFormat: {
      type: String,
      default: () => '~s'
    },
    yLabel: {
      type: String,
      default: () => 'Count'
    },
    filters: {
      type: Array,
      default: () => []
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
    adj: {
      type: Number,
      default: () => 70
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
    },
    dateFormat: {
      type: String,
      default: ''
    },
    cumSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slices: [],
      selectedInterval: null,
      intervals: {},
      namesInterval: [],
      settingDialog: false,
      filterItems: {},
      filterModel: {},
      extentDate: null,
      dateParser: d => new Date(d)
    }
  },
  methods: {
    initFilters() {
      this.filters.forEach((filter) => {
        this.filterItems[filter.value] = []
        // get unique ids and set items for each filter select
        this.filterItems[filter.value] = this.values
          .map(i => i[filter.value])
          .filter((value, index, self) => self.indexOf(value) === index)
      })
    },
    resetFilters() {
      this.filters.forEach((filter) => {
        this.filterModel[filter.value] = null
      })
    },
    applyFilters() {
      this.slices.forEach((serie) => {
        // aggregate per selected time interval and other filters
        const interval = this.intervals[this.selectedInterval]
        const filters = Object.keys(this.filterModel).filter(
          k => this.filterModel[k] != null
        )
        // filter according to selection
        serie.current = serie.values.filter((d) => {
          return filters.every(f => this.filterModel[f] === d[f])
        })
        // Aggregate per time period
        serie.current = nest()
          .key(d => interval.parser(this.dateParser(d.date)))
          .rollup(leaves => d3.sum(leaves, l => l.value))
          .entries(serie.current)
        // Add missing datapoints
        serie.current = addMissingDate(
          serie.current,
          'key',
          'value',
          interval.parser,
          0,
          this.extentDate[0],
          this.extentDate[1]
        )
        // Sort the result
        serie.current = serie.current.sort(
          (e1, e2) => this.dateParser(e1.key) - this.dateParser(e2.key)
        )

        // Compute cumulative sum if needed
        if (this.cumSum) {
          const cumSum = d3.cumsum(serie.current, d => d.value)
          serie.current = serie.current.map((d, idx) => {
            return {
              ...d,
              value: cumSum[idx]

            }
          })
        }
      })
    },
    drawViz() {

      console.log('timeViewSeries says hello')
      /* Init the possible aggregations dpending on dates extent */
      if (this.dateFormat) {
        this.dateParser = d3.timeParse(this.dateFormat)
      }
      this.extentDate = d3.extent(
        this.values,
        d => this.dateParser(d[this.dateAccessor.value])
      )
      const diffDays = d3.timeDay.count(this.extentDate[0], this.extentDate[1])
      if (!diffDays) {
        console.error('Unrecognized Dates')
        return
      }
      if (diffDays < 93) {
        this.intervals.Day = {
          parser: d3.timeDay,
          format: d3.timeFormat('%B %d, %Y')
        }
      }
      if (diffDays > 14 && diffDays < 651) {
        this.intervals.Week = {
          parser: d3.timeWeek,
          format: d3.timeFormat('%B %d, %Y')
        }
      }
      if (diffDays > 62 && diffDays < 1800) {
        this.intervals.Month = {
          parser: d3.timeMonth,
          format: d3.timeFormat('%B %Y')
        }
      }
      if (diffDays > 730) {
        this.intervals.Year = {
          parser: d3.timeYear,
          format: d3.timeFormat('%Y')
        }
      }
      this.namesInterval = Object.keys(this.intervals).map(value => ({
        value,
        text: this.$tc(value, 2)
      }))
      // get unique series ids
      const ids = this.values
        .map(i => i[this.seriesAccessor.value])
        .filter((value, index, self) => self.indexOf(value) === index)
      // group by series ids and sort values
      this.slices = ids.map((a) => {
        return {
          id: a,
          values: this.values
            .filter(v => a === v[this.seriesAccessor.value])
            .map((d) => {
              const ret = {
                date: this.dateParser(d[this.dateAccessor.value]),
                value: this.valueAccessor ? +d[this.valueAccessor] : 1
              }
              this.filters.forEach((f) => {
                ret[f.value] = d[f.value]
              })
              return ret
            })
            .sort((e1, e2) => e1.date - e2.date)
        }
      })

      this.selectedInterval = this.namesInterval.slice(-1)[0].value
      this.initFilters()
      this.applyFilters()
      this.draw()
    },
    draw() {
      const width = 800
      const height = 300
      /* create svg element */
      d3.select('#' + this.graphId + ' svg').remove()
      const svg = d3
        .select('#' + this.graphId)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            this.adj +
            ' -' +
            this.adj +
            ' ' +
            (width + this.adj * 2) +
            ' ' +
            (height + this.adj * 2)
        )
        .style('padding', this.padding)
        .style('margin', this.margin)
        .classed('svg-content', true)
      function nestedExtent(data, dataAccessor, valueAccessor) {
        return d3.extent(
          data.reduce(function(prevArr, currArr) {
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
      xScale.domain(nestedExtent(this.slices, 'current', d => this.dateParser(d.key)))
      yScale.domain([0, nestedExtent(this.slices, 'current', d => d.value)[1]])
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
        .attr('y', -60)
        .style('text-anchor', 'end')
        .text(this.yLabel)
      /* GridLayout */
      d3.selectAll('#' + this.graphId + ' g.yAxis g.tick')
        .append('line')
        .attr('class', 'gridline')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0)
      /*
      d3.selectAll('#' + this.graphId + ' g.xAxis g.tick')
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
        .text(function(d) {
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
              that.intervals[that.selectedInterval].format(this.dateParser(d.key)) +
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
        .x(d => xScale(this.dateParser(d.key)))
        .y(d => yScale(d.value))
      /* Draw lines */
      const lines = svg.selectAll('lines').data(this.slices).enter().append('g')
      const path = lines
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', d => color(d.id))
        .attr('stroke-width', this.lineWidth)
        .attr('d', d => line(d.current))
      path
        .attr('stroke-dashoffset', function() {
          return d3.select(this).node().getTotalLength()
        })
        .attr('stroke-dasharray', function() {
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
          d.current.map((v) => {
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
        .attr('cx', d => xScale(this.dateParser(d.key)))
        .transition()
        .duration(1500)
        .delay((d, i) => i * 100 + 500)
        .ease(d3.easeSin)
        .attr('cy', d => yScale(d.value))
        .attr('cx', d => xScale(this.dateParser(d.key)))
        .attr('r', this.dotRadius)
        .attr('class', 'datapoint')
        .attr('id', (d, i) => i)
        .style('opacity', 1)
      const radius = this.dotRadius
      points.on('mouseover', function(evt, d) {
        d3.select(this)
          .attr('fill', d => d.color)
          .transition()
          .duration(60)
          .attr('r', radius + 5)
        showTooltip(evt, d)
      })
      points.on('mouseleave', function() {
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
<style scoped>
/* AXES */
/* ticks */
div ::v-deep .xAxis line,
div ::v-deep .yAxis line {
  stroke: #706f6f;
  stroke-width: 0.5;
  shape-rendering: geometricPrecision;
}
/* axis contour */
div ::v-deep .xAxis path,
div ::v-deep .yAxis path {
  stroke: #706f6f;
  stroke-width: 0.7;
  shape-rendering: geometricPrecision;
}
div ::v-deep .yAxis path {
  display: none;
}
/* axis text */
div ::v-deep .xAxis text,
div ::v-deep .yAxis text {
  fill: #2b2929;
  font-size: 1rem;
  font-weight: 300;
}
div ::v-deep .gridline {
  stroke: lightgray;
  shape-rendering: geometricPrecision;
  stroke-opacity: 0.5;
  stroke-width: 10;
}
</style>
<style>
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
