<template>
  <base-button v-bind="{ disabled, text }">
    <template #prepend-icon>
      <v-icon left>$vuetify.icons.mdiShareVariant</v-icon>
    </template>
  </base-button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'Share'
    }
  }
}
</script>
