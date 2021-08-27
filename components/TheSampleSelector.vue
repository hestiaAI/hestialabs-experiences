<template>
  <v-select
    v-model="selectedSamples"
    v-bind="$attrs"
    label="Select sample data"
    hide-details
    style="max-width: 200px"
    menu-props="auto, overflowY, offsetY, top"
    multiple
  />
</template>

<script>
export default {
  data() {
    return {
      selectedSamples: []
    }
  },
  watch: {
    selectedSamples(...params) {
      this.$emit('update', ...params)
    }
  }
}
</script>
