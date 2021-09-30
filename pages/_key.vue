<template>
  <!-- avoid double margin: we're already in a container -->
  <v-container class="ma-n3">
    <v-row class="no-gutters">
      <v-col>
        <div class="d-flex">
          <v-img max-width="50" :src="m.icon" :lazy-src="m.icon" contain />
          <h1 class="ml-3">{{ m.title }}</h1>
        </div>
        <p class="subtitle-1 mt-4">
          {{ m.subtitle }}
          <FacebookShareButton
            :url="baseUrl + $route.path"
            :title="`${appName}: ${title}`"
            :quote="description"
            :description="description"
            hashtags="dataprivacy"
            class="my-2 ml-4"
          />
          <TwitterShareButton
            :url="baseUrl + $route.path"
            :title="description"
            :hashtags="'dataprivacy,' + m.title"
            class="my-2 ml-2"
          />
        </p>
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
    const longTitle = `${title} | ${this.appName}`
    return {
      title,
      meta: [
        {
          hid: 'description',
          property: 'description',
          content: `${this.description}`
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: longTitle
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: `${this.description}`
        },
        {
          hid: 'twitter:card',
          property: 'twitter:card',
          content: 'summary'
        },
        {
          hid: 'twitter:site',
          property: 'twitter:site',
          content: '@HestiaLabs'
        },
        {
          hid: 'twitter:title',
          property: 'twitter:title',
          content: longTitle
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: `${this.description}`
        }
      ]
    }
  },
  data() {
    return {
      baseUrl: process.env.baseUrl,
      appName: process.env.appName
    }
  },
  computed: {
    description() {
      const title = this.m.title
      if (title) {
        return `Analyze the data collected on you by ${title}.`
      }
      return 'Analyze the data collected on you.'
    },
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
