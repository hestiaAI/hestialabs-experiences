<template>
  <div>
    <div v-if="dates.length">
      <VRow>
        <VCol>
          <div class="d-flex justify-space-between">
            <div v-for="(label, index) in ['From', 'To']" :key="index">
              <div class="subtitle-2">
                {{ $t(label) }}:
              </div>
              <VChip label outlined>
                {{ dateFormatter(dateRange[index]) }}
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
        <span v-t="'Day of week'" />
        <VBtn
          class="ma-2"
          outlined
          color="indigo"
          x-small
          @mousedown.prevent
          @click="selectAll"
        >
          {{ $t(allDays ? 'Unselect All' : 'Select All') }}
        </VBtn>
      </div>
      <VRow>
        <VCol
          v-for="weekDay in days"
          :key="weekDay"
          cols="12"
          md="6"
          class="pt-0 pb-0"
        >
          <VCheckbox
            v-model="daysAuthorized"
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
      <span v-t="'No valid dates found'" class="caption" />
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { dateParser, datetimeParser, dateFormatter } from '@/utils/dates'
import TimeFilter from './TimeFilter.vue'

export default {
  name: 'DateFilter',
  components: { TimeFilter },
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
  data() {
    return {
      dateFormatter,
      days: this.$days(),
      daysAuthorized: this.$days(),
      sliderRange: [],
      timeFilterFunction: null
    }
  },
  computed: {
    parser() {
      if (this.isDatetime) {
        return datetimeParser
      }
      return dateParser
    },
    dates() {
      return this.values.map(v => this.parser(v)).filter(d => d !== null)
    },
    dateExtent() {
      return d3.extent(this.dates)
    },
    numberOfDays() {
      return d3.timeDay.count(...this.dateExtent)
    },
    timeScale() {
      return d3
        .scaleTime()
        .domain(this.dateExtent)
        .range([0, this.numberOfDays])
    },
    dateRange() {
      return [
        this.getDate(this.sliderRange[0]),
        this.getDate(this.sliderRange[1])
      ]
    },
    allDays() {
      return this.daysAuthorized.length === this.days.length
    },
    filterFunction() {
      if (!this.timeFilterFunction &&
                this.allDays &&
                JSON.stringify(this.sliderRange) ===
                    JSON.stringify([0, this.numberOfDays])) {
        return null
      }
      return (value) => {
        const date = this.parser(value)
        return ((!value ||
                    (date >= this.dateRange[0] &&
                        date <= this.dateRange[1] &&
                        this.daysAuthorized.includes(this.days[date.getDay()]))) &&
                    (!this.timeFilterFunction || this.timeFilterFunction(value)))
      }
    }
  },
  mounted() {
    this.sliderRange = [0, this.numberOfDays]
  },
  methods: {
    selectAll() {
      this.$nextTick(() => {
        if (this.allDays) {
          this.daysAuthorized = []
        } else {
          this.daysAuthorized = this.days.slice()
        }
        this.filterChange()
      })
    },
    getDate(i) {
      return this.timeScale.invert(i)
    },
    timeFilterChange(filter) {
      this.timeFilterFunction = filter
      this.filterChange()
    },
    filterChange() {
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.daysAuthorized = this.days.slice()
      this.sliderRange = [0, this.numberOfDays]
      if (this.isDatetime) {
        this.$refs.timeFilter.reset()
      }
      this.filterChange()
    }
  }
}
</script>
