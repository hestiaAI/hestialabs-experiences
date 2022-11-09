<template>
  <VSelect
    v-model="selectedSamples"
    v-bind="$attrs"
    :items="items"
    item-text="filename"
    return-object
    :label="$t('unit-files.sample-selector')"
    hide-details
    style="max-width: 300px; justify-self: 'center'"
    menu-props="auto, overflowY, offsetY, top"
    :multiple="multiple"
    chips
    deletable-chips
  />
</template>

<script>
export default {
  name: 'UnitFilesSampleSelector',
  props: {
    value: {
      type: [Array, Object],
      required: true
    },
    items: {
      type: Array,
      required: true,
      validator(value) {
        return value.length
      }
    }
  },
  data() {
    return {
      selectedSamples: this.value
    }
  },
  computed: {
    multiple() {
      return this.items.length > 1
    }
  },
  watch: {
    selectedSamples(v) {
      let value = v
      if (!this.multiple) {
        value = v ? [v] : []
      }
      this.$emit('update:value', value)
    },
    value(v) {
      if (this.multiple) {
        this.selectedSamples = v
      } else {
        this.selectedSamples = v.length ? v[0] : null
      }
    }
  }
}
</script>
