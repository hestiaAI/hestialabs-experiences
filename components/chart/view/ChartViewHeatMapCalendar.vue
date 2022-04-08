<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="9">
        <div class="d-flex">
          <div class="overline">{{ title }}</div>
          <VSpacer></VSpacer>
          <div>
            <VRadioGroup v-model="aggType" row mandatory>
              <VRadio label="Per hour" value="hour"></VRadio>
              <VRadio label="Per day" value="day"></VRadio>
            </VRadioGroup>
          </div>
        </div>
        <svg class="graph" :viewBox="viewBox">
          <g :transform="`translate(40.5,${cellSize * 1.5})`">
            <g class="week-axis">
              <text
                v-for="(d, idx) in weekDays"
                :key="`d_${idx}`"
                x="-5"
                :y="(idx + 0.5) * cellSize"
                dy="0.35em"
              >
                {{ d }}
              </text>
            </g>

            <g v-if="aggType === 'hour'" class="hour-axis">
              <text y="-20" :x="(hours.length / 2 + 0.5) * cellSize">
                Hours
              </text>
              <text
                v-for="h in hours"
                :key="`h_${h}`"
                y="-5"
                :x="(h + 0.5) * cellSize"
              >
                {{ h }}
              </text>
            </g>

            <g v-if="aggType === 'hour'" class="calendar-hour">
              <g v-for="(item, idx) in itemsPerHour" :key="idx">
                <rect
                  :width="cellSize - cellSpacing"
                  :height="cellSize - cellSpacing"
                  :x="item[0] * cellSize + 0.5"
                  :y="item[1] * cellSize + 0.5"
                  :fill="color(item[2])"
                  :rx="borderRadius"
                  :ry="borderRadius"
                ></rect>
                <title>{{ generateTitleHours(item) }}</title>
              </g>
            </g>

            <g v-if="aggType === 'day'" class="calendar-hour">
              <g
                v-for="(year, idxYear) in itemsPerDay"
                :key="'year_' + idxYear"
              >
                <g v-for="(day, idxDay) in year[1]" :key="'day_' + idxDay">
                  <rect
                    :width="cellSize - cellSpacing"
                    :height="cellSize - cellSpacing"
                    :x="xPos(year[0], day[0], day[1])"
                    :y="idxYear * calendarHeight + day[2] * cellSize + 0.5"
                    :fill="color(day[3])"
                    :rx="borderRadius"
                    :ry="borderRadius"
                  ></rect>
                  <title>
                    {{ generateTitleDay(year[0], day[0], day[1], day[3]) }}
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
              <g
                v-for="(square, idx) in legendSquares"
                :key="'legend_' + square"
              >
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
      </VCol>
    </VRow>
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
      default: () => 'Title of the Graph'
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
    dateAgg: {
      type: String,
      default: () => 'BOTH',
      validator: v => ['BOTH', 'HOUR', 'DAY'].includes(v)
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
      default: () => 'Number of test test'
    }
  },
  data() {
    return {
      weekDays: ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat'],
      hours: d3.range(24),
      formatMonth: d3.utcFormat('%b'),
      aggType: null,
      colorPalette: d3.interpolateRdPu
    }
  },
  computed: {
    width() {
      if (this.aggType === 'hour')
        return this.cellSize * (this.hours.length + 3)
      else return this.cellSize * (52 + 3)
    },
    calendarHeight() {
      return this.cellSize * (this.weekDays.length + 4)
    },
    height() {
      if (this.aggType === 'hour') return this.calendarHeight
      else return this.calendarHeight * this.itemsPerDay.length
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
    itemsPerHour() {
      const hours = d3.flatRollup(
        this.items,
        v => d3.sum(v, d => d.value),
        v => v.date.getHours(),
        v => v.date.getDay()
      )
      return hours
    },
    extent() {
      return d3.extent(this.itemsPerHour, v => v[2])
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
    legendSquares() {
      const legendFormat = d3.format('.2')
      const step = this.extent[1] / (this.legendNbItems - 1)
      return d3
        .range(this.legendNbItems)
        .map(n => (n ? legendFormat(n * step) : legendFormat(this.extent[0])))
    }
  },
  mounted() {
    console.log(this.extent[1])
    console.log('Day', this.itemsPerDay)
    console.log('hours ', this.itemsPerHour)
  },
  methods: {
    generateTitleHours(item) {
      return (
        d3.timeFormat('%a at %H:00')(new Date(2000, 12, item[1], item[0])) +
        ' - ' +
        item[2] +
        ' records'
      )
    },
    generateTitleDay(year, month, day, value) {
      return (
        d3.timeFormat('%a %d %B, %Y')(new Date(year, month, day)) +
        ' - ' +
        value +
        ' records'
      )
    },
    countDay(i) {
      return (i + 6) % 7
    },
    xPos(year, month, day) {
      const date = new Date(year, month, day)
      return d3.utcMonday.count(d3.utcYear(date), date) * this.cellSize + 0.5
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
