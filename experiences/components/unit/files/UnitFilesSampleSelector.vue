<template>
  <VSelect
    v-model="selectedSamples"
    v-bind="$attrs"
    item-text="filename"
    return-object
    :label="$t('unit-files.sample-selector')"
    hide-details
    style="max-width: 300px; justify-self: 'center'"
    menu-props="auto, overflowY, offsetY, top"
    multiple
    chips
    deletable-chips
  />
</template>

<script>
export default {
  name: 'UnitFilesSampleSelector',
  props: {
    value: {
      type: Array,
      required: true
    }
    // dataSamples: {
    //   type: Array,
    //   required: true
    // }
  },
  data() {
    return {
      selectedSamples: this.value
    }
  },
  // computed: {
  //   items() {
  //     return this.dataSamples.map(filename => ({
  //       // See generator.filename
  //       // in packages/webpack.config.js
  //       name: filename.split('$')[0],
  //       filename
  //     }))
  //   }
  // },
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
