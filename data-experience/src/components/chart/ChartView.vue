<template>
  <DataValidator :data="data">
    <div>
      <component
        v-if="renderComponent"
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
  data() {
    return {
      renderComponent: true
    }
  },
  computed: {
    component() {
      return () => import(`./view/${this.graphName}`)
    }
  },
  watch: {
    async '$i18n.locale'(val) {
      this.renderComponent = false
      await this.$nextTick()
      this.renderComponent = true
    }
  }
}
</script>
