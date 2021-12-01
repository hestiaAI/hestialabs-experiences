<template>
  <div>
    <component
      :is="component"
      v-if="isValid && !isEmpty"
      :values="values"
      :headers="data.headers"
    />
    <i v-else-if="isValid">No data found</i>
    <i v-else>Data in this format cannot be displayed by this visualization</i>
  </div>
</template>

<script>
import _ from 'lodash'

function isDataValid(data) {
  return (
    _.every(
      ['items', 'headers'],
      field => _.has(data, field) && Array.isArray(data[field])
    ) &&
    data.headers.length > 0 &&
    _.every(data.items, i => _.every(data.headers, h => _.has(i, h)))
  )
}

function isDataEmpty(data) {
  return data.items.length === 0
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
    isEmpty() {
      return isDataEmpty(this.data)
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
