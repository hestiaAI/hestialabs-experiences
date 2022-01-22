<template>
  <TheDataExperience v-if="m.rest" v-bind="m.rest" />
</template>

<script>
/*
<VRow class="no-gutters">
      <VCol>
        <div class="d-flex">
          <VImg max-width="50" :src="m.icon" :lazy-src="m.icon" contain />
          <h1 class="ml-3">{{ m.title }}</h1>
          <VSpacer />
          <BaseButtonShare color="primary" :outlined="false" />
        </div>
        <p class="subtitle-1 mt-4">
          {{ m.subtitle }}
        </p>
      </VCol>
    </VRow>
    */
import { mapState, mapGetters } from 'vuex'

export default {
  middleware({ store, params, error }) {
    if (!store.getters.enabledExperiences.find(x => x.key === params.key)) {
      return error({ statusCode: 404, message: 'Experience Not Found' })
    }
  },
  data() {
    return {}
  },
  head() {
    const {
      description,
      m: { title: t, subtitle: s }
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
    ...mapGetters(['manifest', 'keys', 'appName']),
    m() {
      const manifest = this.manifest(this.$route)
      if (!manifest) {
        return {}
      }
      const title = manifest.title
      const { subtitle, icon, ...rest } = manifest
      return { title, subtitle, icon, rest }
    }
  }
}
</script>
