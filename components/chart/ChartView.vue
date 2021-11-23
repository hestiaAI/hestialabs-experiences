<template>
  <div>
    <component :is="component" v-if="isValid" :values="values" />
    <i v-else>data in this format cannot be displayed by this visualization</i>
  </div>
</template>

<script>
import _ from 'lodash'

function isDataValid(data) {
  return (
    _.each(
      ['items', 'headers'],
      field => _.has(data, field) && Array.isArray(data[field])
    ) &&
    data.headers.length > 0 &&
    _.each(data.items, i => _.each(data.headers, h => _.has(i, h)))
  )
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
