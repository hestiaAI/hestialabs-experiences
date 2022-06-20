<template>
  <VSelect
    v-model="selected"
    v-bind="$attrs"
    item-text="name"
    return-object
    label="Select example"
    hide-details
    style="max-width: 200px"
    @change="$emit('update:value', $event)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selected: this.value
    }
  }
}
</script>
