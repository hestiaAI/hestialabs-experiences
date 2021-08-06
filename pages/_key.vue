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
  head() {
    const { title: t, subtitle: s } = this.manifest
    const title = `${t}: ${s}`

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${title} | ${this.$appName}`
        }
      ]
    }
  },
  computed: {
    manifest() {
      return manifests[this.$route.params.key]
    }
  }
}
</script>
