<template>
  <data-experience v-bind="manifest" />
</template>

<script>
import manifests from '@/manifests'

const keys = Object.keys(manifests)

export default {
  beforeRouteEnter(to, from, next) {
    if (keys.includes(to.params.key)) {
      return next()
    }

    next('/not-found')
  },
  data() {
    return {}
  },
  computed: {
    manifest() {
      return manifests[this.$route.params.key]
    }
  }
}
</script>
