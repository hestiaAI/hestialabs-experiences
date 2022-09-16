<template>
  <DataValidator :data="data">
    <div>
      <component
        :is="component"
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
export default {
  name: 'ChartView',
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
  },
  computed: {
    component() {
      return this.graphName.split('.vue')[0]
    }
  }
}
</script>
