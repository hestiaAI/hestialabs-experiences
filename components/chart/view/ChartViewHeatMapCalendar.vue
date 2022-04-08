<template>
  <VContainer>
    <div class="overline mb-3">{{ title }}</div>
    <svg class="graph" :viewBox="viewBox">
      <g :transform="`translate(40.5,${cellSize * 1.5})`">
        <g
          v-for="(year, idxYear) in itemsPerDay"
          :key="'week-axis' + idxYear"
          class="week-axis"
        >
          <text
            v-for="(d, idx) in weekDays"
            :key="`d_${idx}`"
            x="-5"
            :y="idxYear * calendarHeight + (idx + 0.5) * cellSize"
            dy="0.35em"
          >
            {{ d }}
          </text>
        </g>
        <g
          v-for="(item, idxYear) in monthsPerYear"
          :key="'month-axis' + idxYear"
          class="month-axis"
        >
          <text
            v-for="(month, idx) in item.months"
            :key="`month_${idx}`"
            :x="xPosMonth(month)"
            :y="idxYear * calendarHeight - 5"
            dy="0.35em"
          >
            {{ formatMonth(month) }}
          </text>
        </g>
        <g class="calendars">
          <g v-for="(year, idxYear) in itemsPerDay" :key="'year_' + idxYear">
            <text
              :x="0.5"
              :y="idxYear * calendarHeight - cellSize"
              style="font-weight: bold; font-size: 12px"
            >
              {{ year[0] }}
            </text>
            <g v-for="(item, idxItem) in year[1]" :key="'day_' + idxItem">
              <rect
                :width="cellSize - cellSpacing"
                :height="cellSize - cellSpacing"
                :x="xPos(year[0], item[0], item[1])"
                :y="idxYear * calendarHeight + item[2] * cellSize + 0.5"
                :fill="color(item[3])"
                :rx="borderRadius"
                :ry="borderRadius"
              ></rect>
              <title>
                {{ generateTitle(year[0], item[0], item[1], item[3]) }}
              </title>
            </g>
          </g>
        </g>

        <g class="legend">
          <text
            style="text-anchor: end"
            :x="width - cellSize * legendNbItems * 3"
            :y="height - cellSize * 2.5"
            dy="-.20em"
          >
            {{ legendLabel }}
          </text>
          <g v-for="(square, idx) in legendSquares" :key="'legend_' + idx">
            <rect
              :width="(cellSize - cellSpacing) * 2"
              :height="(cellSize - cellSpacing) / 2"
              :x="
                width -
                cellSize * legendNbItems * 3 +
                idx * cellSize * 2 +
                cellSize
              "
              :y="height - cellSize * 3"
              :fill="color(square)"
              :rx="borderRadius"
              :ry="borderRadius"
            ></rect>
            <text
              style="text-anchor: middle"
              :x="
                width -
                cellSize * legendNbItems * 3 +
                idx * cellSize * 2 +
                2 * cellSize +
                0.5
              "
              :y="height - cellSize * 2"
            >
              {{ square }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </VContainer>
</template>

<script>
import * as d3 from 'd3'
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    dateAccessor: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: () => ''
    },
    cellSize: {
      type: Number,
      default: () => 20
    },
    cellSpacing: {
      type: Number,
      default: () => 2
    },
    dateFormat: {
      type: String,
      default: () => ''
    },
    valueAccessor: {
      type: String,
      default: () => ''
    },
    borderRadius: {
      type: Number,
      default: () => 3
    },
    legendNbItems: {
      type: Number,
      default: () => 4
    },
    legendLabel: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      weekDays: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
      formatMonth: d3.utcFormat('%b'),
      colorPalette: d3.interpolateRdPu
    }
  },
  computed: {
    width() {
      return this.cellSize * (52 + 3)
    },
    calendarHeight() {
      return this.cellSize * (this.weekDays.length + 4)
    },
    height() {
      return this.calendarHeight * this.itemsPerDay.length
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },
    dateParser() {
      if (this.dateFormat) return d3.timeParse(this.dateFormat)
      else return d => new Date(d)
    },
    items() {
      return this.values.map(v => {
        return {
          date: this.dateParser(v[this.dateAccessor]),
          value: this.valueAccessor ? v[this.valueAccessor] : 1
        }
      })
    },
    extent() {
      return d3.extent(
        this.itemsPerDay.flatMap(y => d3.extent(y[1], i => i[3]))
      )
    },
    color() {
      return d3
        .scaleSequential()
        .domain([this.extent[0], this.extent[1]])
        .interpolator(this.colorPalette)
    },
    itemsPerDay() {
      const years = d3
        .groups(this.items, v => v.date.getUTCFullYear())
        .reverse()
      return years.map(y => [
        y[0],
        d3.flatRollup(
          y[1],
          v => d3.sum(v, d => d.value),
          v => v.date.getUTCMonth(),
          v => v.date.getUTCDate(),
          v => v.date.getDay()
        )
      ])
    },
    monthsPerYear() {
      const test = this.itemsPerDay.map(y => {
        const dateExtent = d3.extent(y[1], i => {
          console.log(y, i)
          return new Date(y[0], i[0], i[1])
        })
        console.log(dateExtent)
        return {
          year: y[0],
          months: d3.utcMonths(d3.utcMonth(dateExtent[0]), dateExtent[1])
        }
      })

      console.log(test)
      return test
    },
    legendSquares() {
      const legendFormat = d3.format('.2')
      const step = this.extent[1] / (this.legendNbItems - 1)
      return d3
        .range(this.legendNbItems)
        .map(n => (n ? legendFormat(n * step) : legendFormat(this.extent[0])))
    }
  },
  mounted() {},
  methods: {
    generateTitle(year, month, day, value) {
      return (
        d3.timeFormat('%a %d %B, %Y')(new Date(year, month, day)) +
        ' - ' +
        value +
        ' records'
      )
    },
    xPos(year, month, day) {
      const date = new Date(year, month, day)
      return d3.utcMonday.count(d3.utcYear(date), date) * this.cellSize + 0.5
    },
    xPosMonth(d) {
      return (
        d3.utcMonday.count(d3.utcYear(d), d3.utcMonday.ceil(d)) * this.cellSize
      )
    },
    drawViz() {}
  }
}
</script>
<style scoped>
/* AXES */
/* ticks */
::v-deep .week-axis {
  text-anchor: end;
}
::v-deep .hour-axis {
  text-anchor: middle;
}
::v-deep .graph {
  font-family: 'Assistant', sans-serif;
  font-size: 8px;
  max-width: 100%;
  height: auto;
}
</style>
