<template>
  <div>
    <div class="d-flex">
      <v-img max-width="50" :src="m.icon" contain />
      <h1 class="ml-3">{{ m.title }}</h1>
    </div>
    <p class="subtitle-1 mt-4">{{ m.subtitle }}</p>
    <the-data-experience v-bind="m.rest" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head() {
    const { title: t, subtitle: s } = this.m
    const title = `${t}: ${s}`

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${title} | ${process.env.appName}`
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['manifest']),
    m() {
      const { title, subtitle, icon, ...rest } = this.manifest(this.$route)
      return { title, subtitle, icon, rest }
    }
  }
}
</script>
