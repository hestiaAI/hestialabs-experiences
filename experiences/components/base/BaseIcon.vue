<template>
  <VIcon v-bind="$attrs">
    {{ mdiIcon }}
  </VIcon>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    }
  },
  computed: {
    mdiIcon() {
      return this.$vuetify.icons.values[this.icon]
    }
  }
}
</script>
