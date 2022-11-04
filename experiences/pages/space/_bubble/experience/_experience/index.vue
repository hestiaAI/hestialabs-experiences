<template>
  <TheDataExperience2
    v-bind="{
      experienceConfig,
      siteConfig: $store.state.config,
      bubbleConfig
    }"
  />
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page'

export default {
  mixins: [mixin],
  validate(context) {
    return validate.experience(context) && validate.bubble(context)
  },
  head() {
    const k =
      key => `experiences.${this.experience}.intro.${key}`
    const t = this.$tev(k('title'), this.experienceConfig.title)
    const s = this.$tet(k('subtitle'), 'Data Experience')

    const { title: bubbleTitle } = this.bubbleConfig

    const bubbleText = this.$tc('Data Space', 1)
    const metaBubbleTitle = this.$i18n.locale === 'fr' ? `${bubbleText} ${bubbleTitle}` : `${bubbleTitle} ${bubbleText}`

    const metaTitle = `${t}: ${s} | ${metaBubbleTitle}`
    return this.vueMeta(metaTitle)
  },
  computed: {
    experience() {
      return this.$route.params.experience
    },
    experienceConfig() {
      return this.$store.getters.experience(this.experience)
    },
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
