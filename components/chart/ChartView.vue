<template>
  <DataValidator :data="data">
    <div ref="view">
      <component
        :is="component"
        v-bind="{
          values: data ? data.items : [],
          headers: data ? data.headers : [],
          ...vizProps
        }"
      />
    </div>
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
<style>
@import 'assets/styles/dc.css';
</style>
