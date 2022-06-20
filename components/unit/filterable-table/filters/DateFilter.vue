<template>
  <div>
    <div v-if="dates.length">
      <VRow>
        <VCol>
          <div class="d-flex justify-space-between">
            <div>
              <div class="subtitle-2">
                From:
              </div>
              <VChip label outlined>
                {{ dateFormatter(dateRange[0]) }}
              </VChip>
            </div>
            <div>
              <div class="subtitle-2">
                To:
              </div>
              <VChip label outlined>
                {{ dateFormatter(dateRange[1]) }}
              </VChip>
            </div>
          </div>
          <VRangeSlider
            v-model="sliderRange"
            :min="0"
            :max="numberOfDays"
            track-color="primary"
            thumb-color="#2c3e50"
            tick-size="0"
            hide-details
            dense
            step="1"
            @change="filterChange"
          />
        </VCol>
      </VRow>
      <TimeFilter
        v-if="isDatetime"
        ref="timeFilter"
        v-bind="{ isDatetime }"
        @filter-change="timeFilterChange"
      />
      <div
        class="d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"
      >
        <span>Day of week</span>
        <VBtn
          class="ma-2"
          outlined
          color="indigo"
          x-small
          @mousedown.prevent
          @click="selectAll"
        >
          {{ allWeekDays ? 'Unselect All' : 'Select All' }}
        </VBtn>
      </div>
      <VRow>
        <VCol
          v-for="weekDay in weekDays"
          :key="weekDay"
          cols="12"
          md="6"
          class="pt-0 pb-0"
        >
          <VCheckbox
            v-model="weekDayAuthorized"
            :label="weekDay"
            color="primary"
            :value="weekDay"
            hide-details
            dense
            @change="filterChange"
          />
        </VCol>
      </VRow>
    </div>
    <div v-else align="center">
      <span class="caption">No valid dates found</span>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3'
import { dateParser, datetimeParser, dateFormatter } from '@/utils/dates'
export default {
  name: 'UnitFilter',
  props: {
    values: {
      type: Array,
      default: () => []
    },
    isDatetime: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dateFormatter,
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekDayAuthorized: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      sliderRange: [],
      timeFilterFunction: null
    }
  },
  computed: {
    parser () {
      if (this.isDatetime) {
        return datetimeParser
      } else {
        return dateParser
      }
    },
    dates () {
      return this.values.map(v => this.parser(v)).filter(d => d !== null)
    },
    dateExtent () {
      return d3.extent(this.dates)
    },
    numberOfDays () {
      return d3.timeDay.count(...this.dateExtent)
    },
    timeScale () {
      return d3
        .scaleTime()
        .domain(this.dateExtent)
        .range([0, this.numberOfDays])
    },
    dateRange () {
      return [
        this.getDate(this.sliderRange[0]),
        this.getDate(this.sliderRange[1])
      ]
    },
    allWeekDays () {
      return this.weekDayAuthorized.length === this.weekDays.length
    },
    filterFunction () {
      if (
        !this.timeFilterFunction &&
        this.allWeekDays &&
        JSON.stringify(this.sliderRange) ===
          JSON.stringify([0, this.numberOfDays])
      ) { return null }
      return (value) => {
        const date = this.parser(value)
        return (
          (!value ||
            (date >= this.dateRange[0] &&
              date <= this.dateRange[1] &&
              this.weekDayAuthorized.includes(this.weekDays[date.getDay()]))) &&
          (!this.timeFilterFunction || this.timeFilterFunction(value))
        )
      }
    }
  },
  mounted () {
    this.sliderRange = [0, this.numberOfDays]
  },
  methods: {
    selectAll () {
      this.$nextTick(() => {
        if (this.allWeekDays) {
          this.weekDayAuthorized = []
        } else {
          this.weekDayAuthorized = this.weekDays.slice()
        }
        this.filterChange()
      })
    },
    getDate (i) {
      return this.timeScale.invert(i)
    },
    timeFilterChange (filter) {
      this.timeFilterFunction = filter
      this.filterChange()
    },
    filterChange () {
      this.$emit('filter-change', this.filterFunction)
    },
    reset () {
      this.weekDayAuthorized = this.weekDays.slice()
      this.sliderRange = [0, this.numberOfDays]
      if (this.isDatetime) { this.$refs.timeFilter.reset() }
      this.filterChange()
    }
  }
}
</script>
