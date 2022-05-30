<template>
  <VProgressCircular v-bind="{ size, width, ...$attrs }" indeterminate />
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
    }
  }
}
</script>
