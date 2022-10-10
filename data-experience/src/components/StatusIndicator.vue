<template>
  <div>
    <VIcon
      v-if="error"
      :right="right"
      color="red"
    >
      $vuetify.icons.mdiAlert
    </VIcon>
    <VIcon
      v-else
      :right="right"
      color="green"
    >
      $vuetify.icons.mdiCheckCircle
    </VIcon>
  </div>
</template>

<script>
export default {
  name: 'StatusIndicator',
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
