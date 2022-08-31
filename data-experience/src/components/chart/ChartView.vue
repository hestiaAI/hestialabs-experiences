<template>
  <DataValidator :data="data">
    <div>
      <component
        :is="graphName"
        v-bind="{
          values: data.items || [],
          headers: data.headers || [],
          ...vizProps
        }"
      />
    </div>
  </DataValidator>
</template>

<script>
// eslint-disable-next-line
import ChartViewTimeSeries from './view/ChartViewTimeSeries.vue'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    graphName: {
      type: String,
      required: true
    },
    vizProps: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
