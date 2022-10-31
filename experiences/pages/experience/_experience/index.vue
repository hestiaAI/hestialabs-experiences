<template>
  <TheDataExperience2 v-bind="{ experienceConfig, siteConfig: $store.state.config }" />
</template>

<script>
import validate from '@/pages/validate'
import mixin from '@/mixins/page'

export default {
  mixins: [mixin],
  validate(context) {
    return validate.experience(context)
  },
  head() {
    const k =
      key => `experiences.${this.$route.params.experience}.intro.${key}`
    const t = this.$tev(k('title'), this.experienceConfig.title)
    const s = this.$tet(k('subtitle'), 'Data Experience')
    const metaTitle = `${t}: ${s}`
    return this.vueMeta(metaTitle)
  },
  computed: {
    experienceConfig() {
      return this.$store.getters.experience(
        this.$route
      )
    }
  }
}
</script>
