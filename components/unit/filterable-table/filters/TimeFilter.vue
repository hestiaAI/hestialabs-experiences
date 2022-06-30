<template>
  <VRow>
    <VCol>
      <div
        class="d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"
      >
        <span>Time</span>
        <VCheckbox
          v-model="allDay"
          label="All Day"
          color="primary"
          hide-details
          :disabled="allDay"
          dense
          @click="reset"
        />
      </div>
      <div class="d-flex justify-space-between">
        <VTextField
          v-model="startTime"
          class="mr-3"
          label="Min value"
          type="time"
          @change="filterChange()"
        />

        <VTextField
          v-model="endTime"
          class="ml-3"
          label="Min value"
          :min="startTime"
          type="time"
          @change="filterChange()"
        />
      </div>
    </VCol>
  </VRow>
</template>
<script>
// import * as d3 from 'd3'
import { timeParser, datetimeParser } from '@/utils/dates'
export default {
  name: 'TimeFilter',
  props: {
    isDatetime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      allDay: true,
      startTime: '00:00',
      endTime: '23:59'
    }
  },
  computed: {
    parser() {
      return this.isDatetime ? datetimeParser : timeParser
    },
    filterFunction() {
      if (this.allDay) { return null }
      return (value) => {
        const date = this.parser(value)
        if (!value || !date) { return true }
        const currentTime = this.toMilliseconds(
          `${date.getHours()}:${date.getMinutes()}`
        )
        const startTime = this.toMilliseconds(this.startTime)
        const endTime = this.toMilliseconds(this.endTime)
        return currentTime >= startTime && currentTime <= endTime
      }
    }
  },
  methods: {
    toMilliseconds(time) {
      const [hours, minutes] = time.split(':').map(d => parseInt(d))
      return hours * 3600 * 1000 + minutes * 60 * 1000
    },
    filterChange() {
      if (this.startTime === '00:00' && this.endTime === '23:59') { this.allDay = true } else { this.allDay = false }
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.startTime = '00:00'
      this.endTime = '23:59'
      this.filterChange()
    }
  }
}
</script>
