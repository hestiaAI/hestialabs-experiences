<template>
  <VTextField
    :value="search"
    prepend-icon="$vuetify.icons.mdiMagnify"
    :label="label"
    :placeholder="placeholder"
    single-line
    hide-details
    clearable
    class="mb-6 mt-3"
    @input="$emit('input', $event)"
  ></VTextField>
</template>

<script>
export default {
  props: {
    search: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Search'
    },
    placeholder: {
      type: String,
      default: 'Type...'
    }
  }
}
</script>
