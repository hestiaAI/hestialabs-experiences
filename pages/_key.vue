<template>
  <TheDataExperience v-bind="e" />
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  head() {
    const {
      description,
      e: { title: t, subtitle: s }
    } = this
    const title = `${t}: ${s}`
    const longTitle = `${title} | ${this.appName}`
    return {
      title,
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: description
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: longTitle
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: longTitle
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: description
        }
      ]
    }
  },
  computed: {
    ...mapState(['config']),
    ...mapGetters(['experience', 'appName']),
    e() {
      return this.experience(this.$route)
    }
  }
}
</script>
