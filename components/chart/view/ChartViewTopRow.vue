<template>
  <VContainer v-if="validProps">
    <VRow dense>
      <VCol cols="12" md="12" class="text-center">
        <p>
          In total we found <strong>{{ total }}</strong> {{ countLabel }}
          <span v-if="minDate && maxDate" class="">
            between <strong>{{ minDate }}</strong> and
            <strong>{{ maxDate }}</strong>
          </span>
        </p>
      </VCol>
    </VRow>
    <VRow justify="center" dense>
      <VCol cols="12" md="7" style="position: relative">
        <VMenu offset-x :close-on-content-click="false">
          <template #activator="{ on, attrs }">
            <VBtn
              icon
              v-bind="attrs"
              style="position: absolute; right: 0; z-index: 10"
              v-on="on"
            >
              <VIcon small> $vuetify.icons.mdiCog </VIcon>
            </VBtn>
          </template>
          <VCard style="width: 300px">
            <VCardTitle>Settings</VCardTitle>
            <VDivider></VDivider>
            <VCardText>
              <VRow class="mt-3">
                <VCol>
                  <VSlider
                    v-model="topKSlider"
                    :label="`N° of ${yLabel}`"
                    thumb-color="primary"
                    thumb-label="always"
                    min="1"
                    :max="Math.min(total, 50)"
                    hide-details
                    dense
                    @change="draw"
                  ></VSlider>
                </VCol>
              </VRow>
              <VRow>
                <VCol>
                  <VCheckbox
                    v-model="othersCheck"
                    dense
                    label="Display Others"
                    hide-details
                    @change="draw"
                  ></VCheckbox>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VMenu>
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
    /**
     * The column name that contains the y values
     */
    yAccessor: {
      type: String,
      required: true // advertiserName
    },
    /**
     * The column name that contains the x values
     * if not set, will count the rows
     */
    xAccessor: {
      type: String,
      default: '' // count,
    },
    /**
     * The column name that contains the dates values
     * if set, will show the date range
     */
    dateAccessor: {
      type: String,
      default: '' // date
    },
    /**
     * Max length of labels on y axis
     */
    yAxisMaxTickLength: {
      type: Number,
      default: 20
    },
    /**
     * Margin
     */
    margin: {
      type: Number,
      default: 5
    },
    /**
     * Vertical padding
     */
    adjVertical: {
      type: Array,
      default: () => [5, 50]
    },
    /**
     * Horizontal padding
     */
    adjHorizontal: {
      type: Array,
      default: () => [150, 150]
    },
    /**
     * Label displayed on xAxis
     */
    countLabel: {
      type: String,
      default: 'records'
    },
    /**
     * Label displayed on xAxis
     */
    xLabel: {
      type: String,
      default: 'records'
    },
    /**
     * Label displayed in the number of bars to display selection
     */
    yLabel: {
      type: String,
      default: 'companies'
    },
    /**
     * Format of the date, if not parsable by new Date, you should
     * specify the format here
     */
    dateFormat: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      total: 0,
      minDate: null,
      maxDate: null,
      records: [],
      topKSlider: null,
      othersCheck: false
    }
  },
  computed: {
    validProps() {
      let valid = true
      if (!this.values.length) {
        console.error('Values is empty')
        valid = false
        return valid
      }
      if (
        this.dateAccessor &&
        !Object.keys(this.values[0]).includes(this.dateAccessor)
      ) {
        console.error('Date Accessor not found')
        valid = false
      }
      if (!Object.keys(this.values[0]).includes(this.yAccessor)) {
        console.error('Y Accessor not found')
        valid = false
      }
      if (
        this.xAccessor &&
        !Object.keys(this.values[0]).includes(this.xAccessor)
      ) {
        console.error('X Accessor not found')
        valid = false
      }
      return valid
    }
  },
  methods: {
    // Update data depending on the current states of the buttons
    draw() {
      const newData = this.records.slice(
        0,
        this.othersCheck ? this.topKSlider - 1 : this.topKSlider
      )
      if (this.othersCheck) {
        newData.push({
          key: 'Others',
          value: d3.sum(this.records.slice(this.topKSlider), d => d.value)
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
        .attr('y', d => this.yScale(d.key))
        .attr('width', d => this.xScale(d.value) + 5)
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
        .style('font-size', 1.8 / Math.log(this.topKSlider) + 'rem')

      d3.select('.xAxis')
        .transition()
        .duration(1000)
        .delay(200)
        .call(this.xAxis)
    },
    drawViz() {
      if (!this.validProps) return
      // Compute date range
      const dateParser = this.dateFormat
        ? d3.timeParse(this.dateFormat)
        : d => new Date(d)

      const formatDate = d3.timeFormat('%B %d, %Y')
      if (this.dateAccessor) {
        const extent = d3.extent(this.values, d => {
          return dateParser(d[this.dateAccessor])
        })
        if (extent[0] && extent[1]) {
          this.minDate = formatDate(extent[0])
          this.maxDate = formatDate(extent[1])
        } else {
          console.error('Unable to parse date fields')
        }
      }

      // Add number of samples
      this.total = !this.xAccessor
        ? this.values.length
        : d3.sum(this.values, d => d[this.xAccessor])

      this.topKSlider = Math.min(20, this.total)
      // Precompute aggregation
      this.records = nest()
        .key(d => d[this.yAccessor])
        .rollup(d => d3.sum(d, l => (this.xAccessor ? l[this.xAccessor] : 1)))
        .entries(this.values)
        .sort(function (a, b) {
          return d3.descending(a.value, b.value)
        })

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
