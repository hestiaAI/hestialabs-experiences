<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <h3 class="text-h6">
          Messages exchanged per hour and day of week
        </h3>
        <p>
          In total you exchanged <strong>{{ nbMsg }}</strong> messages with
          <strong>{{ nbUser }}</strong> users.
        </p>
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor, colorPalette }"
          :values="messageReceived"
          title="Messages Received"
          legend-label="Messages"
          include-total
        />
      </VCol>
      <VCol
        cols="12"
        md="6"
      >
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor, colorPalette }"
          :values="messageSent"
          title="Messages Sent"
          legend-label="Messages"
          include-total
        />
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <h3 class="text-h6">
          Messages exchanged per day
        </h3>
        <ChartViewHeatMapCalendar
          v-bind="{ headers, dateAccessor, colorPalette }"
          :values="messageReceived"
          legend-label="Messages"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import ChartViewHeatMapHour from './ChartViewHeatMapHour.vue'
import ChartViewHeatMapCalendar from './ChartViewHeatMapCalendar.vue'

export default {
  components: { ChartViewHeatMapHour, ChartViewHeatMapCalendar },
  mixins: [mixin],
  props: {
    dateAccessor: {
      type: String,
      required: true
    },
    colorPalette: {
      type: Array,
      default: () => ['#fff7f3', '#49006a']
    }
  },
  data() {
    return {}
  },
  computed: {
    messageReceived() {
      return this.values.filter(v => v.sender !== 'Her' && v.sender !== 'User')
    },
    messageSent() {
      return this.values.filter(v => v.sender !== 'Her' && v.sender === 'User')
    },
    nbUser() {
      return new Set(this.values.map(v => v.sender)).size - 2 // Remove Her and the user
    },
    nbMsg() {
      return this.values.filter(v => v.sender !== 'Her').length // Remove Her
    }
  }
}
</script>
