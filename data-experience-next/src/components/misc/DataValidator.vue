<template>
  <div>
    <BaseAlert
      v-if="!hasValidFormat"
      type="warning"
    >
      {{ $t(k('invalid-format')) }}
    </BaseAlert>
    <BaseAlert v-else-if="!hasData">
      {{ $t(k('no-data')) }}
    </BaseAlert>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import { has, every } from 'lodash-es'
import BaseAlert from '@/components/base/BaseAlert.vue'

export default {
  name: 'DataValidator',
  components: { BaseAlert },
  props: {
    data: {
      type: Object,
      required: true
    },
    allowMissingColumns: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasValidFormat() {
      const weHaveArrays = every(
        ['items', 'headers'],
        field => has(this.data, field) && Array.isArray(this.data[field])
      )
      if (this.allowMissingColumns) {
        return weHaveArrays
      }
      return (
        weHaveArrays &&
        every(this.data.items, i =>
          every(this.data.headers, h => has(i, h) || has(i, h.value))
        )
      )
    },
    hasData() {
      return (
        !!(this.data?.headers.length > 0) && !!(this.data?.items.length > 0)
      )
    }
  },
  methods: {
    k(key) {
      return `data-validator.${key}`
    }
  }
}
</script>
