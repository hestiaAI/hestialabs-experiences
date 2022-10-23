<template>
  <DataValidator :data="data">
    <div>
      <component
        :is="component"
        v-bind="{
          values: data.items || [],
          headers: data.headers || [],
          ...$attrs
        }"
      />
    </div>
  </DataValidator>
</template>

<script>
import DataValidator from '@/components/misc/DataValidator.vue'
export default {
  name: 'ChartView',
  components: { DataValidator },
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
      return () => import(`./view/${this.graphName}`)
    }
  }
}
</script>
