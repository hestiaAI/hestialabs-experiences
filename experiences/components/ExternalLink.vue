<template>
  <a v-bind="$attrs" rel="noreferrer noopener" :target="target"><slot /></a>
</template>

<script>
export default {
  props: {
    target: {
      type: String,
      default: '_blank'
    }
  }
}
</script>
