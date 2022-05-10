<template>
  <VContainer>
    <VRow>
      <VCol>
        <div class="d-flex justify-space-between">
          <div>
            <div class="subtitle-2">From:</div>
            <VChip label outlined>{{ dateRange[0] }}</VChip>
          </div>
          <div>
            <div class="subtitle-2">To:</div>
            <VChip label outlined>{{ dateRange[1] }}</VChip>
          </div>
        </div>
        <VRangeSlider
          v-model="sliderRange"
          :min="0"
          :max="numberOfDays"
          hide-details
          dense
          @change="filterChange"
        ></VRangeSlider>
      </VCol>
    </VRow>
    <div
      class="d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"
    >
      <span>Day of week</span>
      <VBtn
        class="ma-2"
        outlined
        color="indigo"
        x-small
        @click="selectAll"
        v-text="allWeekDays ? `Unselect All` : `Select All`"
      >
      </VBtn>
    </div>
    <VRow>
      <VCol
        v-for="(weekDay, idx) in weekDays"
        :key="weekDay"
        cols="12"
        md="6"
        class="pt-0 pb-0"
      >
        <VCheckbox
          v-model="weekDayAuthorized[idx]"
          :label="weekDay"
          color="primary"
          :value="true"
          hide-details
          dense
          @change="filterChange"
        ></VCheckbox>
      </VCol>
    </VRow>
    <div class="d-flex justify-space-between align-end mt-5">
      <VBtn small text color="primary" @click="reset" v-text="`Clear`" />
    </div>
  </VContainer>
</template>
<script>
import * as d3 from 'd3'
export default {
  name: 'UnitFilter',
  props: {
    header: {
      type: Object,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const dateExtent = d3.extent(this.values, v => new Date(v))
    const dateFormatter = d3.timeFormat('%Y-%m-%d')
    const numberOfDays = d3.timeDay.count(...dateExtent)
    return {
      dateFormatter,
      numberOfDays,
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekDayAuthorized: Array(7).fill(true),
      timeScale: d3.scaleTime().domain(dateExtent).range([0, numberOfDays]),
      sliderRange: [0, numberOfDays]
    }
  },
  computed: {
    dates() {
      return this.values.map(v => new Date(v))
    },
    dateExtent() {
      return d3.extent(this.dates).map(d => this.dateFormatter(d))
    },
    dateRange() {
      return [
        this.getDate(this.sliderRange[0]),
        this.getDate(this.sliderRange[1])
      ]
    },
    allWeekDays() {
      return this.weekDayAuthorized.every(d => d === true)
    },
    filterFunction() {
      return value => {
        const date = new Date(value)
        return (
          date >= new Date(this.dateRange[0]) &&
          date <= new Date(this.dateRange[1]) &&
          this.weekDayAuthorized[date.getDay()]
        )
      }
    }
  },
  methods: {
    selectAll() {
      if (this.allWeekDays) {
        this.weekDayAuthorized.fill(null)
      } else {
        this.weekDayAuthorized.fill(true)
      }
    },
    getDate(i) {
      return this.dateFormatter(this.timeScale.invert(i))
    },
    filterChange() {
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.weekDayAuthorized = this.weekDayAuthorized.fill(true)
      this.sliderRange = [0, this.numberOfDays]
      this.filterChange()
    }
  }
}
</script>
