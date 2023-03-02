<template>
  <VRow>
    <VCol>
      <div
        class="d-flex justify-space-between align-center text-subtitle-1 mt-3 mb-3"
      >
        <span v-t="'Time'" />
        <VCheckbox
          v-model="allDay"
          :label="$t('All Day')"
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
          :label="$t('Min value')"
          type="time"
          @change="filterChange()"
        />

        <VTextField
          v-model="endTime"
          class="ml-3"
          :label="$t('Max value')"
          :min="startTime"
          type="time"
          @change="filterChange()"
        />
      </div>
    </VCol>
  </VRow>
</template>

<script>
import { timeParser, datetimeParser } from '@/utils/dates'

const DEFAULT_START_TIME = '00:00'
const DEFAULT_END_TIME = '23:59'

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
      startTime: DEFAULT_START_TIME,
      endTime: DEFAULT_END_TIME
    }
  },
  computed: {
    parser() {
      return this.isDatetime ? datetimeParser : timeParser
    },
    filterFunction() {
      if (this.allDay) {
        return null
      }
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
      this.allDay = this.startTime === DEFAULT_START_TIME && this.endTime === DEFAULT_END_TIME
      this.$emit('filter-change', this.filterFunction)
    },
    reset() {
      this.startTime = DEFAULT_START_TIME
      this.endTime = DEFAULT_END_TIME
      this.filterChange()
    }
  }
}
</script>
