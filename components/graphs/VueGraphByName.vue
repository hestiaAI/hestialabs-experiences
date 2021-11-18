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
          return () => import('@/components/graphs/TimedObservationsViewer.vue')
        case 'Sunburst.vue':
          return () => import('@/components/graphs/Sunburst.vue')
        case 'UberOverview.vue':
          return () => import('@/components/graphs/UberOverview.vue')
        case 'TwitterOverview.vue':
          return () => import('@/components/graphs/TwitterOverview.vue')
        case 'BarChart.vue':
          return () => import('@/components/graphs/BarChart.vue')
        case 'TrackerGraph.vue':
          return () => import('@/components/graphs/TrackerGraph.vue')
        case 'GenericDateViewer.vue':
          return () => import('@/components/graphs/GenericDateViewer.vue')
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
