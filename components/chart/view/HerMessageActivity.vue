<template>
  <VContainer>
    <p>
      In total you exchanged <strong>{{ nbMsg }}</strong> messages with
      <strong>{{ nbUser }}</strong> users.
    </p>
    <VRow>
      <VCol cols="12">
        <h3 class="text-h6">Messages exchanged per hour and day of week</h3>
      </VCol>
      <VCol cols="12" md="6">
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor }"
          :values="messageReceived"
          title="Messages Received"
          date-format="%d/%m/%Y %H:%M"
          legend-label="Messages"
        ></ChartViewHeatMapHour>
      </VCol>
      <VCol cols="12" md="6">
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor }"
          :values="messageSent"
          title="Messages Sent"
          date-format="%d/%m/%Y %H:%M"
          legend-label="Messages"
        ></ChartViewHeatMapHour>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="12">
        <h3 class="text-h6">Messages exchanged per day</h3>
        <ChartViewHeatMapCalendar
          v-bind="{ headers, dateAccessor }"
          :values="messageReceived"
          title="Messages exchanged"
          date-format="%d/%m/%Y %H:%M"
          legend-label="Messages"
        ></ChartViewHeatMapCalendar>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'
import ChartViewHeatMapHour from './ChartViewHeatMapHour.vue'

export default {
  components: { ChartViewHeatMapHour },
  mixins: [mixin],
  props: {
    dateAccessor: {
      type: String,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {
    messageReceived() {
      return this.values.filter(
        v =>
          v.sender !== 'her the app, message sent by her (the app)' &&
          v.sender !== 'User (myself)'
      )
    },
    messageSent() {
      return this.values.filter(
        v =>
          v.sender !== 'her the app, message sent by her (the app)' &&
          v.sender === 'User (myself)'
      )
    },
    nbUser() {
      return new Set(this.values.map(v => v.sender)).size - 2 // Remove Her and the user
    },
    nbMsg() {
      return this.values.length // Remove Her and the user
    }
  },
  mounted() {},
  methods: {
    drawViz() {}
  }
}
</script>
<style scoped></style>
