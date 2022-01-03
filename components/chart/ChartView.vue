<template>
  <DataValidator :data="data">
    <component
      :is="component"
      v-bind="{ values: data.items, headers: data.headers, ...vizProps }"
    />
  </DataValidator>
</template>

<script>
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
      default: () => {}
    }
  },
  computed: {
    component() {
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  }
}
</script>
