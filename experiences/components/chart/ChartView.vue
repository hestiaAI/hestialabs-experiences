<template>
  <DataValidator :data="data">
    <component
      :is="component"
      v-bind="{
        values: data.items || [],
        headers: data.headers || [],
        ...$attrs
      }"
    />
  </DataValidator>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    data: {
      type: Object,
      required: true
    },
    graphName: {
      type: String,
      required: true
    }
  },
  computed: {
    component() {
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  }
}
</script>

<style>
@import 'assets/styles/dc.css';
</style>
