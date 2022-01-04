<template>
  <div>
    <div v-if="isValid && !isEmpty" ref="view">
      <component :is="component" v-bind="{ values, headers, ...vizProps }" />
    </div>
    <BaseAlert v-else-if="isValid">No data found</BaseAlert>
    <BaseAlert v-else type="warning">
      Data in this format cannot be displayed by this visualization
    </BaseAlert>
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
    },
    vizProps: {
      type: Object,
      default: () => {}
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
    headers() {
      return this.data.headers || []
    },
    component() {
      return () => import(`@/components/chart/view/${this.graphName}`)
    }
  }
}
</script>
