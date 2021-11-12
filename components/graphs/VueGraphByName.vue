<template>
  <component :is="isComponent" :values="values"></component>
</template>

<script>
function toPascalCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper)
}

function clearAndUpper(text) {
  return text.replace(/-/, '').toUpperCase()
}

export default {
  props: {
    values: {
      type: Array,
      default: () => []
    },
    graphName: {
      type: String,
      required: true
    }
  },
  computed: {
    isComponent() {
      switch (this.graphName) {
        case 'Sankey.vue':
          return () => import('@/components/graphs/Sankey.vue')
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
