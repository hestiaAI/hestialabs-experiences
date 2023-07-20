<template>
  <TheDataExperience
    v-bind="{
      experienceModule,
      siteConfig,
      bubbleConfig
    }"
  />
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page-experience'

export default {
  // https://github.com/nuxt-community/router-module/issues/67#issuecomment-726112465
  name: 'Index',
  mixins: [mixin],
  middleware: 'bubble-experiences-cdn',
  validate(context) {
    return validate.experience(context) && validate.bubble(context)
  },
  head() {
    const { experienceTitle: t, experienceSubtitle: s } = this
    const { title: spaceTitle } = this.bubbleConfig
    const metaTitle = `${t}: ${s} | ${spaceTitle} | ${this.$tc('Data Space', 1)}`
    return this.vueMeta(metaTitle)
  },
  computed: {
    bubbleConfig() {
      const { bubble } = this.$route.params
      return {
        ...this.$store.state.config.bubbleConfig[bubble],
        apiUrl: process.env.apiUrl,
        id: bubble
      }
    }
  }
}
</script>
