<template>
  <TheDataExperience v-bind="e" />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head() {
    const { title: t, subtitle: s } = this.experience(this.$route)
    const title = `${t}: ${s}`
    const longTitle = `${title} | ${this.appName}`
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: longTitle
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: longTitle
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['experience', 'appName']),
    e() {
      return this.experience(this.$route)
    }
  }
}
</script>
