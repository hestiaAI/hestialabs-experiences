<template>
  <div>
    <BaseAlert v-if="!hasValidFormat" type="warning">
      Data in this format cannot be displayed in a table
    </BaseAlert>
    <BaseAlert v-else-if="!hasData">No relevant data found</BaseAlert>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasValidFormat() {
      return (
        _.every(
          ['items', 'headers'],
          field => _.has(this.data, field) && Array.isArray(this.data[field])
        ) &&
        _.every(this.data.items, i =>
          _.every(this.data.headers, h => _.has(i, h) || _.has(i, h.value))
        )
      )
    },
    hasData() {
      return (
        !!(this.data?.headers.length > 0) && !!(this.data?.items.length > 0)
      )
    }
  }
}
</script>
