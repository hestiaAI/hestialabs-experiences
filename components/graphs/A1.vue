<template>
  <h1>A1 {{ values }}</h1>
</template>

<script>
export default {
  props: {
    values: {
      type: Array,
      default: () => []
    }
  }
}
</script>
