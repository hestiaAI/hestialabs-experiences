<template>
  <data-experience :identifier="$route.params.key" v-bind="def" />
</template>

<script>
import defs from '@/definitions'

const defKeyToCamelCase = ({ params: { key } }) =>
  key.replace(/-[a-z]/g, m => m[1].toUpperCase())

export default {
  beforeRouteEnter(to, from, next) {
    if (defKeyToCamelCase(to) in defs) {
      return next()
    }

    next('/not-found')
  },
  data() {
    return {}
  },
  computed: {
    // defKeyCamelCase() {
    //   return this.$route.params.key.replace(/-[a-z]/g, m => m[1].toUpperCase())
    // },
    def() {
      return defs[defKeyToCamelCase(this.$route)]
    }
  }
}
</script>
