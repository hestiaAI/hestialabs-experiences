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
        case 'Sunburst.vue':
          return () => import('@/components/graphs/Sunburst.vue')
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
      console.log(componentName, fileName)
      return fileName
    }
  }
}
</script>
