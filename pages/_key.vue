<template>
  <!-- avoid double margin: we're already in a container -->
  <v-container class="ma-n3">
    <v-row class="no-gutters">
      <v-col>
        <div class="d-flex">
          <v-img max-width="50" :src="m.icon" :lazy-src="m.icon" contain />
          <h1 class="ml-3">{{ m.title }}</h1>
        </div>
        <p class="subtitle-1 mt-4">{{ m.subtitle }}</p>
      </v-col>
    </v-row>
    <the-data-experience v-if="m.rest" v-bind="m.rest" />
  </v-container>
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
    ...mapGetters(['manifest', 'config', 'keys']),
    m() {
      const manifest = this.manifest(this.$route)
      if (!manifest) {
        return {}
      }
      const { title, subtitle, icon, ...rest } = manifest
      return { title, subtitle, icon, rest }
    }
  },
  watch: {
    config(config) {
      const key = this.$route.params.key
      const configHasLoaded = !config.notLoaded
      if (configHasLoaded && !this.keys.includes(key)) {
        // Redirection to 404 cannot be done in a middleware
        // because we may need to wait for the config
        // Is there a better way to do this?

        // $nuxt.error is apparently an undocumented feature.
        // that works only on the client side
        // https://github.com/nuxt/nuxt.js/issues/555
        this.$nuxt.error({ statusCode: 404 })
      }
    }
  }
}
</script>
