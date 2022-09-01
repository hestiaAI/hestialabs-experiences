<template>
  <VContainer>
    <div class="d-flex mb-3">
      <div class="overline">
        {{ title }}
      </div>
      <VSpacer />
      <div v-if="includeTotal" class="overline">
        total: <strong>{{ items.length }}</strong>
      </div>
    </div>
    <svg class="graph" :viewBox="viewBox">
      <g :transform="`translate(40.5,${cellSize * 1.5})`">
        <g class="week-axis">
          <text
            v-for="(d, idx) in $days()"
            :key="`d_${idx}`"
            x="-5"
            :y="(idx + 0.5) * cellSize"
            dy="0.35em"
          >
            {{ d }}
          </text>
        </g>

        <g class="hour-axis">
          <text y="-20" :x="(hours.length / 2 + 0.5) * cellSize">{{ $t('hour') }}s</text>
          <text
            v-for="h in hours"
            :key="`h_${h}`"
            y="-5"
            :x="(h + 0.5) * cellSize"
          >
            {{ h }}
          </text>
        </g>

        <g class="calendar-hour">
          <g v-for="(item, idx) in itemsPerHour" :key="idx">
            <rect
              :width="cellSize - cellSpacing"
              :height="cellSize - cellSpacing"
              :x="item[0] * cellSize + 0.5"
              :y="item[1] * cellSize + 0.5"
              :fill="color(item[2])"
              :rx="borderRadius"
              :ry="borderRadius"
            />
            <title>{{ generateTitle(item) }}</title>
          </g>
        </g>

        <g class="legend">
          <text
            style="text-anchor: end"
            :x="legendSquareXPos(0) - cellSize"
            :y="height - cellSize * 2.5"
            dy="-.20em"
          >
            {{ legendLabel }}
          </text>
          <g v-for="(square, idx) in legendSquares" :key="'legend_' + idx">
            <rect
              :width="(cellSize - cellSpacing) * 2"
              :height="(cellSize - cellSpacing) / 2"
              :x="legendSquareXPos(idx)"
              :y="height - cellSize * 3"
              :fill="color(square)"
              :rx="borderRadius"
              :ry="borderRadius"
            />
            <text
              style="text-anchor: middle"
              :x="legendSquareXPos(idx) + cellSize"
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
    legendPrefNbItems: {
      type: Number,
      default: () => 4
    },
    legendLabel: {
      type: String,
      default: () => ''
    },
    includeTotal: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      hours: d3.range(24),
      colorPalette: d3.interpolateRdPu
    }
  },
  computed: {
    width() {
      return this.cellSize * (this.hours.length + 3)
    },
    height() {
      return this.cellSize * (this.$days().length + 4)
    },
    viewBox() {
      return `0 0 ${this.width} ${this.height}`
    },
    dateParser() {
      if (this.dateFormat) { return d3.timeParse(this.dateFormat) } else {
        return (d) => {
          const date = new Date(d)
          // return null if the date is not recognized
          if (isNaN(date.getTime())) { return null } else { return date }
        }
      }
    },
    items() {
      return this.values
        .map((v) => {
          return {
            date: this.dateParser(v[this.dateAccessor]),
            value: this.valueAccessor ? v[this.valueAccessor] : 1
          }
        })
        .filter(v => v.date)
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
        .nice()
        .interpolator(this.colorPalette)
    },
    legendSquares() {
      return this.color.ticks(this.legendPrefNbItems)
    },
    legendNbItems() {
      return this.legendSquares.length
    }
  },
  methods: {
    generateTitle(item) {
      return (
        d3.timeFormat('%a at %H:00')(new Date(2000, 12, item[1], item[0])) +
        ' - ' +
        item[2] +
        ' records'
      )
    },
    legendSquareXPos(idx) {
      const { width: w, cellSize: s, legendNbItems: n } = this
      return w - s * 2 * n + idx * s * 2 - s * 2
    }
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
