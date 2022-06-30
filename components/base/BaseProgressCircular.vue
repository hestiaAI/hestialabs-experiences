<template>
  <VProgressCircular v-bind="{ indeterminate, size, width, ...$attrs }" />
</template>

<script>
export default {
  props: {
    size: {
      type: [String, Number],
      default: 14
    },
    width: {
      type: [String, Number],
      default: 2
    },
    indeterminate: {
      type: Boolean,
      default: true
    }
  }
}
</script>
