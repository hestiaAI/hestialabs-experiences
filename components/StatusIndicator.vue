<template>
  <div>
    <v-icon v-if="error" :right="right" color="red"
      >$vuetify.icons.mdiAlert</v-icon
    >
    <v-icon v-else :right="right" color="green"
      >$vuetify.icons.mdiCheckCircle</v-icon
    >
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Boolean,
      required: true
    },
    right: {
      type: Boolean,
      default: true
    }
  }
}
</script>
