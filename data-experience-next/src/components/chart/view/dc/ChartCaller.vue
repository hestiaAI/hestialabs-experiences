<template>
  <component
    :is="component"
    v-bind="vizProps"
  />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    vizProps: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    component() {
      return () => import(`./chart/${this.type.replace(/\.vue$/, '')}.vue`)
    }
  }
}
</script>
