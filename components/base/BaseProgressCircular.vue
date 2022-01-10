<template>
  <VProgressCircular v-bind="{ size, width }" indeterminate />
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 14
    },
    width: {
      type: Number,
      default: 2
    }
  }
}
</script>
