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
            :title="`${appName}: ${m.title}`"
            :quote="description"
            :description="description"
            hashtags="hestialabs"
            class="my-2 ml-4"
          />
          <TwitterShareButton
            :url="baseUrl + $route.path"
            :title="description"
            :hashtags="hashtags"
            twitter-user="HestiaLabs"
            class="my-2 ml-2"
          />
        </p>
      </v-col>
    </v-row>
    <the-data-experience v-if="m.rest" v-bind="m.rest" />
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  middleware({ store, params, error }) {
    if (
      !store.getters.enabledExperiences.find(x => x.key === params.key)
    ) {
      return error({ statusCode: 404, message: 'Experience Not Found' })
    }
  },
  data() {
    return {
      baseUrl: process.env.baseUrl,
      appName: process.env.appName
    }
  },
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
  computed: {
    ...mapState(['config']),
    ...mapGetters(['manifest', 'keys']),
    description() {
      const title = this.m.title
      if (title) {
        return `Analyze the data collected on you by ${title}.`
      }
      return 'Analyze the data collected on you.'
    },
    m() {
      const manifest = this.manifest(this.$route)
      if (!manifest) {
        return {}
      }
      const title = manifest.title
      const { subtitle, icon, ...rest } = manifest
      return { title, subtitle, icon, rest }
    },
    hashtags() {
      const hashtags = [this.m.title]
      if (this.config.hashtags) {
        hashtags.push(...this.config.hashtags)
      }
      return hashtags.join(',')
    }
  }
}
</script>
