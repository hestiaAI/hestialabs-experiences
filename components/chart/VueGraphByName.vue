<template>
  <div>
    <component :is="isComponent" v-if="isValid" :values="values"></component>
    <i v-else>data in this format cannot be displayed by this visualization</i>
  </div>
</template>

<script>
function isDataValid(data) {
  return !data || !!(data.items?.length > 0)
}

function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase()
}

export default {
  props: {
    data: {
      default: undefined,
      validator: isDataValid
    },
    graphName: {
      type: String,
      required: true
    }
  },
  computed: {
    isValid() {
      return isDataValid(this.data)
    },
    values() {
      return this.data.items || {}
    },
    isComponent() {
      switch (this.graphName) {
        case 'TimedObservationsViewer.vue':
          return () => import('@/components/chart/TimedObservationsViewer.vue')
        case 'Sunburst.vue':
          return () => import('@/components/chart/Sunburst.vue')
        case 'UberOverview.vue':
          return () => import('@/components/chart/UberOverview.vue')
        case 'TwitterOverview.vue':
          return () => import('@/components/chart/TwitterOverview.vue')
        case 'BarChart.vue':
          return () => import('@/components/chart/BarChart.vue')
        case 'TrackerGraph.vue':
          return () => import('@/components/chart/TrackerGraph.vue')
        default:
          return undefined
      }
    }
  },
  methods: {
    toVueFileName(componentName) {
      const camelCase = toPascalCase(componentName)
      const fileName = camelCase + '.vue'
      return fileName
    }
  }
}
</script>
