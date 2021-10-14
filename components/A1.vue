<template>
  <h1>A1 {{ title }}</h1>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'untitled'
    }
  }
}
</script>
