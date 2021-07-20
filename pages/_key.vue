<template>
  <data-experience :identifier="$route.params.key" v-bind="currentDef" />
</template>

<script>
import defs from '@/definitions'

export default {
  beforeRouteEnter(to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
    if (to.params.key in defs) {
      return next()
    }

    next('/not-found')
  },
  data() {
    return {}
  },
  computed: {
    defKeyCamelCase() {
      return this.$route.params.key.replace(/-[a-z]/g, m => m[1].toUpperCase())
    },
    currentDef() {
      return defs[this.defKeyCamelCase]
    }
  }
}
</script>
