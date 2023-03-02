<template>
  <VContainer>
    <VRow justify="center">
      <VCol
        cols="12"
        md="6"
      >
        <ChartViewHeatMapHour
          v-bind="{ headers, dateAccessor, colorPalette }"
          :values="messageReceived"
          title="Messages Received"
          legend-label="Messages"
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
        />
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
