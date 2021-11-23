<template>
  <div>
    <component :is="component" v-if="isValid" :values="values" />
    <i v-else>data in this format cannot be displayed by this visualization</i>
  </div>
</template>

<script>
function isDataValid(data) {
  return !data || !!(data.items?.length > 0)
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
    component() {
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  }
}
</script>
