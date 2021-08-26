<template>
  <v-select
    v-model="selected"
    v-bind="$attrs"
    item-text="name"
    return-object
    label="Select example"
    hide-details
    style="max-width: 200px"
  ></v-select>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selected: this.value
    }
  },
  value(v) {
    this.selected = v
  },
  selected(v) {
    // propagate to parent component
    this.$emit('update:value', v)
  }
}
</script>
