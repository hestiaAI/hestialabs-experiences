<template>
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" md="6">
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor }"
          :values="messageReceived"
          title="Messages Received"
          legend-label="Messages"
        />
      </VCol>
      <VCol cols="12" md="6">
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor }"
          :values="messageSent"
          title="Messages Sent"
          legend-label="Messages"
        />
      </VCol>
    </VRow>
  </VContainer>
</template>

<script>
import mixin from './mixin'

export default {
  mixins: [mixin],
  props: {
    dateAccessor: {
      type: String,
      required: true
    }
  },
  computed: {
    messageReceived() {
      return this.values.filter(v => v.receiver === 'You')
    },
    messageSent() {
      return this.values.filter(v => v.sender === 'You')
    }
  }
}
</script>
