<template>
  <VSelect
    v-model="selectedSamples"
    v-bind="$attrs"
    item-text="filename"
    return-object
    label="Select sample data"
    hide-details
    style="max-width: 300px"
    menu-props="auto, overflowY, offsetY, top"
    multiple
    chips
    deletable-chips
  />
</template>

<script>
export default {
  name: 'TheSelectorSample',
  props: {
    value: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedSamples: this.value
    }
  },
  watch: {
    selectedSamples(v) {
      this.$emit('update:value', v)
    },
    value(v) {
      this.selectedSamples = v
    }
  }
}
</script>
